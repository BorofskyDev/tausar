import * as THREE from 'three';
import images from './images';
import vertex from '../shaders/vertex.glsl';
import fragment from '../shaders/fragment.glsl';

// BRING IN IMAGES
const loader = new THREE.TextureLoader();

const texture1 = loader.load(images.tausar1);
const texture2 = loader.load(images.tausar2);
const texture3 = loader.load(images.tausar3);
const texture4 = loader.load(images.tausar4);

// CREATE SMOOTH EASE-IN ANIMATION
function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

// CREATE YOUR FUNCTION
class Shaded {
  constructor() {
    this.container = document.querySelector('.landing');
    this.inner = document.querySelector('.intro');
    this.links = [...document.querySelectorAll('#shadedImage')];
    this.targetX = 0;
    this.targetY = 0;
    this.scene = new THREE.Scene();
    this.perspective = 1000;
    this.sizes = new THREE.Vector2(0, 0);
    this.offset = new THREE.Vector2(0, 0);
    this.uniforms = {
      uTexture: { value: texture1 },
      uAlpha: { value: 0.0 },
      uOffset: { value: new THREE.Vector2(0.0, 0.0) },
      transparent: true,
    };

    // ASSIGN EACH CASE TO EACH TAG IN HTML - IF 2 TAGS, ASSIGN 2, IF 20, ASSIGN 20
    this.links.map((link, i) => {
      link.addEventListener('mouseenter', () => {
        switch (i) {
          case 0:
            this.uniforms.uTexture.value = texture1;
            break;
          case 1:
            this.uniforms.uTexture.value = texture2;
            break;
          case 2:
            this.uniforms.uTexture.value = texture3;
            break;
          case 3:
            this.uniforms.uTexture.value = texture4;
            break;
        }
      });

      // MAKE SURE YOU SET UP MOUSE LEAVE IF ONLY DOING THIS FOR LANDING PAGE
      link.addEventListener('mouseleave', () => {
        this.uniforms.uAlpha.value = lerp(this.uniforms.uAlpha.value, 0.0, 0.1);
      });
    });
    this.checkHovered();
    this.setupCamera();
    this.followMouseMove();
    this.createMesh();
    this.render();
  }

  // FINE ASPECT AND PIXELRATIO
  get viewport() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let aspectRatio = width / height;
    let pixelRatio = window.devicePixelRatio;
    return {
      width,
      height,
      aspectRatio,
      pixelRatio,
    };
  }

  // SET UP HOVER STATE
  checkHovered() {
    this.inner.addEventListener('mouseenter', () => {
      this.hovered = true;
    });
    this.inner.addEventListener('mouseleave', () => {
      this.hovered = false;
      this.uniforms.uTexture = { value: texture1 };
    });
  }

  // SET UP YOUR CAMERA
  setupCamera() {
    window.addEventListener('resize', this.onResize.bind(this));
    let fov =
      (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) /
      Math.PI;
    this.camera = new THREE.PerspectiveCamera(
      fov,
      this.viewport.aspectRatio,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, this.perspective);

    // Renderer
    this.renderer = new THREE.WebGL1Renderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(this.viewport.pixelRatio);
    this.container.appendChild(this.renderer.domElement);
  }

  // CREATE YOUR MESH
  createMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 20, 20);
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.sizes.set(370, 470, 1);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
    this.mesh.position.set(this.offset.x, this.offset.y, 0);
    this.scene.add(this.mesh);
  }

  // FOLLOW THE MOUSE
  followMouseMove() {
    window.addEventListener('mousemove', (e) => {
      this.targetX = e.clientX;
      this.targetY = e.clientY;
    });
  }
  // MAKE IT RESPONSIVE
  onResize() {
    this.camera.aspect = this.viewport.aspectRatio;
    this.camera.fov =
      (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) /
      Math.PI;
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.camera.updateProjectionMatrix();
  }

  //   RENDER THE SCENE
  render() {
    this.offset.x = lerp(this.offset.x, this.targetX, 0.1);
    this.offset.y = lerp(this.offset.y, this.targetY, 0.1);
    this.uniforms.uOffset.value.set(
      (this.targetX - this.offset.x) * 0.0006,
      -(this.targetY - this.offset.y) * 0.0006
    );
    this.mesh.position.set(
      this.offset.x - window.innerWidth / 2,
      -this.offset.y + window.innerHeight / 2
    );
    this.hovered
      ? (this.uniforms.uAlpha.value = lerp(
          this.uniforms.uAlpha.value,
          1.0,
          0.1
        ))
      : (this.uniforms.uAlpha.value = lerp(
          this.uniforms.uAlpha.value,
          0.0,
          0.1
        ));
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Shaded()
