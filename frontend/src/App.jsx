import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Home } from '@/pages/Home'
import { PropertyDetail } from '@/pages/PropertyDetail'
import { PropertiesMarketplace } from '@/pages/PropertiesMarketplace'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)]">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/imoveis" element={<PropertiesMarketplace />} />
            <Route path="/imovel/:id" element={<PropertyDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
