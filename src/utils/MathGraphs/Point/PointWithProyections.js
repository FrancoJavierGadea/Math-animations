
import {Line} from "../Line/Line.js";
import { Point } from "./Point.js";


export class PointWithProyections {

    static defaultLineStyle = {
        lineDash: [5]
    }

    constructor(params) {

        const {
            point = [100, 100],
            origin = [0, 0],
            radius = 4,
            name,
            pointStyle = {},
            lineStyle = {}
        } = params;

        this.pointStyle = pointStyle;
        this.lineStyle = {
            ...PointWithProyections.defaultLineStyle,
            ...lineStyle
        };

        this.name = name;

        this.radius = radius;
        this.origin = {
            x: origin['x'] ?? origin[0],
            y: origin['y'] ?? origin[1]
        }
        this.point = {
            x: point['x'] ?? point[0],
            y: point['y'] ?? point[1]
        }

        this.#initChildren();
    }

    #initChildren(){
        this.elements = {
            point: new Point({
                point: this.point, 
                name: `${this.name}-point`,
                radius: this.radius,
                style: this.pointStyle
            }),
            pointX: new Point({
                point: [this.point.x, this.origin.y], 
                name: `${this.name}-point-x`,
                radius: this.radius,
                style: this.pointStyle
            }),
            pointY: new Point({
                point: [this.origin.x, this.point.y], 
                name: `${this.name}-point-y`,
                radius: this.radius,
                style: this.pointStyle
            }),
            lineX: new Line({
                start: [this.point.x, this.origin.y],
                end: this.point,
                name: `${this.name}-line-x`,
                style: this.lineStyle
            }),
            lineY: new Line({
                start: [this.origin.x, this.point.y],
                end: this.point,
                name: `${this.name}-line-y`,
                style: this.lineStyle
            }),
        }

        this.children = [
            this.elements.lineX,
            this.elements.lineY,
            this.elements.point,
            this.elements.pointX,
            this.elements.pointY,
        ]
    }

    //MARK: Draw on SVG 
    getPathD(){

        const paths = {}

        for (const key in this.elements) {

            paths[key] = this.elements[key].getPathD();
        }

        return paths;
    }

    getAttr(){
        const attrs = {}

        for (const key in this.elements) {

            const shape = this.elements[key];

            if(shape instanceof Point){

                attrs[key] = shape.getCircleAttr();
            }

            if(shape instanceof Line){

                attrs[key] = shape.getLineAttr();
            }
        }

        return attrs;
    }

    getG({pointStyle = {}, lineStyle = {}, useCircle = false, useLine = false} = {}){

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        Object.entries({
            'class': 'Point-with-proyections',
            'data-name': this.name,
        })
        .forEach(([key, value]) => {

            if(value) g.setAttribute(key, value);
        });

        for (let i = 0; i < this.children.length; i++) {

            const shape = this.children[i];

            if(shape instanceof Point){

                g.appendChild(useCircle ? shape.getCircle(pointStyle) : shape.getPath(pointStyle));

                continue;
            }

            if(shape instanceof Line){

                g.appendChild(useLine ? shape.getLine(lineStyle) : shape.getPath(lineStyle));

                continue;
            }
        }
        
        return g;
    }

    //MARK: Draw on Canvas
    draw(ctx = new CanvasRenderingContext2D(), {pointStyle = {}, lineStyle = {}} = {}){

        for (let i = 0; i < this.children.length; i++) {

            const shape = this.children[i];

            if(shape instanceof Point){

                shape.draw(ctx, pointStyle);
                continue;
            }

            if(shape instanceof Line){

                shape.draw(ctx, lineStyle);
                continue;
            }
        }
    }
}