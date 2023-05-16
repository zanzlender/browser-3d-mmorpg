const THREE = require("three");

(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();
    window.game = game;
  });
})();

class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const light = new THREE.DirectionalLight(0xffffff);
    light.position(0, 20, 10);
    const ambientLight = new THREE.AmbientLight(0x707070);

    const material = new THREE.MeshPhongMaterial({ color: 0x00aaff });
    this.cube = new THREE.Mesh(geometry, material);

    this.scene.add(this.cube);
    this.scene.add(light);
    this.scene.add(ambientLight);

    this.camera.position.z = 3;
    this.animate();
  }

  animate() {
    const game = this;
    requestAnimationFrame(() => {
      game.animate();
    });
  }
}
