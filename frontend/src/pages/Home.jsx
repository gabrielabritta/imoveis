import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Building2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PropertyCard } from '@/components/PropertyCard'
import { Spinner } from '@/components/ui/spinner'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { useSiteContact } from '@/context/SiteContactContext'

export function Home() {
  const { contact } = useSiteContact()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function fetchProperties() {
      try {
        if (mounted) {
          setError(null)
        }
        const response = await fetch('/api/properties/')
        if (!response.ok) {
          throw new Error('Erro ao carregar imoveis')
        }
        const data = await response.json()
        if (mounted) {
          setProperties(data)
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

    fetchProperties()

    return () => {
      mounted = false
    }
  }, [])

  const featuredPreview = useMemo(
    () => properties.filter((property) => property.is_featured).slice(0, 6),
    [properties]
  )

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden border-b border-[var(--border-strong)] bg-[var(--text-primary)] text-[var(--accent-contrast)]">
        <div className="hero-pattern absolute inset-0 opacity-70" />
        <div className="container relative z-10 mx-auto px-4 py-16 md:px-6 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
              <Sparkles className="h-4 w-4" />
              Curadoria Premium
            </div>
            <h1 className="mt-6 text-4xl leading-tight [font-family:var(--font-display)] md:text-6xl">
              {contact.hero_title}
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/80 md:text-lg">
              {contact.hero_subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/imoveis"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-contrast)] transition hover:brightness-95"
              >
                Ver marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <WhatsAppButton size="lg" message="Ola, quero ajuda para escolher um imovel.">
                Falar com consultor
              </WhatsAppButton>
            </div>

            <div className="mt-8 inline-flex items-center gap-2 text-sm text-white/80">
              <Building2 className="h-5 w-5" />
              {properties.length} imoveis ativos no catalogo
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Selecao</p>
            <h2 className="mt-2 text-3xl [font-family:var(--font-display)] md:text-4xl">Imoveis em destaque</h2>
          </div>
          <Link
            to="/imoveis"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Spinner size="lg" className="mx-auto" />
              <p className="mt-4 text-[var(--text-secondary)]">Carregando imoveis...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>
        ) : featuredPreview.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-10 text-center text-[var(--text-secondary)]">
            Nenhum imovel disponivel no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredPreview.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
