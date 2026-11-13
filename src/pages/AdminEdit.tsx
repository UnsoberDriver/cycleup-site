import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router'

export function AdminEditPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // Check for admin token in storage
  const token = localStorage.getItem('mobilites-admin-token') || sessionStorage.getItem('mobilites-admin-token')
  const isAdmin = token ? true : false

  // State to control whether we show the admin UI or redirect
  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => {
    if (isAdmin) {
      setShowAdmin(true)
    } else {
      navigate('/connexion', { replace: true })
    }
  }, [isAdmin, navigate])

  // If not admin, we already redirected, so nothing to render
  if (!showAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-paper-deep/95">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper-deep/95">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-6 px-5 md:px-8">
          <div>Administration</div>
          <button onClick={() => setShowAdmin(!showAdmin)} className="bg-commun text-paper">
            {showAdmin ? 'Masquer admin' : 'Afficher administration'}
          </button>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-[1440px] px-5 md:px-8">
        <div className="p-6 bg-paper rounded-lg">
          <h2 className="text-xl font-medium mb-4">Tableau de bord administration</h2>
          <p className="text-muted">Bienvenue dans l'espace d'administration.</p>
          <p>Cette interface vous permet de gérer le contenu du site.</p>
          <p>Fonctions disponibles : gestion des cartes, modification du contenu, suppression.</p>
        </div>
      </main>
    </div>
  )
}