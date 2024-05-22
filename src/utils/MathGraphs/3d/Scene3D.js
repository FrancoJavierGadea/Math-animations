import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Axis3D } from './Axis3D';
import { DEGREES } from '../utils';
import { style } from 'd3';

export class Scene3D {
    

    constructor(params = {}){

        const {
            canvas,
        } = params;

        this.canvas = canvas;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.canvas.width / this.canvas.height, 1, 10000);
        this.camera.position.set(7, 7, 7);
        this.camera.up.set(0,0,1);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.controls.target.set(0,0,0);
        this.controls.update();

        //Axis
        const axis = new Axis3D({
        });

        this.scene.add(axis.shape);
    }

    draw(){

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}