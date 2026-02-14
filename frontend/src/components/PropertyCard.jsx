import { Link } from 'react-router-dom'
import { Bath, Bed, Car, Maximize } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatArea, formatPrice } from '@/lib/utils'
import { getMediaUrl } from '@/lib/api'
import { WhatsAppButton } from '@/components/WhatsAppButton'

export function PropertyCard({ property }) {
  const imageUrl = getMediaUrl(property.main_image)
  const whatsAppMessage = `Ola, tenho interesse no imovel ${property.title}`

  return (
    <Link to={`/imovel/${property.id}`} className="block">
      <Card className="group overflow-hidden rounded-2xl border-[var(--border-soft)] bg-[var(--surface)] shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-alt)]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={property.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
              Sem imagem
            </div>
          )}

          <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
            <div className="flex gap-2">
              {property.is_featured && (
                <Badge className="border-0 bg-[var(--accent)] text-[var(--accent-contrast)]">Destaque</Badge>
              )}
              <Badge variant="secondary" className="border border-white/50 bg-white/90 text-[var(--text-primary)]">
                {property.property_type_display}
              </Badge>
            </div>
          </div>
          <div className="absolute bottom-3 left-3 rounded-md bg-[var(--text-primary)] px-3 py-1 text-sm font-semibold text-[var(--accent-contrast)]">
            {formatPrice(property.price)}
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <h3 className="line-clamp-1 text-lg font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">
              {property.title}
            </h3>
            <p className="mt-1 line-clamp-1 text-sm text-[var(--text-secondary)]">
              {property.neighborhood && `${property.neighborhood}, `}
              {property.city}/{property.state}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-[var(--text-secondary)]">
            <div className="inline-flex items-center gap-1.5">
              <Bed className="h-4 w-4 text-[var(--accent)]" />
              {property.bedrooms} quartos
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-[var(--accent)]" />
              {property.bathrooms} banheiros
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Car className="h-4 w-4 text-[var(--accent)]" />
              {property.parking_spots} vagas
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Maximize className="h-4 w-4 text-[var(--accent)]" />
              {formatArea(property.area)}
            </div>
          </div>

          <div className="border-t border-[var(--border-soft)] pt-4">
            <WhatsAppButton message={whatsAppMessage} size="sm" className="w-full justify-center">
              Falar sobre este imovel
            </WhatsAppButton>
          </div>
        </div>
      </Card>
    </Link>
  )
}
