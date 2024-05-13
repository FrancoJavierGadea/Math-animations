import { Line } from "./Line";

/**
 * @typedef {Object} LinePointWithAngleParams
 *  @property {String} name
 *  @property {import("@utils/MathGraphs/types.js").Point} point
 *  @property {Number} angle angle in radians,
 *  @property {Number} length Line length
 *  @property {Boolean} center Center the line over the point
 *  @property {LineStyles} style
 */

export class LinePointWithAngle extends Line {

    /**
     * @constructor
     * @param {LinePointWithAngleParams} params 
     */
    constructor(params = {}){

        super(params);

        const {
            point = [100, 100],
            angle = 0,
            length = 200,
            center = false,
        } = params;

        this.point = {
            x: point['x'] ?? point[0],
            y: point['y'] ?? point[1]
        }
        this.center = center;
        this.angle = angle;
        this.length = length;


        if(this.center){

            this.start = {
                x: this.point.x - (this.length / 2) * Math.cos(-this.angle),
                y: this.point.y - (this.length / 2) * Math.sin(-this.angle)
            };
            this.end = {
                x: this.point.x + (this.length / 2) * Math.cos(-this.angle),
                y: this.point.y + (this.length / 2) * Math.sin(-this.angle)
            };
        }
        else {

            this.start = {
                x: this.point.x,
                y: this.point.y
            };
            this.end = {
                x: this.point.x + this.length * Math.cos(-this.angle),
                y: this.point.y + this.length * Math.sin(-this.angle)
            };
        }
    }
}
