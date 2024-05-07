import { Axis } from "@utils/MathGraphs/Axis";
import Line from "@utils/MathGraphs/Line";
import { Plot } from "@utils/MathGraphs/Plot/Plot";
import { DEGREES } from "@utils/MathGraphs/utils";
import {Angle} from "@utils/MathGraphs/Angle/Angle";
import { RectAngle } from "@utils/MathGraphs/Angle/RectAngle";
import { Point } from "@utils/MathGraphs/Point/Point";
import { PointWithProyections } from "@utils/MathGraphs/Point/PointWithProyections";
import { AcotPlot } from "@utils/MathGraphs/Plot/AcotPlot";

const axis = new Axis();

const plot1 = new Plot({
    axis,
    func: (x) => Math.sin(x),
    style: {
        color: '#ff0000',
        lineWidth: 4
    }
});
const plot2 = new Plot({
    axis,
    func: (x) => Math.pow(x, 2) / 2 - 4,
    style: {
        color: '#0000ff',
        lineWidth: 4
    }
});
const plot3 = new AcotPlot({
    axis,
    func: (x) => Math.pow(x, 3) / 2 + 1,
    range: [-1, 1],
    plotStyle: {
        color: '#ecfd00',
        lineWidth: 2
    },
    dashPlotStyle: {
        color: '#ecfd00',
        lineWidth: 2
    }
});

console.log(plot3)

const line1 = Line.from2Points({
    start: [axis.x(-4), axis.y(3)],
    end: [axis.x(4), axis.y(3)],
    style: {
        color: '#11992e',
        lineWidth: 2
    }
});

const line2 = Line.fromPointWithAngle({
    point: [axis.x(4), axis.y(0)],
    center: true,
    angle: 30 * DEGREES,
    style: {
        color: '#2a1199',
        lineWidth: 2
    }
});

const angle = new Angle({
    point: [axis.x(-4), axis.y(0)],
    angle: 90 * DEGREES,
    rotate: 0 * DEGREES,
    style: {
        color: '#991145',
        lineWidth: 2
    }
});

const rectAngle = new RectAngle({
    point: [axis.x(2), axis.y(0)],
    rotate: 30 * DEGREES,
    style: {
        color: '#991145',
        lineWidth: 2
    }
});

const point = new PointWithProyections({
    point: [axis.x(2), axis.y(-3)],
    origin: axis.origin,
    radius: 5,
    pointStyle: {
        color: '#0086df',
        lineWidth: 2
    },
    lineStyle: {
        color: '#93cbf0',
        lineWidth: 2
    }
});



(() => {
    const svg = document.querySelector('svg.back');
    const canvas = document.querySelector('canvas.front');
    const ctx = canvas.getContext('2d');

    axis.drawAxis(svg, {hideZero: true, color: '#bebebe'});
    
    [rectAngle, plot1, plot2, plot3, line1, line2, angle, point].forEach(plot => plot.draw(ctx));
})();

(() => {

    const svg = document.querySelector('svg.only-svg');

    axis.drawAxis(svg, {hideZero: true, color: '#d6d6d6'});

    [plot1, plot2,].forEach(plot => svg.appendChild(plot.getPolyline()));

    [line1, line2].forEach(line1 => svg.appendChild(line1.getLine()));

    svg.appendChild(plot3.getG());

    console.log(point.getPathD())

    svg.appendChild(rectAngle.getRect());

})();