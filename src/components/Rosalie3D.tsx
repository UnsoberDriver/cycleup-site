import { useEffect, useRef, useState } from 'react'

/**
 * Interactive 3D viewer of the Vhéliotech rosalie, converted from the official
 * free STEP plans (licence CERN-OHL-S v2) to a GLB served from /models/.
 * three.js and its addons are loaded on demand so the main bundle stays light.
 */
export function Rosalie3D() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

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
        scene.add(model)

        // Frame the whole vehicle: centre it and pull the camera back to fit.
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        model.position.sub(center)
        const radius = Math.max(size.x, size.y, size.z) * 0.5
        const distance = (radius * 1.35) / Math.tan((camera.fov * Math.PI) / 360)
        camera.position.set(distance * 0.62, distance * 0.5, distance * 0.72)
        camera.near = radius / 100
        camera.far = distance * 10
        camera.updateProjectionMatrix()
        camera.lookAt(0, 0, 0)

        // Ground shadow disc for a soft contact feel.
        const ground = new THREE.Mesh(
          new THREE.CircleGeometry(radius * 1.05, 64),
          new THREE.ShadowMaterial({ opacity: 0 }),
        )
        ground.rotation.x = -Math.PI / 2
        ground.position.y = box.min.y - center.y
        scene.add(ground)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.target.set(0, 0, 0)
        controls.enableDamping = true
        controls.dampingFactor = 0.08
        controls.minDistance = radius * 1.05
        controls.maxDistance = distance * 2.4
        controls.maxPolarAngle = Math.PI * 0.55
        // Auto-rotation douce, désactivée si l'utilisateur demande moins d'animations.
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

  return (
    <div className="modern-surface my-10 overflow-hidden rounded-[1.25rem]">
      <div
        ref={hostRef}
        className="relative aspect-[4/3] w-full bg-[linear-gradient(180deg,#f6f8f4_0%,#e9efe6_100%)]"
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
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-rule px-4 py-2.5 md:px-6">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
          Vhéliotech « basique » — plans 3D officiels (GLB)
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
          Glisser : pivoter · Molette : zoom
        </span>
      </div>
    </div>
  )
}
