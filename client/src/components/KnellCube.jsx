import { useEffect, useRef } from 'react'

export default function KnellCube({ width = 300, height = 300 }) {
  const mountRef = useRef(null)

  useEffect(() => {
    let animationId
    const mount = mountRef.current

    const init = async () => {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
      camera.position.z = 3

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(window.devicePixelRatio)
      mount.appendChild(renderer.domElement)

      scene.add(new THREE.AmbientLight(0xffffff, 1))
      const dirLight = new THREE.DirectionalLight(0xffffff, 2)
      dirLight.position.set(5, 5, 5)
      scene.add(dirLight)

      const loader = new GLTFLoader()
      const clock = new THREE.Clock()
      let mixer

      loader.load('/cube_goes.glb', (gltf) => {
        scene.add(gltf.scene)
        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(gltf.scene)
          gltf.animations.forEach(clip => mixer.clipAction(clip).play())
        }
      })

      const animate = () => {
        animationId = requestAnimationFrame(animate)
        if (mixer) mixer.update(clock.getDelta())
        renderer.render(scene, camera)
      }
      animate()
    }

    init()
    return () => {
      cancelAnimationFrame(animationId)
      if (mount.firstChild) mount.removeChild(mount.firstChild)
    }
  }, [])

  return <div ref={mountRef} style={{ width, height }} />
}