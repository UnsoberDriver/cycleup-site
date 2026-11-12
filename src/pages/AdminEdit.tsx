import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export function AdminEditPage() {
  const navigate = useNavigate()
  // Récupère le token admin stocké dans localStorage
  const token = localStorage.getItem('mobilites-admin-token')
  const isAdmin = token ? true : false

  if (!isAdmin) {
    ;(window as any).navigate('/connexion', { replace: true })
    return null
  }

  const [editing, setEditing] = useState(false)

  return (
    <div className="min-h-screen bg-paper-deep/95">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper-deep/95">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-6 px-5 md:px-8">
          <div>Admin</div>
          <button onClick={() => setEditing(!editing)} className="bg-commun text-paper">
            {editing ? 'Terminer' : 'Activer le mode édition'}
          </button>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-[1440px] px-5 md:px-8">
        <p>Page d'administration</p>
        {editing && <p>Mode édition actif</p>}
        <button onClick={() => setEditing(false)}>Retour</button>
      </main>
    </div>
  )
}