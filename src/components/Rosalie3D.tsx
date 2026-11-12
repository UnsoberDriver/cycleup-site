import { useEffect, useRef, useState } from 'react'

/**
 * Interactive 3D viewer of the Vhéliotech rosalie, converted from the official
 * free STEP plans (licence CERN-OHL-S v2) to a GLB served from /models/.
 * three.js and its addons are loaded on demand so the main bundle stays light.
 */
export function Rosalie3D() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [fs, setFs] = useState(false)

  // Synchronise l'état « plein écran » avec le navigateur (touche Échap incluse).
  useEffect(() => {
    const onChange = () => setFs(document.fullscreenElement === wrapRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let disposed = false
    let cleanup: (() => void) | undefined

    async function setup() {
      try {
        const THREE = await import('three')
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
        if (disposed || !host) return

        const width = () => host.clientWidth || 600
        const height = () => host.clientHeight || 450

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(width(), height())
        renderer.domElement.setAttribute('aria-hidden', 'true')
        renderer.domElement.style.touchAction = 'none'
        host.appendChild(renderer.domElement)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(38, width() / height(), 1, 40000)

        const hemi = new THREE.HemisphereLight(0xffffff, 0x9aa89a, 1.1)
        hemi.position.set(0, 3000, 0)
        scene.add(hemi)
        const sun = new THREE.DirectionalLight(0xffffff, 1.4)
        sun.position.set(2200, 3200, 1800)
        scene.add(sun)
        const fill = new THREE.DirectionalLight(0xd8f66b, 0.35)
        fill.position.set(-1800, 900, -1600)
        scene.add(fill)

        const gltf = await new Promise<{ scene: import('three').Group }>((resolve, reject) => {
          new GLTFLoader().load('/models/vheliotech-basique.glb', resolve, undefined, reject)
        })
        if (disposed) return
        const model = gltf.scene
        // Le STEP des plans est orienté Z vertical : on le remet à plat pour three.js (Y vertical).
        model.rotation.x = -Math.PI / 2
        model.updateMatrixWorld(true)
        scene.add(model)

        // Frame the whole vehicle: centre it and pull the camera back to fit.
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        model.position.sub(center)
        model.updateMatrixWorld(true)
        const radius = Math.max(size.x, size.y, size.z) * 0.5
        const distance = (radius * 1.35) / Math.tan((camera.fov * Math.PI) / 360)
        camera.position.set(distance * 0.6, distance * 0.42, distance * 0.75)
        camera.near = radius / 100
        camera.far = distance * 10
        camera.updateProjectionMatrix()
        camera.lookAt(0, 0, 0)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.target.set(0, 0, 0)
        controls.enableDamping = true
        controls.dampingFactor = 0.08
        // Rotation libre : on regarde le modèle sous n'importe quel angle, même par-dessous.
        controls.minPolarAngle = 0
        controls.maxPolarAngle = Math.PI
        controls.enablePan = false
        controls.minDistance = radius * 1.05
        controls.maxDistance = distance * 2.4
        // Rotation automatique douce, désactivée si l'utilisateur demande moins d'animations.
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        controls.autoRotate = !reduceMotion
        controls.autoRotateSpeed = 0.9

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
        // Stoppe l'auto-rotation dès que l'utilisateur saisit le modèle.
        const stopSpin = () => {
          controls.autoRotate = false
        }
        renderer.domElement.addEventListener('pointerdown', stopSpin)
        renderer.domElement.addEventListener('wheel', stopSpin, { passive: true })

        setState('ready')
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
        if (!disposed) setState('error')
      }
    }

    setup()
    return () => {
      disposed = true
      cleanup?.()
    }
  }, [])

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
      <div
        ref={hostRef}
        className={`relative w-full bg-[linear-gradient(180deg,#f6f8f4_0%,#e9efe6_100%)] ${
          fs ? 'min-h-0 flex-1' : 'aspect-[4/3]'
        }`}
        style={{ cursor: state === 'ready' ? 'grab' : 'default' }}
      >
        {state !== 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            {state === 'loading' ? (
              <>
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-commun border-t-transparent" aria-hidden="true" />
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Chargement du modèle 3D…</p>
              </>
            ) : (
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
            )}
          </div>
        )}
        {state === 'ready' && (
          <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-paper/85 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted backdrop-blur">
            Glisser : pivoter · Molette / pincer : zoom
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-rule px-4 py-2.5 md:px-6">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
          Vhéliotech « basique » — plans 3D officiels (GLB)
        </span>
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
