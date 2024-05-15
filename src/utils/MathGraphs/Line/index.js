import { Line } from "./Line";
import { LinePointWithAngle } from "./LinePointWithAngle";


export default {

    /**
     * @param {import("./Line.js").LineParams} params 
     * @returns {import("./Line.js").Line}
     */
    from2Points(params) {

        return new Line(params);
    },
    
    /**
     * @param {import("./LinePointWithAngle.js").LinePointWithAngleParams} params 
     * @returns {import("./Line.js").Line}
     */
    fromPointWithAngle(params) {

        return new LinePointWithAngle(params);
    }
}