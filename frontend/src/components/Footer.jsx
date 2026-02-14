import { Building2, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSiteContact } from '@/context/SiteContactContext'

function FieldValue({ value, fallback = 'Nao informado' }) {
  if (!value) {
    return <span className="text-[var(--text-muted)]">{fallback}</span>
  }
  return <span>{value}</span>
}

export function Footer() {
  const { contact } = useSiteContact()

  return (
    <footer id="contato" className="border-t border-[var(--border-soft)] bg-[var(--surface)]">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--text-primary)] text-[var(--accent-contrast)]">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold [font-family:var(--font-display)]">{contact.site_name}</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">Imoveis</p>
              </div>
            </Link>
            <p className="max-w-sm text-sm text-[var(--text-secondary)]">
              <FieldValue
                value={contact.brand_message}
                fallback="Curadoria imobiliaria premium para quem busca decisao segura, negociacao inteligente e atendimento consultivo."
              />
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Contato</h4>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[var(--accent)]" />
                <FieldValue value={contact.phone_number} />
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[var(--accent)]" />
                <FieldValue value={contact.email} />
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                <FieldValue value={contact.address} />
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Horarios</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center justify-between gap-6">
                <span>Segunda a Sexta</span>
                <span className="font-semibold">
                  <FieldValue value={contact.business_hours_weekdays} fallback="Fechado" />
                </span>
              </li>
              <li className="flex items-center justify-between gap-6">
                <span>Sabado</span>
                <span className="font-semibold">
                  <FieldValue value={contact.business_hours_saturday} fallback="Fechado" />
                </span>
              </li>
              <li className="flex items-center justify-between gap-6">
                <span>Domingo</span>
                <span className="font-semibold">
                  <FieldValue value={contact.business_hours_sunday} fallback="Fechado" />
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border-soft)] pt-6 text-center text-xs text-[var(--text-muted)]">
          © 2026 {contact.site_name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
