import { Arrow3D } from "@utils/MathGraphs/3d/Arrow3D/Arrow3D";
import { Line3D } from "@utils/MathGraphs/3d/Line3D/Line3D";
import { Plot2D } from "@utils/MathGraphs/3d/Plot/Plot2D";
import { Plot3D } from "@utils/MathGraphs/3d/Plot/Plot3D";
import { Point3D } from "@utils/MathGraphs/3d/Point3D/Point3D";
import { Scene3D } from "@utils/MathGraphs/3d/Scene3D";
import { BACK, DOWN, FRONT, LEFT, RIGHT, UP } from "@utils/MathGraphs/3d/directions";
import { ControlsDatGUI } from "@utils/MathGraphs/ControlsDatGUI";
import { style } from "d3";


const CANVAS = document.querySelector('canvas');
window.canvas = CANVAS;

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
        func,
    });

    const plot2 = new Plot3D({
        func: (x, y) => Math.pow(x, 2) + Math.pow(y, 2),
        range: [-2, 2]
    });

    plot2.shape.position.set(-3, -3, 0);

    const plot3 = new Plot3D({
        func: (x, y) => Math.pow(x, 2) - Math.pow(y, 2),
        range: [-2, 2],
        style: {
            color: 'rgb(6, 64, 122)'
        },
        wireframeStyle: {
            color: '#0819a0'
        }
    });

    plot3.shape.position.set(3, -3, 0);
    
    scene.scene.add(plot1.shape, plot2.shape, plot3.shape);

})();


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




const controls = new ControlsDatGUI({
    name: "Controls",
    container: document.querySelector('.container')
});


Object.entries({
    'view up': () => scene.changeView(UP, 7),
    'view down': () => scene.changeView(DOWN, 7),
    'view left': () => scene.changeView(LEFT, 7),
    'view right': () => scene.changeView(RIGHT, 7),
    'view front': () => scene.changeView(FRONT, 7),
    'view back': () => scene.changeView(BACK, 7),
    'change perspective': () => scene.changePerspective(),
    'get image': () => {

        scene.getImage().then(src => document.querySelector('.image').src = src);
    }
})
.forEach(([name, onClick]) => {

    controls.addButton(name, onClick, {folder: 'world'});
});






controls.append();