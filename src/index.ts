import Three from "three";

class Game {
  scene;
  camera;
  renderer;
  cube;

  constructor() {
    this.scene = new Three.Scene();
    this.camera = new Three.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new Three.WebGLRenderer();
    document.body.appendChild(this.renderer.domElement);

    const geometry = new Three.BoxGeometry(1, 1, 1);
    const light = new Three.DirectionalLight(0xffffff);
    light.position.set(0, 20, 10);

    const ambient = new Three.AmbientLight(0x707070); // soft white light

    const material = new Three.MeshPhongMaterial({ color: 0x00aaff });

    this.cube = new Three.Mesh(geometry, material);

    this.scene.add(this.cube);
    this.scene.add(light);
    this.scene.add(ambient);

    this.camera.position.z = 3;

    this.animate();
  }

  animate() {
    const game = this;
    requestAnimationFrame(function () {
      game.animate();
    });

    this.cube.rotation.x += 0.1;
    this.cube.rotation.y += 0.1;

    this.renderer.render(this.scene, this.camera);
  }
}
