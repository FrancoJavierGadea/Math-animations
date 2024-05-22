
import * as THREE from 'three';
import { Point3D } from './Point3D/Point3D';
import { color } from 'd3';
import Arrow from '@/pages/test/2d/arrow.astro';
import { Arrow3D } from './Arrow3D/Arrow3D';
import { DEGREES } from '../utils';


export class Axis3D {

    static defaultStyle = {
        color: {
            x: '#ff0000',
            y: '#00ff00',
            z: '#0000ff'
        } 
    };


    constructor(params = {}){

        const {
            size = 10,
            hideGrid = false,
            hideAxis = null,
            hideOrigin = false,
            style = {}
        } = params;

        this.size = size;
        this.hideGrid = hideGrid;
        this.hideAxis = hideAxis;
        this.hideOrigin = hideOrigin;

        this.style = {
            color: {
                ...Axis3D.defaultStyle.color
            },
        };

        if(typeof style.color === 'string'){

            for (const key in this.style.color) {

                this.style.color[key] = style.color;     
            }
        }
        else {

            for (const key in this.style.color) {

                if(style.color && style.color[key]) this.style.color[key] = style.color[key];     
            }
        }
        
        this.#initShape();
    }

    #initShape(){

        const n = this.size / 2;

        this.shape = new THREE.Group();

        if(!this.hideAxis?.x){

            const axisX = new Arrow3D({
                start: [-n, 0, 0],
                end: [n, 0, 0],
                style: {
                    color: this.style.color.x
                }
            });

            this.shape.add(axisX.shape);
        }

        if(!this.hideAxis?.y){

            const axisY = new Arrow3D({
                start: [0, -n, 0],
                end: [0, n, 0],
                style: {
                    color: this.style.color.y
                }
            });

            this.shape.add(axisY.shape);
        }

        if(!this.hideAxis?.z){

            const axisZ = new Arrow3D({
                start: [0, 0, -n],
                end: [0, 0, n],
                style: {
                    color: this.style.color.z
                }
            });

            this.shape.add(axisZ.shape);
        }

        if(!this.hideOrigin){

            const origin = new Point3D({
                point: [0, 0, 0]
            });

            this.shape.add(origin.shape);
        }

        if(!this.hideGrid){

            const grid = new THREE.GridHelper(this.size, this.size);
            grid.rotateX(90 * DEGREES);
            this.shape.add(grid);
        }

    }


}