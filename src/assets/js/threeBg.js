import * as THREE from 'three'
import images from './images'

/* PULL IN CONTAINER */
const container = document.querySelector('.three_bg')
const loader = new THREE.TextureLoader()


/*SCENE SET UP */
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGL1Renderer({
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);



/*MAKE IT RESPONSIVE */
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/*CREATE OBJECT */
const geometry = new THREE.PlaneGeometry(18, 10, 15, 9)
const material = new THREE.MeshBasicMaterial({ map: loader.load(images.b11) })

const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)
camera.position.z = 5

const count = geometry.attributes.position.count;
const clock = new THREE.Clock()

/*ANIMATE */
function animate() {
    const time = clock.getElapsedTime()

    for (let i = 0; i < count; i++) {
        const x = geometry.attributes.position.getX(i)
        const y = geometry.attributes.position.getY(i)
        // animations
        const anim1 = .75 * Math.sin(y * 4 + time * 0.5)
        const anim2 = .5 * Math.sin(x + time * .9)
        const anim3 = .1 * Math.sin(y * 15 + time * .9)

        geometry.attributes.position.setZ(i, anim1 + anim2 + anim3)
        geometry.computeVertexNormals()
        geometry.attributes.position.needsUpdate = true
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate()
