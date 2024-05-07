import { RADIANS } from "../utils";


export class RectAngle {

    static defaultStyle = {
        color: '#000000',
        lineWidth: 1.0,
        fillOpacity: 0.4
    }

    static QUADRANTS = {
        '1': [1, 1],
        '2': [-1, 1],
        '3': [-1, -1],
        '4': [1, -1],
    }

    constructor(params){

        const {
            size = 50,
            point = [100, 100],
            quadrant = RectAngle.QUADRANTS[4],
            rotate = 0,
            name,
            style = {},
        } = params;

        this.name = name;
        this.style = {
            ...RectAngle.defaultStyle,
            ...style
        }

        this.rotate = rotate % (2 * Math.PI)
        this.size = size;
        this.point = {
            x: point['x'] ?? point[0],
            y: point['y'] ?? point[1]
        }

        this.quadrant = [Math.sign(quadrant[0]), Math.sign(-quadrant[1])];
    }

    //MARK: Draw on SVG Path
    getPathD(){

        const [i, j] = this.quadrant;

        const cos = Math.cos(this.rotate);
        const sin = Math.sin(-this.rotate);

        const pivots = [
            {
                x: i * this.size,
                y: 0,
            },
            {
                x: i * this.size,
                y: j * this.size,
            },
            {
                x: 0,
                y: j * this.size
            }
        ]

        let d = `M${this.point.x} ${this.point.y}`;

        for (let i = 0; i < pivots.length; i++) {

            const {x, y} = pivots[i];

            const rotatedX = this.point.x + (x * cos) - (y * sin);
            const rotatedY = this.point.y + (y * cos) + (x * sin);
            
            d += `L${rotatedX} ${rotatedY}`;
        }
        
        d += 'Z';

        return d;
    }

    getPath({color, lineWidth, fillOpacity} = {}){

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        Object.entries({
            'class': 'Angle',
            'stroke': color ?? this.style.color,
            'stroke-width': lineWidth ?? this.style.lineWidth,
            'fill': color ?? this.style.color,
            'fill-opacity': fillOpacity ?? this.style.fillOpacity,
            'data-name': this.name,
            'd': this.getPathD()
        })
        .forEach(([key, value]) => {

            if(value) path.setAttribute(key, value);
        });
        
        return path;
    }

    //MARK: Draw on SVG rect
    getRectAttr(){

        const [i, j] = this.quadrant;
    
        return {
            x: this.point.x - Math.sign(1 - i) * this.size, 
            y: this.point.y - Math.sign(1 - j) * this.size,
            width: this.size,
            height: this.size,
            transform: `rotate(${-this.rotate * RADIANS}, ${this.point.x}, ${this.point.y})`
        }
    }

    getRect({color, lineWidth, fillOpacity} = {}){

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

        Object.entries({
            'class': 'Angle',
            'stroke': color ?? this.style.color,
            'stroke-width': lineWidth ?? this.style.lineWidth,
            'fill': color ?? this.style.color,
            'fill-opacity': fillOpacity ?? this.style.fillOpacity,
            'data-name': this.name,
            ...this.getRectAttr()
        })
        .forEach(([key, value]) => {

            if(value) rect.setAttribute(key, value);
        });
        
        return rect;
    }

    //MARK: Draw on Canvas
    draw(ctx = new CanvasRenderingContext2D(), {color, lineWidth, fillOpacity} = {}){

        ctx.save();

        ctx.strokeStyle = color ?? this.style.color;
        ctx.lineWidth = lineWidth ?? this.style.lineWidth;
        ctx.fillStyle = color ?? this.style.color;
        
        ctx.translate(this.point.x, this.point.y);
        ctx.rotate(-this.rotate);
     
        ctx.beginPath();
        
        const [i, j] = this.quadrant;

        ctx.moveTo(0, 0);
        ctx.lineTo(i * this.size, 0);
        ctx.lineTo(i * this.size, j * this.size);
        ctx.lineTo(0, j * this.size);

        ctx.closePath();

        ctx.stroke();
        ctx.globalAlpha = fillOpacity ?? this.style.fillOpacity;
        ctx.fill();

        ctx.restore();
    }
}


/* About rotate square points
 *
 * Show: https://stackoverflow.com/questions/1469149/calculating-vertices-of-a-rotated-rectangle
 *
 * x' = x * cos(t) - y * sin(t)
 * y' = x * sin(t) + y * cos(t)
 * 
*/