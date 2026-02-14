import { useEffect, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { PropertyCard } from '@/components/PropertyCard'
import { Spinner } from '@/components/ui/spinner'

const SORT_OPTIONS = [
  { value: 'price_desc', label: 'Maior preco' },
  { value: 'price_asc', label: 'Menor preco' },
]

export function PropertiesMarketplace() {
  const [properties, setProperties] = useState([])
  const [sort, setSort] = useState('price_desc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function fetchProperties() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/properties/?sort=${sort}`)
        if (!response.ok) {
          throw new Error('Erro ao carregar os imoveis')
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
  }, [sort])

  return (
    <div className="pb-16">
      <section className="border-b border-[var(--border-strong)] bg-[var(--surface)]/80">
        <div className="container mx-auto px-4 py-10 md:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Marketplace Imobiliario
          </p>
          <h1 className="mt-3 text-4xl font-semibold [font-family:var(--font-display)] md:text-5xl">
            Todos os imoveis disponiveis
          </h1>
          <p className="mt-3 max-w-2xl text-[var(--text-secondary)]">
            Explore o catalogo completo e ordene rapidamente por preco para encontrar a melhor oportunidade.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-4">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
            <SlidersHorizontal className="h-4 w-4" />
            Ordenacao por preco
          </div>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-10 min-w-44 rounded-lg border border-[var(--border-strong)] bg-white px-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Spinner size="lg" className="mx-auto" />
              <p className="mt-4 text-[var(--text-secondary)]">Carregando imoveis...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            {error}
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-10 text-center text-[var(--text-secondary)]">
            Nenhum imovel disponivel no momento.
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-[var(--text-muted)]">
              {properties.length} imoveis encontrados
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
