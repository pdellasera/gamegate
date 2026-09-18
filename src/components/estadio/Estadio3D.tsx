import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { useVenta } from '../../store/venta'
import { useSector } from '../../hooks/usePos'
import seatLayout from '../../data/seatLayout.json'
import { SECCIONES } from '../../data/secciones'
import { formatPrecio } from '../../lib/format'
import type { Asiento, Sector } from '../../types'

interface Estadio3DProps {
  url: string
  zoom: number
  selectedId: string
  onSelect: (id: string) => void
  onProgress: (pct: number) => void
  onReady: () => void
  onError: (e: unknown) => void
}

const COLOR: Record<string, number> = {
  disponible: 0x22c55e,
  seleccionado: 0x0b6bff,
  ocupado: 0xf87171,
  bloqueado: 0xcbd5e1,
}

interface Layout {
  center: number[]
  rx: number
  ry: number
  profile: number[][]
}
const LAYOUT = seatLayout as Layout

const CX = LAYOUT.center[0]
const CZ = LAYOUT.center[1]
const CY = LAYOUT.center[2]
const RX = LAYOUT.rx
const RZ = LAYOUT.ry

function heightAt(nr: number): number {
  const p = LAYOUT.profile
  if (nr <= p[0][0]) return p[0][1]
  for (let k = 1; k < p.length; k++) {
    if (p[k][0] >= nr) {
      const a = p[k - 1]
      const b = p[k]
      const t = (nr - a[0]) / (b[0] - a[0])
      return a[1] + t * (b[1] - a[1])
    }
  }
  return p[p.length - 1][1]
}

const LIFT = 0.006

