import * as THREE from "three";

/**
 * @typedef Plot2DStyle 
 *  @property {String} color
 *  @property {Boolean} transparent default: true
 * 
 * @typedef Plot2DParams
 *  @property {(i:Number) => import("@utils/MathGraphs/types.js").Point3D} func
 *  @property {import("@utils/MathGraphs/types.js").Range} range default: [-3, 3]
 *  @property {Number} segments default: 64
 *  @property {Number} radialSegments default: 16
 *  @property {Number} lineWidth default: 0.1
 *  @property {String} name
 *  @property {Plot2DStyle} style
 */

export class Plot2D {

    static defaultStyle = {
        color: '#ffffff',
        transparent: true
    }

    /**
     * @constructor
     * @param {Plot2DParams} params 
     */
    constructor(params = {}){
        const {
            func = (i) => [i, Math.pow(i, 2), 1],
            range = [-3, 3],
            segments = 64,
            radialSegments = 16,
            lineWidth = 0.1,
            name,
            style = {},
        } = params;

        this.function = func;
        this.range = {
            min: range['min'] ?? range[0],
            max: range['max'] ?? range[1]
        }
        this.name = name;
        this.style = {
            ...Plot2D.defaultStyle,
            ...style
        };

        this.#initShape({segments, lineWidth, radialSegments});
    }

    #initShape({segments, lineWidth, radialSegments}){

        const path = new PlotLineCurve({
            func: this.function,
            range: this.range
        });

        const geometry = new THREE.TubeGeometry(path, segments, lineWidth, radialSegments, false);
        const material = new THREE.MeshBasicMaterial({
            ...this.style,
            side: THREE.DoubleSide
        });

        this.shape = new THREE.Mesh(geometry, material);
    }
}


//MARK: Aux class PlotLineCurve
class PlotLineCurve extends THREE.Curve {

    constructor(params = {}){
        super();

        const {
            scale = 1,
            func = (i) => [i, Math.pow(i, 2), 1],
            range = [-3, 3]
        } = params;

        this.scale = scale;

        this.function = func;
        this.range = {
            min: range['min'] ?? range[0],
            max: range['max'] ?? range[1]
        }

        console.log(this);
    }

    getPoint(t, target = new THREE.Vector3()){

        const i = (this.range.max - this.range.min) * t + this.range.min;

        const values = this.function(i);

        return target.set(
            values.x ?? values[0],
            values.y ?? values[1],
            values.z ?? values[2],
        )
        .multiplyScalar(this.scale);
    }
}
