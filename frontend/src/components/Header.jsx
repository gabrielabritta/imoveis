import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { useSiteContact } from '@/context/SiteContactContext'

const navLinkClass = ({ isActive }) =>
  `text-sm font-semibold tracking-wide transition ${
    isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
  }`

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { contact } = useSiteContact()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-soft)] bg-[var(--surface)]/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-20 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Anello Imóveis" className="h-11 w-11 rounded-xl object-contain shadow-[var(--shadow-sm)]" />
          <div>
            <p className="text-lg font-semibold leading-none [font-family:var(--font-display)]">
              {contact.site_name}
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">Imoveis</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Inicio
          </NavLink>
          <NavLink to="/imoveis" className={navLinkClass}>
            Marketplace
          </NavLink>
          <WhatsAppButton
            hideWhenUnavailable
            message="Ola, gostaria de falar com um consultor."
            size="sm"
            className="ml-3"
          >
            Fale conosco
          </WhatsAppButton>
          {!contact.whatsapp_number && (
            <span className="text-xs text-[var(--text-muted)]">WhatsApp indisponivel</span>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-strong)] bg-white text-[var(--text-primary)] md:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[var(--border-soft)] bg-[var(--surface)] md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <NavLink to="/" end className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Inicio
            </NavLink>
            <NavLink to="/imoveis" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Marketplace
            </NavLink>
            <WhatsAppButton
              hideWhenUnavailable
              message="Ola, gostaria de falar com um consultor."
              size="default"
              className="w-full justify-center"
            >
              Fale conosco
            </WhatsAppButton>
          </nav>
        </div>
      )}
    </header>
  )
}
