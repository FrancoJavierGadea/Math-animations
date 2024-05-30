import * as THREE from "three";

/**
 * @typedef Point3DStyle
 *  @property {String} color
 * 
 * @typedef Point3DParams
 *  @property {import("@utils/MathGraphs/types.js").Point3D} point default: [0, 0, 0]
 *  @property {Number} radius default: 0.1
 *  @property {Number} segments default: 16
 *  @property {String} name
 *  @property {Point3DStyle} style
 */

export class Point3D {

    static defaultStyle = {
        color: '#ffffff'
    }

    /**
     * @constructor
     * @param {Point3DParams} params 
     */
    constructor(params = {}){

        const {
            point = [0, 0, 0],
            radius = 0.1,
            segments = 16,
            name,
            style = {}
        } = params;

        this.name = name;
        this.point = {
            x: point.x ?? point[0],
            y: point.y ?? point[1],
            z: point.z ?? point[2],
        }
        this.radius = radius;

        this.style = {
            ...Point3D.defaultStyle,
            ...style
        }


        this.shape = new THREE.Mesh(
            new THREE.SphereGeometry(this.radius, segments, segments),
            new THREE.MeshBasicMaterial(this.style)
        );

        this.shape.position.set(this.point.x, this.point.y, this.point.z);
    }
}