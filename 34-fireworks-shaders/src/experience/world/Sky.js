import { Sky } from 'three/addons/objects/Sky.js';
import * as THREE from 'three'

export default class customSky {
  constructor(experience) {
    this.experience = experience
    this.scene = this.experience.scene
    this.renderer = this.experience.renderer
    console.log(this.renderer);

    this.debug = experience.debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('天空')
      // this.folderClouds = this.debug.ui.addFolder('云');
    }
    // Add Sky
    this.sky = new Sky();
    this.sky.scale.setScalar(45000);
    this.scene.add(this.sky);

    this.sun = new THREE.Vector3();

    /// GUI

    const effectController = {
      turbidity: 10,
      rayleigh: 3,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.95,
      elevation: -2.2,
      azimuth: 180,
      exposure: this.renderer.instance.toneMappingExposure,
      // cloudCoverage: 0.4,
      // cloudDensity: 0.4,
      // cloudElevation: 0.5,
      // showSunDisc: true
    };

    const guiChanged = () => {

      const uniforms = this.sky.material.uniforms;
      uniforms['turbidity'].value = effectController.turbidity;
      uniforms['rayleigh'].value = effectController.rayleigh;
      uniforms['mieCoefficient'].value = effectController.mieCoefficient;
      uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;
      // uniforms['cloudCoverage'].value = effectController.cloudCoverage;
      // uniforms['cloudDensity'].value = effectController.cloudDensity;
      // uniforms['cloudElevation'].value = effectController.cloudElevation;
      // uniforms['showSunDisc'].value = effectController.showSunDisc;

      const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
      const theta = THREE.MathUtils.degToRad(effectController.azimuth);

      this.sun.setFromSphericalCoords(1, phi, theta);

      uniforms['sunPosition'].value.copy(this.sun);

      this.renderer.instance.toneMappingExposure = effectController.exposure;

    }

    if (this.debug.active) {
      this.debugFolder.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged);
      this.debugFolder.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged);
      this.debugFolder.add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(guiChanged);
      this.debugFolder.add(effectController, 'mieDirectionalG', 0.0, 1, 0.001).onChange(guiChanged);
      this.debugFolder.add(effectController, 'elevation', -3, 90, .01).onChange(guiChanged);
      this.debugFolder.add(effectController, 'azimuth', - 180, 180, 0.1).onChange(guiChanged);
      this.debugFolder.add(effectController, 'exposure', 0, 1, 0.0001).onChange(guiChanged);
      // this.debugFolder.add(effectController, 'showSunDisc').onChange(guiChanged);
      // this.folderClouds.add(effectController, 'cloudCoverage', 0, 1, 0.01).name('coverage').onChange(guiChanged);
      // this.folderClouds.add(effectController, 'cloudDensity', 0, 1, 0.01).name('density').onChange(guiChanged);
      // this.folderClouds.add(effectController, 'cloudElevation', 0, 1, 0.01).name('elevation').onChange(guiChanged);

    }
    guiChanged();
  }
}