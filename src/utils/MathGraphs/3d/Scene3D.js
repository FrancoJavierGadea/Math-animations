import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Axis3D } from './Axis3D';


/**
 * @typedef Scene3DParams
 *  @property {HTMLCanvasElement} canvas
 *  @property {String} name
 */

export class Scene3D {
    
    /**
     * @constructor
     * @param {Scene3DParams} params 
     */
    constructor(params = {}){

        const {
            canvas,
            name
        } = params;

        this.name = name;
        this.canvas = canvas;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });

        this.scene = new THREE.Scene();

        //Perspective camera
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

    //MARK: Draw
    draw(){

        this.controls.update();
        this.renderer.render(this.scene, this.camera);

        if(this.#capture){
            console.log('capture');
            this.#renderImage = this.canvas.toDataURL(this.#imageFormat);
            this.#capture = false;
        }
    }

    //MARK: Change Perspective
    isPerspective = true;
    isOrthographic = false;

    changePerspective(){

        const camera = (() => {

            if(this.isPerspective) return new THREE.OrthographicCamera(
                this.canvas.width / -180, 
                this.canvas.width / 180, 
                this.canvas.height / 180, 
                this.canvas.height / -180, 
                1,
                10000
            )

            if(this.isOrthographic) return new THREE.PerspectiveCamera(
                45, 
                this.canvas.width / this.canvas.height, 
                1, 
                10000
            );
        })();

        camera.up.set(0,0,1);
        camera.position.copy(this.camera.position);
        camera.rotation.copy(this.camera.rotation);

        const controls = new OrbitControls(camera, this.renderer.domElement);
        controls.target.copy(this.controls.target);

        this.controls.dispose();

        this.camera = camera;
        this.controls = controls;

        this.isPerspective = !this.isPerspective;
        this.isOrthographic = !this.isOrthographic;
    }

    //MARK: Change View
    /**
     * @param {THREE.Vector3} direction 
     * @param {Number} length 
     */
    changeView(direction, length = 1){

        if(direction){

            this.camera.position.copy(direction.clone().multiplyScalar(length));
        }
    }

    //MARK: getImage
    #capture = false;
    #renderImage = null;
    #imageFormat = 'image/png';

    /**
     * @param {"image/png" | "image/webp" | "image/jpeg"} format 
     * @returns {String} image in base64url
     */
    async getImage(format = 'image/png'){

        this.#imageFormat = format;
        this.#capture = true;

        const {resolve, promise} = Promise.withResolvers();

        setTimeout(() => {

            resolve(this.#renderImage);

        }, 200);

        return promise;
    }
}