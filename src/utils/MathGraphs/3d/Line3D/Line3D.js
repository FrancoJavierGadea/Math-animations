import { DEGREES } from "@utils/MathGraphs/utils";
import * as THREE from "three";

/**
 * @typedef Line3DStyle
 *  @property {String} color
 * 
 * @typedef Line3DParams
 *  @property {import("@utils/MathGraphs/types.js").Point3D} start default: [0, 0, 0]
 *  @property {import("@utils/MathGraphs/types.js").Point3D} end default: [1, 1, 1]
 *  @property {Number} lineWidth default: 0.02
 *  @property {Number} segments default: 8
 *  @property {String} name
 *  @property {Line3DStyle} style
 */

export class Line3D {

    static defaultStyle = {
        color: '#ffffff'
    }

    /**
     * @constructor
     * @param {Line3DParams} params 
     */
    constructor(params = {}){

        const {
            start = [0, 0, 0],
            end = [1, 1, 1],
            lineWidth = 0.02,
            segments = 8,
            name,
            style = {}
        } = params;

        this.name = name;
        this.start = {
            x: start.x ?? start[0],
            y: start.y ?? start[1],
            z: start.z ?? start[2],
        };
        this.end = {
            x: end.x ?? end[0],
            y: end.y ?? end[1],
            z: end.z ?? end[2],
        };
        this.style = {
            ...Line3D.defaultStyle,
            ...style
        };

        this.#initShape({lineWidth, segments});
    }

    #initShape({lineWidth, segments}){

        const length = Math.hypot((this.end.x - this.start.x), (this.end.y - this.start.y), (this.end.z - this.start.z));
        const middle = {
            x: (this.start.x + this.end.x) / 2,
            y: (this.start.y + this.end.y) / 2,
            z: (this.start.z + this.end.z) / 2,
        }

        this.shape = new THREE.Mesh(
            new THREE.CylinderGeometry(lineWidth, lineWidth, length, segments, segments)
            .rotateX(90 * DEGREES),
            new THREE.MeshBasicMaterial(this.style)
        );

        this.shape.position.set(middle.x, middle.y, middle.z);
        this.shape.lookAt(this.start.x, this.start.y, this.start.z);
    }
}