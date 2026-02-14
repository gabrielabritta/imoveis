import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Bath,
  Bed,
  Car,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Maximize,
  PlayCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { formatArea, formatPrice } from '@/lib/utils'

function buildFallbackMedia(property) {
  const fallback = []
  if (property.main_image) {
    fallback.push({
      type: 'image',
      url: property.main_image,
      caption: property.title,
      order: -1,
      is_main: true,
    })
  }
  if (property.images?.length) {
    property.images.forEach((image) => {
      if (image.image) {
        fallback.push({
          type: 'image',
          url: image.image,
          caption: image.caption,
          order: image.order ?? 0,
          is_main: false,
        })
      }
    })
  }
  return fallback
}

export function PropertyDetail() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)

  useEffect(() => {
    let mounted = true

    async function fetchProperty() {
      try {
        if (mounted) {
          setError(null)
        }
        const response = await fetch(`/api/properties/${id}/`)
        if (!response.ok) {
          throw new Error('Imovel nao encontrado')
        }
        const data = await response.json()
        if (mounted) {
          setProperty(data)
        }
      } catch (err) {
        if (mounted) {
          setError(err.message)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchProperty()

    return () => {
      mounted = false
    }
  }, [id])

  const mediaGallery = useMemo(() => {
    if (!property) return []
    if (property.media_gallery?.length) return property.media_gallery
    return buildFallbackMedia(property)
  }, [property])

  useEffect(() => {
    setCurrentMediaIndex(0)
  }, [id, mediaGallery.length])

  const currentMedia = mediaGallery[currentMediaIndex]

  const goToNextMedia = () => {
    setCurrentMediaIndex((previous) => (previous + 1) % mediaGallery.length)
  }

  const goToPreviousMedia = () => {
    setCurrentMediaIndex((previous) => (previous - 1 + mediaGallery.length) % mediaGallery.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto" />
          <p className="mt-4 text-[var(--text-secondary)]">Carregando imovel...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-lg text-red-700">{error || 'Imovel nao encontrado'}</p>
          <Link to="/imoveis">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para marketplace
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[var(--bg-main)] pb-14">
      <div className="container mx-auto px-4 py-5 md:px-6">
        <Link to="/imoveis">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para marketplace
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
              <div className="relative aspect-[16/10] bg-[var(--bg-alt)]">
                {currentMedia ? (
                  currentMedia.type === 'video' ? (
                    <video
                      src={currentMedia.url}
                      controls
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img src={currentMedia.url} alt={property.title} className="h-full w-full object-cover" />
                  )
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                    Midia indisponivel
                  </div>
                )}

                {mediaGallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goToPreviousMedia}
                      className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--text-primary)] shadow-md"
                      aria-label="Midia anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={goToNextMedia}
                      className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--text-primary)] shadow-md"
                      aria-label="Proxima midia"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                <div className="absolute left-4 top-4 flex gap-2">
                  {property.is_featured && (
                    <Badge className="border-0 bg-[var(--accent)] text-[var(--accent-contrast)]">Destaque</Badge>
                  )}
                  <Badge variant="secondary" className="border border-white/60 bg-white/90 text-[var(--text-primary)]">
                    {property.property_type_display}
                  </Badge>
                  {currentMedia?.type === 'video' && (
                    <Badge variant="secondary" className="inline-flex items-center gap-1 border border-white/60 bg-white/90 text-[var(--text-primary)]">
                      <PlayCircle className="h-3.5 w-3.5" />
                      Video
                    </Badge>
                  )}
                </div>
              </div>

              {mediaGallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto border-t border-[var(--border-soft)] bg-[var(--surface)] p-3">
                  {mediaGallery.map((media, index) => (
                    <button
                      key={`${media.type}-${index}`}
                      type="button"
                      onClick={() => setCurrentMediaIndex(index)}
                      className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                        index === currentMediaIndex
                          ? 'border-[var(--accent)]'
                          : 'border-transparent hover:border-[var(--border-strong)]'
                      }`}
                    >
                      {media.type === 'video' ? (
                        <div className="flex h-full w-full items-center justify-center bg-[var(--text-primary)] text-[var(--accent-contrast)]">
                          <PlayCircle className="h-6 w-6" />
                        </div>
                      ) : (
                        <img src={media.url} alt={`Midia ${index + 1}`} className="h-full w-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <section className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] md:p-8">
              <h1 className="text-3xl [font-family:var(--font-display)]">{property.title}</h1>
              <div className="mt-3 flex items-start gap-2 text-[var(--text-secondary)]">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                <span>
                  {property.address}
                  {property.neighborhood && `, ${property.neighborhood}`}
                  {` - ${property.city}/${property.state}`}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-alt)] p-4 md:grid-cols-4">
                <div className="space-y-1">
                  <p className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                    <Bed className="h-4 w-4 text-[var(--accent)]" />
                    Quartos
                  </p>
                  <p className="text-lg font-semibold">{property.bedrooms}</p>
                </div>
                <div className="space-y-1">
                  <p className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                    <Bath className="h-4 w-4 text-[var(--accent)]" />
                    Banheiros
                  </p>
                  <p className="text-lg font-semibold">{property.bathrooms}</p>
                </div>
                <div className="space-y-1">
                  <p className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                    <Car className="h-4 w-4 text-[var(--accent)]" />
                    Vagas
                  </p>
                  <p className="text-lg font-semibold">{property.parking_spots}</p>
                </div>
                <div className="space-y-1">
                  <p className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                    <Maximize className="h-4 w-4 text-[var(--accent)]" />
                    Area
                  </p>
                  <p className="text-lg font-semibold">{formatArea(property.area)}</p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-semibold">Descricao</h2>
                <p className="mt-3 whitespace-pre-line text-[var(--text-secondary)]">{property.description}</p>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] lg:sticky lg:top-24">
              <p className="text-sm text-[var(--text-muted)]">Valor do imovel</p>
              <p className="mt-2 text-3xl font-semibold [font-family:var(--font-display)]">
                {formatPrice(property.price)}
              </p>
              <div className="mt-5 space-y-3">
                <WhatsAppButton
                  message={`Ola, tenho interesse no imovel ${property.title}`}
                  size="lg"
                  className="w-full justify-center"
                >
                  Conversar no WhatsApp
                </WhatsAppButton>
              </div>
              <p className="mt-5 border-t border-[var(--border-soft)] pt-4 text-xs text-[var(--text-muted)]">
                Codigo do imovel: #{property.id}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
