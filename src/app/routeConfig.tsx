import { lazy, Suspense, type ReactNode } from 'react'
import type { RouteObject } from 'react-router'
import { Root } from '../components/Root'
import { CONTENT_PAGES } from '../content/pages'
import { ContentPage } from '../pages/ContentPage'
import { Home } from '../pages/Home'

const NotFound = lazy(() => import('../pages/NotFound').then((m) => ({ default: m.NotFound })))
const Bibliographie = lazy(() => import('../pages/Resources').then((m) => ({ default: m.Bibliographie })))
const Chronologie = lazy(() => import('../pages/Resources').then((m) => ({ default: m.Chronologie })))
const Glossaire = lazy(() => import('../pages/Resources').then((m) => ({ default: m.Glossaire })))
const Acteurs = lazy(() => import('../pages/Resources').then((m) => ({ default: m.Acteurs })))
const LoginPage = lazy(() => import('../pages/AdminPrototype').then((m) => ({ default: m.LoginPage })))
const AdminPage = lazy(() => import('../pages/AdminPrototype').then((m) => ({ default: m.AdminPage })))
const ContactPage = lazy(() => import('../pages/Contact').then((m) => ({ default: m.ContactPage })))
const ProjectsPage = lazy(() => import('../pages/ProjectsMap').then((m) => ({ default: m.ProjectsPage })))
const MapPage = lazy(() => import('../pages/ProjectsMap').then((m) => ({ default: m.MapPage })))
const ForumPage = lazy(() => import('../pages/Forum').then((m) => ({ default: m.ForumPage })))

function Fallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" aria-busy="true">
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">Chargement…</span>
    </div>
  )
}

const defer = (el: ReactNode) => <Suspense fallback={<Fallback />}>{el}</Suspense>

export const routeConfig: RouteObject[] = [
    {
      path: '/',
      Component: Root,
      children: [
        { index: true, Component: Home },
        { path: 'partie-1', element: defer(<ProjectsPage />) },
        { path: 'partie-2', element: defer(<MapPage />) },
        ...CONTENT_PAGES.map((page) => ({
          path: page.path.replace(/^\/|\/$/g, ''),
          element: <ContentPage key={page.path} page={page} />,
        })),
        { path: 'ressources', element: defer(<ForumPage />) },
        { path: 'ressources/chronologie', element: defer(<Chronologie />) },
        { path: 'ressources/glossaire', element: defer(<Glossaire />) },
        { path: 'ressources/bibliographie', element: defer(<Bibliographie />) },
        { path: 'ressources/acteurs', element: defer(<Acteurs />) },
        { path: 'contact', element: defer(<ContactPage />) },
        { path: '404', element: defer(<NotFound />) },
        { path: '*', element: defer(<NotFound />) },
      ],
    },
    { path: '/connexion', element: defer(<LoginPage />) },
    { path: '/administration', element: defer(<AdminPage />) },
]
