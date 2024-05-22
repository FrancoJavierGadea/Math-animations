import { Arrow3D } from "@utils/MathGraphs/3d/Arrow3D/Arrow3D";
import { Line3D } from "@utils/MathGraphs/3d/Line3D/Line3D";
import { Plot2D } from "@utils/MathGraphs/3d/Plot/Plot2D";
import { Plot3D } from "@utils/MathGraphs/3d/Plot/Plot3D";
import { Point3D } from "@utils/MathGraphs/3d/Point3D/Point3D";
import { Scene3D } from "@utils/MathGraphs/3d/Scene3D";
import { style } from "d3";


const CANVAS = document.querySelector('canvas');

const scene = new Scene3D({
    canvas: CANVAS
});



//Try 3D Points
(() => {
    const p1 = new Point3D({
        point: [1, 1, 1],
        radius: 0.07,
        style: {
        }
    });

    const p2 = new Point3D({
        point: [1, -1, 2]
    });

    const p3 = new Point3D({
        point: [6, 6, 6]
    });

    [ p3].forEach(point => scene.scene.add(point.shape));

})();


//Try 3D Lines
(() => {
    const line1 = new Line3D();

    const line2 = new Line3D({
        start: [1, -1, 2],
        end: [-1, 0, 1],
        style: {
            color: '#ff0000'
        }
    });

    [line1, line2].forEach(line => scene.scene.add(line.shape));

});

//Try 3D Arrow
(() => {
    const arrow1 = new Arrow3D();

    const arrow2 = new Arrow3D({
        start: [1, -1, 2],
        end: [-1, 0, 1],
        style: {
            color: '#ff0000'
        }
    });

    const arrow3 = new Arrow3D({
        start: [1, 1, 1],
        end: [1, -1, 2],
        style: {
            color: '#ff0000'
        }
    });

    [arrow1, arrow2, arrow3].forEach(arrow => scene.scene.add(arrow.shape));

});

//Try Plot3D
(() => {

    const func = (x, y) => {
    
        const z = Math.sin(x) + Math.cos(y);
    
        return  z;
    }
    
    const plot1 = new Plot3D({
        func
    });
    
    scene.scene.add(plot1.shape);

});


//Try Plot2D
(() => {

    const func = (i) => {
    
        return {
            x: i,
            z: Math.cos(i),
            y: 2
        };
    }
    
    const plot1 = new Plot2D({
        segments: 128,
        radialSegments: 16,
        func,
    });
    
    scene.scene.add(plot1.shape);

})();





let ID = null;

function animate(){

    scene.draw();

    ID = requestAnimationFrame(animate);
}

animate();