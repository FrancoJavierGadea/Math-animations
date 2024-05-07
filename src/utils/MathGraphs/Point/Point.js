
export class Point {

    static defaultStyle = {
        color: '#000000',
        borderColor: '#ffffff',
        lineWidth: 1.0,
        fillOpacity: 1
    }

    constructor(params){

        const {
            radius = 4,
            point = [100, 100],
            name,
            style = {},
        } = params;

        this.name = name;
        this.style = {
            ...Point.defaultStyle,
            ...style
        }

        this.radius = radius;
        this.point = {
            x: point['x'] ?? point[0],
            y: point['y'] ?? point[1]
        }
    }

    //MARK: Draw on SVG Path
    getPathD(){

        return [
            `M${this.point.x} ${this.point.y}`,
            `m${this.radius} ${0}`,
            `a${this.radius} ${this.radius} 0 ${0} 0 ${-2 * this.radius} ${0}`,
            `a${this.radius} ${this.radius} 0 ${0} 0 ${2 * this.radius} ${0}`,
        ]
        .join('');
    }

    getPath({color, lineWidth, fillOpacity, borderColor} = {}){

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        Object.entries({
            'class': 'Angle',
            'stroke': borderColor ?? this.style.borderColor,
            'stroke-width': (lineWidth ?? this.style.lineWidth) - 1,
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

    //MARK: Draw on SVG circle
    getCircleAttr(){
        return {
            'cx': this.point.x,
            'cy': this.point.y,
            'r': this.radius
        }
    }

    getCircle({color, lineWidth, fillOpacity, borderColor} = {}){

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

        Object.entries({
            'class': 'Angle',
            'stroke': borderColor ?? this.style.borderColor,
            'stroke-width': (lineWidth ?? this.style.lineWidth) - 1,
            'fill': color ?? this.style.color,
            'fill-opacity': fillOpacity ?? this.style.fillOpacity,
            'data-name': this.name,
            ...this.getCircleAttr()
        })
        .forEach(([key, value]) => {

            if(value) circle.setAttribute(key, value);
        });
        
        return circle;
    }


    //MARK: Draw on Canvas
    draw(ctx = new CanvasRenderingContext2D(), {color, lineWidth, fillOpacity, borderColor} = {}){

        ctx.save();

        ctx.strokeStyle = borderColor ?? this.style.borderColor;
        ctx.lineWidth = lineWidth ?? this.style.lineWidth;
        ctx.fillStyle = color ?? this.style.color;
        
        ctx.beginPath();

        ctx.arc(this.point.x, this.point.y, this.radius, 0, 2 * Math.PI, true);

        ctx.closePath();

        ctx.stroke();
        ctx.globalAlpha = fillOpacity ?? this.style.fillOpacity;
        ctx.fill();

        ctx.restore();
    }
}