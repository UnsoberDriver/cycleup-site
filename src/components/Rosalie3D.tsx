import { useEffect, useRef, useState } from 'react'
import { Inline, typo } from '../lib/inline'

/** Les configurations des plans officiels du Vhéliotech. */
const MODELS = [
  { id: 'basique', label: 'Basique', file: '/models/vheliotech-basique.glb', note: 'La configuration de départ' },
  { id: 'motorise', label: 'Motorisé', file: '/models/vheliotech-motorise.glb', note: 'Configuration motorisée' },
  { id: 'solaire', label: 'Solaire', file: '/models/vheliotech-solaire.glb', note: 'Avec panneau photovoltaïque' },
] as const

type ModelId = (typeof MODELS)[number]['id']

/** Fiche technique et sources, affichées à côté du modèle uniquement en plein écran.
 *  Compacte par conception : tout doit tenir à l'écran, sans défilement. */
function InfoPanel({ variant }: { variant: ModelId }) {
  const current = MODELS.find((m) => m.id === variant) ?? MODELS[0]
  return (
    <aside className="w-full shrink-0 bg-paper p-4 md:h-full md:w-[400px] md:overflow-hidden md:border-l md:border-rule md:p-6 lg:w-[460px]">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-commun">Fiche technique</p>
      <h3 className="mt-1.5 font-serif text-[1.3rem] leading-tight font-medium tracking-[-0.02em]">Le Vhéliotech en bref</h3>

      <p className="mt-2.5 text-[0.82rem] leading-[1.5] text-ink-soft">
        <Inline
          text={`Une **rosalie** est un vélo collectif à pédales (2 à 9 places, 3 ou 4 roues). Le Vhéliotech, affiché ici en configuration **${current.label.toLowerCase()}** (${current.note.toLowerCase()}), est un vélo-car à trois roues **autoconstructible** : plans et guide de montage libres (CERN-OHL-S v2) via [communaute.vhelio.org](https://communaute.vhelio.org).`}
        />
      </p>

      <dl className="mt-3 divide-y divide-rule overflow-hidden rounded-lg border border-rule text-[0.78rem]">
        {[
          ['Dimensions', '207 × 85 × 160 cm'],
          ['Poids à vide', '≈ 85 kg'],
          ['Charge utile', '200 kg (passagers inclus)'],
          ['Embarquement', '2 adultes + 2 enfants · conducteur 150–210 cm'],
          ['Roues', '3 (mécanique de vélo standard)'],
          ['Assistance', '25 km/h max (reste un vélo)'],
          ['Autonomie', '25 km/batterie · +8 km/h de soleil'],
        ].map(([dt, dd]) => (
          <div key={dt} className="grid grid-cols-[5.6rem_minmax(0,1fr)] gap-2 px-3 py-[0.35rem]">
            <dt className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-muted">{typo(dt)}</dt>
            <dd className="leading-snug text-ink-soft">{typo(dd)}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-[0.78rem] leading-[1.45] text-muted">
        <Inline text="Sources : [fiche Vhéliotech](https://vhelio.fr/objets/vheliotech) · [guide de montage v1.0.0, mai 2023](https://documentation.vhelio.org/vheliotech/guide-de-montage/v1.0.0) · [Fabrique des Mobilités](https://wiki.lafabriquedesmobilites.fr/wiki/Vheliotech), association Vélo Solaire Pour Tous." />
      </p>
    </aside>
  )
}

/**
 * Interactive 3D viewer of the Vhéliotech rosalie, converted from the official
 * free STEP plans (licence CERN-OHL-S v2) to GLBs served from /models/.
 * three.js and its addons are loaded on demand so the main bundle stays light.
 * The four configurations are loaded on first use and kept in memory afterwards.
 */
export function Rosalie3D() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [variant, setVariant] = useState<ModelId>('basique')
  const [switching, setSwitching] = useState(false)
  const [fs, setFs] = useState(false)
  const [unavailable, setUnavailable] = useState<Set<ModelId>>(new Set())
  // Runtime refs shared between the setup effect and the variant switcher.
  const sceneRef = useRef<import('three').Scene | null>(null)
  const cameraRef = useRef<import('three').PerspectiveCamera | null>(null)
  const currentRef = useRef<ModelId | null>(null)
  const cacheRef = useRef(new Map<ModelId, { group: import('three').Group; radius: number; distance: number }>())
  const busyRef = useRef(false)
  const disposedRef = useRef(false)

  // Synchronise l'état « plein écran » avec le navigateur (touche Échap incluse).
  useEffect(() => {
    const onChange = () => setFs(document.fullscreenElement === wrapRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    disposedRef.current = false

    async function setup() {
      try {
        const THREE = await import('three')
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
        if (disposedRef.current || !host) return

        const width = () => host.clientWidth || 600
        const height = () => host.clientHeight || 450

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(width(), height())
        renderer.domElement.setAttribute('aria-hidden', 'true')
        renderer.domElement.style.touchAction = 'none'
        // Canvas en position absolue : il ne doit jamais influer sur la hauteur du
        // conteneur (sinon la taille en px du plein écran déborde après la sortie).
        renderer.domElement.style.position = 'absolute'
        renderer.domElement.style.inset = '0'
        renderer.domElement.style.margin = '0 auto'
        host.appendChild(renderer.domElement)

        const scene = new THREE.Scene()
        sceneRef.current = scene
        const camera = new THREE.PerspectiveCamera(38, width() / height(), 1, 40000)
        cameraRef.current = camera

        const hemi = new THREE.HemisphereLight(0xffffff, 0x9aa89a, 1.1)
        hemi.position.set(0, 3000, 0)
        scene.add(hemi)
        const sun = new THREE.DirectionalLight(0xffffff, 1.4)
        sun.position.set(2200, 3200, 1800)
        scene.add(sun)
        const fill = new THREE.DirectionalLight(0xd8f66b, 0.35)
        fill.position.set(-1800, 900, -1600)
        scene.add(fill)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.08
        // Rotation libre : on regarde le modèle sous n'importe quel angle, même par-dessous.
        controls.minPolarAngle = 0
        controls.maxPolarAngle = Math.PI
        controls.enablePan = false
        // Rotation automatique douce, désactivée si l'utilisateur demande moins d'animations.
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        controls.autoRotate = !reduceMotion
        controls.autoRotateSpeed = 0.9

        /** Charge (ou reprend du cache) une configuration et l'affiche. */
        async function show(id: ModelId) {
          if (busyRef.current || disposedRef.current) return
          busyRef.current = true
          if (currentRef.current) setSwitching(true)
          const def = MODELS.find((m) => m.id === id) ?? MODELS[0]
          let entry = cacheRef.current.get(id)
          if (!entry) {
            try {
              const gltf = await new Promise<{ scene: import('three').Group }>((resolve, reject) => {
                new GLTFLoader().load(def.file, resolve, undefined, reject)
              })
              if (disposedRef.current) return
              const group = gltf.scene
              // Le STEP des plans est orienté Z vertical : on le remet à plat pour three.js (Y vertical).
              group.rotation.x = -Math.PI / 2
              entry = { group, radius: 1, distance: 10 }
              cacheRef.current.set(id, entry)
            } catch {
              // Configuration non disponible (conversion manquante) : on reste sur la vue en cours.
              busyRef.current = false
              setSwitching(false)
              setUnavailable((prev) => new Set(prev).add(id))
              if (!currentRef.current) setState('error')
              return
            }
          }
          // Remet le modèle à l'origine pour recalculer le cadrage à chaque affichage.
          entry.group.position.set(0, 0, 0)
          entry.group.updateMatrixWorld(true)
          const prev = scene.getObjectByName('vheliotech')
          if (prev) scene.remove(prev)
          entry.group.name = 'vheliotech'
          scene.add(entry.group)

          const box = new THREE.Box3().setFromObject(entry.group)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          entry.group.position.sub(center)
          entry.group.updateMatrixWorld(true)
          entry.radius = Math.max(size.x, size.y, size.z) * 0.5
          entry.distance = (entry.radius * 1.35) / Math.tan((camera.fov * Math.PI) / 360)
          controls.minDistance = entry.radius * 1.05
          controls.maxDistance = entry.distance * 2.4
          if (!currentRef.current) {
            // Premier affichage : cadrage 3/4. Ensuite on garde la vue de l'utilisateur.
            camera.position.set(entry.distance * 0.6, entry.distance * 0.42, entry.distance * 0.75)
            camera.near = entry.radius / 100
            camera.far = entry.distance * 10
            camera.updateProjectionMatrix()
            camera.lookAt(0, 0, 0)
            controls.target.set(0, 0, 0)
          }
          currentRef.current = id
          setVariant(id)
          setState('ready')
          setSwitching(false)
          busyRef.current = false
        }

        let raf = 0
        const tick = () => {
          controls.update()
          renderer.render(scene, camera)
          raf = requestAnimationFrame(tick)
        }
        tick()

        const onResize = () => {
          camera.aspect = width() / height()
          camera.updateProjectionMatrix()
          renderer.setSize(width(), height())
        }
        const ro = new ResizeObserver(onResize)
        ro.observe(host)
        onResize()
        // Stoppe l'auto-rotation dès que l'utilisateur saisit le modèle.
        const stopSpin = () => {
          controls.autoRotate = false
        }
        renderer.domElement.addEventListener('pointerdown', stopSpin)
        renderer.domElement.addEventListener('wheel', stopSpin, { passive: true })

        // Expose le changement de configuration pour le sélecteur React.
        ;(host as HTMLDivElement & { __showModel?: (id: ModelId) => void }).__showModel = show
        await show('basique')
        if (disposedRef.current) return

        cleanup = () => {
          cancelAnimationFrame(raf)
          ro.disconnect()
          renderer.domElement.removeEventListener('pointerdown', stopSpin)
          renderer.domElement.removeEventListener('wheel', stopSpin)
          controls.dispose()
          scene.traverse((obj) => {
            const mesh = obj as import('three').Mesh
            if (mesh.geometry) mesh.geometry.dispose()
            const mat = mesh.material as import('three').Material | import('three').Material[] | undefined
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
            else mat?.dispose()
          })
          renderer.dispose()
          renderer.domElement.remove()
        }
      } catch {
        if (!disposedRef.current) setState('error')
      }
    }

    let cleanup: (() => void) | undefined
    setup()
    return () => {
      disposedRef.current = true
      cleanup?.()
    }
  }, [])

  function switchVariant(id: ModelId) {
    if (id === variant || busyRef.current) return
    const host = hostRef.current as (HTMLDivElement & { __showModel?: (id: ModelId) => void }) | null
    host?.__showModel?.(id)
  }

  function toggleFullscreen() {
    const wrap = wrapRef.current
    if (!wrap) return
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else wrap.requestFullscreen?.().catch(() => {})
  }

  return (
    <div
      ref={wrapRef}
      className={`modern-surface my-10 overflow-hidden ${fs ? 'flex h-full flex-col' : 'rounded-[1.25rem]'}`}
    >
      <div className={fs ? 'flex min-h-0 flex-1 flex-col md:flex-row' : undefined}>
        <div
          ref={hostRef}
          className={`relative w-full bg-[linear-gradient(180deg,#f6f8f4_0%,#e9efe6_100%)] ${
            fs ? 'min-h-0 flex-1' : 'aspect-[4/3]'
          }`}
          style={{ cursor: state === 'ready' ? 'grab' : 'default' }}
        >
          {state === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-commun border-t-transparent" aria-hidden="true" />
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Chargement du modèle 3D…</p>
            </div>
          )}
          {state === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
              <p className="text-sm text-muted">
                Le modèle 3D ne peut pas s'afficher sur cet appareil (WebGL indisponible). Les plans restent{' '}
                <a
                  href="https://vhelio.fr/objets/vheliotech"
                  target="_blank"
                  rel="noreferrer"
                  className="prose-link text-ink"
                >
                  téléchargeables sur vhelio.fr
                </a>
                .
              </p>
            </div>
          )}
          {state === 'ready' && (
            <>
              <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-paper/85 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted backdrop-blur">
                Glisser : pivoter · Molette / pincer : zoom
              </span>
              {switching && (
                <span className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-paper/85 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted backdrop-blur">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-commun border-t-transparent" aria-hidden="true" />
                  Chargement…
                </span>
              )}
              {fs && !switching && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label="Quitter le plein écran"
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-paper/90 text-ink shadow-sm backdrop-blur transition-colors hover:border-ink/30 hover:bg-commun-soft"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
        {fs && <InfoPanel variant={variant} />}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-rule px-4 py-2.5 md:px-6">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Configuration du Vhéliotech">
          {MODELS.map((m) => {
            const missing = unavailable.has(m.id)
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => switchVariant(m.id)}
                disabled={missing}
                aria-pressed={variant === m.id}
                title={missing ? 'Modèle indisponible' : m.note}
                className={`rounded-full border px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] transition-colors ${
                  variant === m.id
                    ? 'border-ink bg-ink text-paper'
                    : missing
                      ? 'cursor-not-allowed border-ink/10 text-muted/60 line-through'
                      : 'border-ink/15 text-ink-soft hover:border-ink/30 hover:bg-commun-soft hover:text-ink'
                }`}
              >
                {m.label}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="inline-flex items-center gap-1.5 rounded-md border border-ink/15 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-soft transition-colors hover:border-ink/30 hover:bg-commun-soft hover:text-ink"
        >
          {fs ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4" />
              </svg>
              Quitter le plein écran
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
              Plein écran
            </>
          )}
        </button>
      </div>
    </div>
  )
}
