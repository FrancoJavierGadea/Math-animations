import { Line } from "./Line";
import { LinePointWithAngle } from "./LinePointWithAngle";


export default {

    from2Points(params){

        return new Line(params);
    },
    
    fromPointWithAngle(params){

        return new LinePointWithAngle(params);
    }
}