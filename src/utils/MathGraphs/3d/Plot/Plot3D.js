import { DEGREES } from "@utils/MathGraphs/utils";
import { color } from "d3";
import * as THREE from "three";
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

/**
 * @typedef Plot3DStyle 
 *  @property {String} color
 *  @property {Boolean} transparent default: true
 *  @property {Number} opacity default: 0.8
 * 
 * @typedef Plot3DWireframeStyle 
 *  @property {String} color
 * 
 * @typedef Plot3DParams
 *  @property {(x:Number, y:Number) => Number} func
 *  @property {import("@utils/MathGraphs/types.js").Range} range default: [-3, 3]
 *  @property {Number} segments default: 64
 *  @property {Number} wireframeSegments default: 32
 *  @property {Boolean} wireframe default: true
 *  @property {String} name
 *  @property {Plot3DStyle} style
 *  @property {Plot3DWireframeStyle} wireframeStyle
 */

export class Plot3D {

    static defaultStyle = {
        color: '#ffffff',
        transparent: true,
        opacity: 0.8
    };

    static wireframeDefaultStyle = {
        color: '#000000'
    }

    /**
     * @constructor
     * @param {Plot3DParams} params 
     */
    constructor(params = {}){

        const {
            func = (x, y) => x*x + y,
            range = [-3, 3],
            segments = 64,
            wireframeSegments = 32,
            wireframe = true,
            name,
            style = {},
            wireframeStyle = {}
        } = params;

        this.function = func;
        this.range = {
            min: range['min'] ?? range[0],
            max: range['max'] ?? range[1]
        }
        this.name = name;

        this.style = {
            ...Plot3D.defaultStyle,
            ...style
        };
        this.wireframeStyle = {
            ...Plot3D.wireframeDefaultStyle,
            ...wireframeStyle
        }

        this.#initShape({segments, wireframeSegments, wireframe});
    }

    #initShape({segments, wireframeSegments, wireframe}){

        this.shape = new THREE.Group();

        const meshFunction = (u, v, target) => {

            let x = (this.range.max - this.range.min) * u + this.range.min;
            let y = (this.range.max - this.range.min) * v + this.range.min;
            let z = this.function(x, y);

            if(!isNaN(z)){
                target.set(x, y, z);
            }
            else {
                target.set(0, 0, 0);
            };
        }

        const plotGeometry = new ParametricGeometry(meshFunction, segments, segments);

        const material = new THREE.MeshBasicMaterial({
            ...this.style,
            side: THREE.DoubleSide,
        });

        const plot = new THREE.Mesh(plotGeometry, material);

        this.shape.add(plot);

        if(wireframe){

            const wireframe = new THREE.EdgesGeometry(
                new ParametricGeometry(meshFunction, wireframeSegments, wireframeSegments), 
                0.2
            );

            const material = new THREE.MeshBasicMaterial({
                ...this.wireframeStyle,
            });

            const lines1 = new THREE.LineSegments(
    
                wireframe.clone()
                    .translate(0, 0, 0.01),
    
                material
            );
    
            const lines2 = new THREE.LineSegments(
    
                wireframe.clone()
                    .translate(0, 0, -0.01),
    
                material
            );

            this.shape.add(lines1, lines2);
        }
    }
}