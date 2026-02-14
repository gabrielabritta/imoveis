/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const DEFAULT_CONTACT = {
  site_name: 'Abritta Prime',
  hero_title: 'Imoveis de alto impacto para compras inteligentes.',
  hero_subtitle:
    'Da primeira visita a assinatura, conduzimos todo o processo com estrategia comercial e atencao aos detalhes.',
  brand_message:
    'Curadoria imobiliaria premium para quem busca decisao segura, negociacao inteligente e atendimento consultivo.',
  whatsapp_number: '',
  phone_number: '',
  email: '',
  address: '',
  business_hours_weekdays: '09:00 - 18:00',
  business_hours_saturday: '09:00 - 13:00',
  business_hours_sunday: 'Fechado',
}

const SiteContactContext = createContext({
  contact: DEFAULT_CONTACT,
  loading: true,
  error: null,
})

export function SiteContactProvider({ children }) {
  const [contact, setContact] = useState(DEFAULT_CONTACT)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function fetchSiteContact() {
      try {
        if (mounted) {
          setError(null)
        }
        const response = await fetch('/api/site-contact/')
        if (!response.ok) {
          throw new Error('Nao foi possivel carregar contato da imobiliaria')
        }
        const data = await response.json()
        if (mounted) {
          setContact({
            ...DEFAULT_CONTACT,
            ...data,
          })
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

    fetchSiteContact()

    return () => {
      mounted = false
    }
  }, [])

  const value = useMemo(
    () => ({
      contact,
      loading,
      error,
    }),
    [contact, loading, error]
  )

  return (
    <SiteContactContext.Provider value={value}>
      {children}
    </SiteContactContext.Provider>
  )
}

export function useSiteContact() {
  return useContext(SiteContactContext)
}