function ringSegmentGeometry(nrInner: number, nrOuter: number, a0: number, a1: number): THREE.BufferGeometry {
  const segAngular = 18
  const positions: number[] = []
  const indices: number[] = []
  const cols = segAngular + 1
  for (let i = 0; i <= 1; i++) {
    const nr = nrInner + (nrOuter - nrInner) * i
    for (let j = 0; j <= segAngular; j++) {
      const ang = a0 + (a1 - a0) * (j / segAngular)
      positions.push(CX + nr * RX * Math.cos(ang), CY + heightAt(nr) + LIFT, CZ + nr * RZ * Math.sin(ang))
    }
  }
  for (let j = 0; j < segAngular; j++) {
    const a = j
    const b = a + cols
    indices.push(a, b, a + 1, b, b + 1, a + 1)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

export function Estadio3D({ url, zoom, selectedId, onSelect, onProgress, onReady, onError }: Estadio3DProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const { items, toggleAsiento } = useVenta()
  const { data: sector } = useSector(selectedId)

  const itemsRef = useRef(items)
  itemsRef.current = items
  const toggleRef = useRef(toggleAsiento)
  toggleRef.current = toggleAsiento
  const sectorRef = useRef<Sector | undefined>(sector)
  sectorRef.current = sector

  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady
  const onProgressRef = useRef(onProgress)
  onProgressRef.current = onProgress
  const onErrorRef = useRef(onError)
  onErrorRef.current = onError
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const selectedIdRef = useRef(selectedId)
  selectedIdRef.current = selectedId

  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const baseDistRef = useRef(2.2)
  const seatsRef = useRef<THREE.InstancedMesh | null>(null)
  const seatDataRef = useRef<Asiento[]>([])
  const raycasterRef = useRef(new THREE.Raycaster())
  const ndcRef = useRef(new THREE.Vector2())
  const downRef = useRef<[number, number]>([0, 0])
  const labelRendererRef = useRef<CSS2DRenderer | null>(null)
  const labelsRef = useRef<{ obj: CSS2DObject; dir: THREE.Vector3 }[]>([])
  const patchesRef = useRef<THREE.Mesh[]>([])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch (e) {
      onErrorRef.current(e)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(host.clientWidth || 1, host.clientHeight || 1)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    host.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(host.clientWidth || 1, host.clientHeight || 1)
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = '0'
    labelRenderer.domElement.style.left = '0'
    labelRenderer.domElement.style.pointerEvents = 'none'
    host.appendChild(labelRenderer.domElement)
    labelRendererRef.current = labelRenderer

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(40, (host.clientWidth || 1) / (host.clientHeight || 1), 0.01, 100)
    camera.position.set(1.5, 1.0, 1.5)
    cameraRef.current = camera

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = false
    controls.minDistance = 0.4
    controls.maxDistance = 6
    controls.maxPolarAngle = Math.PI / 2.05
    controls.target.set(0, 0, 0)
    controlsRef.current = controls

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8495ab, 1.3))
    const key = new THREE.DirectionalLight(0xffffff, 2.0)
    key.position.set(2, 3, 2)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xbfd4ff, 0.7)
    fill.position.set(-2, 1, -2)
    scene.add(fill)

    let model: THREE.Object3D | null = null
    let disposed = false

    const loader = new GLTFLoader()
    loader.load(
      url,
      (gltf) => {
        if (disposed) return
        model = gltf.scene
        model.traverse((o) => {
          const m = o as THREE.Mesh
          if (m.isMesh) {
            m.castShadow = true
            m.receiveShadow = true
          }
        })
        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        model.position.sub(center)
        const radius = size.length() / 2
        const dist = radius / (2 * Math.tan((camera.fov * Math.PI) / 360))
        baseDistRef.current = Math.max(dist * 1.5, 1.6)
        camera.position.set(1.5, 1.0, 1.5).normalize().multiplyScalar(baseDistRef.current)
        controls.minDistance = radius * 0.25
        controls.maxDistance = radius * 3
        controls.target.set(0, 0, 0)
        controls.update()
        scene.add(model)
        onReadyRef.current()
      },
      (e) => {
        if (e.total > 0) onProgressRef.current(Math.round((e.loaded / e.total) * 100))
      },
      (e) => onErrorRef.current(e),
    )

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      controls.update()
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera)
      const camDir = camera.position.clone().normalize()
      labelsRef.current.forEach((l) => {
        l.obj.element.style.opacity = l.dir.dot(camDir) > 0.15 ? '1' : '0.22'
      })
    }
    tick()

    const ro = new ResizeObserver(() => {
      const w = host.clientWidth
      const h = host.clientHeight
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      labelRenderer.setSize(w, h)
    })
    ro.observe(host)

    const onMove = (ev: PointerEvent) => {
      const seats = seatsRef.current
      const cam = cameraRef.current
      if (!seats || !cam) return
      const rect = host.getBoundingClientRect()
      const px = ev.clientX - rect.left
      const py = ev.clientY - rect.top
      ndcRef.current.set((px / rect.width) * 2 - 1, -(py / rect.height) * 2 + 1)
      raycasterRef.current.setFromCamera(ndcRef.current, cam)
      const hits = raycasterRef.current.intersectObject(seats, false)
      const el = tooltipRef.current
      if (hits.length > 0 && hits[0].instanceId != null) {
        const seat = seatDataRef.current[hits[0].instanceId]
        if (el && seat) {
          el.style.display = 'block'
          el.style.left = `${px + 14}px`
          el.style.top = `${py + 14}px`
          el.textContent = `Fila ${seat.fila} · Asiento ${seat.numero}`
        }
      } else if (el) {
        el.style.display = 'none'
      }
    }
    const onDown = (ev: PointerEvent) => {
      downRef.current = [ev.clientX, ev.clientY]
    }
    const onUp = (ev: PointerEvent) => {
      const dx = ev.clientX - downRef.current[0]
      const dy = ev.clientY - downRef.current[1]
      if (dx * dx + dy * dy > 36) return
      const cam = cameraRef.current
      if (!cam) return
      const rect = host.getBoundingClientRect()
      const px = ev.clientX - rect.left
      const py = ev.clientY - rect.top
      ndcRef.current.set((px / rect.width) * 2 - 1, -(py / rect.height) * 2 + 1)
      raycasterRef.current.setFromCamera(ndcRef.current, cam)

      const seats = seatsRef.current
      if (seats) {
        const hits = raycasterRef.current.intersectObject(seats, false)
        if (hits.length > 0 && hits[0].instanceId != null) {
          const seat = seatDataRef.current[hits[0].instanceId]
          const sec = sectorRef.current
          if (sec && seat && (seat.estado === 'disponible' || itemsRef.current.some((i) => i.asientoId === seat.id))) {
            toggleRef.current(sec, seat)
          }
          return
        }
      }

      const patchHits = raycasterRef.current.intersectObjects(patchesRef.current, false)
      if (patchHits.length > 0) {
        const id = patchHits[0].object.userData.sectionId
        if (typeof id === 'string') onSelectRef.current(id)
      }
    }
    renderer.domElement.addEventListener('pointermove', onMove)
    renderer.domElement.addEventListener('pointerdown', onDown)
    renderer.domElement.addEventListener('pointerup', onUp)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.domElement.removeEventListener('pointermove', onMove)
      renderer.domElement.removeEventListener('pointerdown', onDown)
      renderer.domElement.removeEventListener('pointerup', onUp)
      controls.dispose()
      if (model) {
        model.traverse((o) => {
          const m = o as THREE.Mesh
          if (m.isMesh) {
            m.geometry?.dispose()
            const mat = m.material
            if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
            else mat?.dispose()
          }
        })
      }
      if (seatsRef.current) {
        scene.remove(seatsRef.current)
        seatsRef.current.geometry.dispose()
        ;(seatsRef.current.material as THREE.Material).dispose()
        seatsRef.current = null
      }
      renderer.dispose()
      renderer.forceContextLoss()
      if (labelRenderer.domElement.parentElement === host) host.removeChild(labelRenderer.domElement)
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement)
    }
  }, [url])

  useEffect(() => {
    const scene = sceneRef.current
    const sec = sectorRef.current
    if (!scene || !sec) return

    if (seatsRef.current) {
      scene.remove(seatsRef.current)
      seatsRef.current.geometry.dispose()
      ;(seatsRef.current.material as THREE.Material).dispose()
      seatsRef.current = null
    }
    seatDataRef.current = []

    if (sec.asientos.length === 0) return

    const secInfo = SECCIONES.find((s) => s.id === sec.id)
    const [bandIn, bandOut] = secInfo?.nivel === 'superior' ? [0.89, 0.99] : [0.79, 0.88]
    const angulo = secInfo ? (secInfo.angulo * Math.PI) / 180 : Math.PI / 4
    const span = secInfo ? (secInfo.span * Math.PI) / 180 : 0.6

    seatDataRef.current = sec.asientos
    const count = sec.asientos.length
    const rows = sec.filas.length
    const cols = sec.columnas

    const geo = new THREE.BoxGeometry(0.042, 0.01, 0.014)
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0 })
    const mesh = new THREE.InstancedMesh(geo, mat, count)
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

    const m4 = new THREE.Matrix4()
    const pos = new THREE.Vector3()
    const quat = new THREE.Quaternion()
    const scl = new THREE.Vector3(1, 1, 1)
    const up = new THREE.Vector3(0, 1, 0)
    const col = new THREE.Color()

    sec.asientos.forEach((asiento, i) => {
      const filaIdx = Math.floor(i / cols)
      const colIdx = i % cols
      const nr = bandIn + (filaIdx * (bandOut - bandIn)) / (rows - 1)
      const angle = angulo + (colIdx - (cols - 1) / 2) * (span / (cols - 1))
      pos.set(CX + nr * RX * Math.cos(angle), CY + heightAt(nr), CZ + nr * RZ * Math.sin(angle))
      quat.setFromAxisAngle(up, Math.PI / 2 - angle)
      m4.compose(pos, quat, scl)
      mesh.setMatrixAt(i, m4)
      col.set(COLOR[asiento.estado] ?? COLOR.disponible)
      mesh.setColorAt(i, col)
    })

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    mesh.frustumCulled = false
    mesh.computeBoundingSphere()
    scene.add(mesh)
    seatsRef.current = mesh
  }, [sector])

  useEffect(() => {
    const mesh = seatsRef.current
    if (!mesh) return
    const selected = new Set(items.map((i) => i.asientoId))
    const col = new THREE.Color()
    seatDataRef.current.forEach((seat, i) => {
      if (selected.has(seat.id)) col.set(COLOR.seleccionado)
      else col.set(COLOR[seat.estado] ?? COLOR.disponible)
      mesh.setColorAt(i, col)
    })
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [items])

  useEffect(() => {
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!camera || !controls) return
    const dir = camera.position.clone().sub(controls.target)
    dir.setLength(baseDistRef.current / zoom)
    camera.position.copy(controls.target).add(dir)
    controls.update()
  }, [zoom])

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    const patches: THREE.Mesh[] = []
    const toRemove: THREE.Object3D[] = []
    const labels: { obj: CSS2DObject; dir: THREE.Vector3 }[] = []

    const chip = (color: string, nombre: string, precio: number) => {
      const el = document.createElement('div')
      el.style.cssText =
        'display:flex;align-items:center;gap:5px;padding:2px 9px;border-radius:999px;background:rgba(255,255,255,0.92);color:#0f172a;font:600 11px/1.4 Inter,sans-serif;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.25);border:1px solid rgba(0,0,0,0.08);transition:opacity .15s'
      el.innerHTML =
        `<span style="width:9px;height:9px;border-radius:3px;background:${color};flex:0 0 auto"></span>` +
        `<span>${nombre}</span><span style="opacity:.65">${formatPrecio(precio)}</span>`
      return el
    }

    for (const sec of SECCIONES) {
      const a = (sec.angulo * Math.PI) / 180
      const half = (sec.span / 2) * (Math.PI / 180)

      if (sec.lado !== 'exterior') {
        const [nrIn, nrOut] = sec.nivel === 'superior' ? [0.89, 0.99] : [0.79, 0.88]
        const geo = ringSegmentGeometry(nrIn, nrOut, a - half, a + half)
        const mat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(sec.color),
          transparent: true,
          opacity: sec.id === selectedIdRef.current ? 0.7 : 0.32,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
        const patch = new THREE.Mesh(geo, mat)
        patch.userData.sectionId = sec.id
        patch.renderOrder = 1
        scene.add(patch)
        patches.push(patch)
      }

      const px = CX + sec.radio * RX * Math.cos(a)
      const pz = CZ + sec.radio * RZ * Math.sin(a)
      const py = CY + heightAt(sec.radio) + 0.05
      const obj = new CSS2DObject(chip(sec.color, sec.nombre, sec.precio))
      obj.position.set(px, py, pz)
      scene.add(obj)
      toRemove.push(obj)
      labels.push({ obj, dir: new THREE.Vector3(px, 0, pz).normalize() })
    }

    labelsRef.current = labels
    patchesRef.current = patches

    return () => {
      labelsRef.current = []
      patchesRef.current = []
      toRemove.forEach((o) => scene.remove(o))
      patches.forEach((p) => {
        scene.remove(p)
        p.geometry.dispose()
        ;(p.material as THREE.Material).dispose()
      })
    }
  }, [])

  useEffect(() => {
    patchesRef.current.forEach((p) => {
      const id = p.userData.sectionId as string | undefined
      const mat = p.material as THREE.MeshBasicMaterial
      mat.opacity = id === selectedId ? 0.7 : 0.32
    })
  }, [selectedId])

  return (
    <div className="relative h-full w-full">
      <div ref={hostRef} className="h-full w-full" />
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-10 hidden whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-800 shadow-pop"
      />
    </div>
  )
}
