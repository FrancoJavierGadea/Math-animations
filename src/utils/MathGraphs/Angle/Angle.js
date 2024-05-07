
export class Angle {

    static defaultStyle = {
        color: '#000000',
        lineWidth: 1.0,
        fillOpacity: 0.4
    }

    constructor(params = {}){

        const {
            angle = 0,
            radius = 50,
            point = [100, 100],
            rotate = 0,
            name,
            style = {},
        } = params;

        this.name = name;
        this.style = {
            ...Angle.defaultStyle,
            ...style
        }

        this.angle = angle % (2 * Math.PI);
        this.rotate = rotate % (2 * Math.PI)
        this.radius = radius;
        this.point = {
            x: point['x'] ?? point[0],
            y: point['y'] ?? point[1]
        }
    }

    //MARK: Draw on SVG Path
    getPathD(){

        const arc = {
            rx: this.radius,
            ry: this.radius,
            rotation: 0,
            largeArcFlag: this.angle > Math.PI ? 1 : 0,
            sweepFlag: 0,
            x: this.point.x + this.radius * Math.cos(-(this.angle + this.rotate)),
            y: this.point.y + this.radius * Math.sin(-(this.angle + this.rotate))
        }

        return [
            `M${this.point.x} ${this.point.y}`,
            `L${this.point.x + this.radius * Math.cos(-this.rotate)} ${this.point.y + this.radius * Math.sin(-this.rotate)}`,
            `A${arc.rx} ${arc.ry} ${arc.rotation} ${arc.largeArcFlag} ${arc.sweepFlag} ${arc.x} ${arc.y}`,
            `Z`
        ]
        .join('');
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

    //MARK: Draw on Canvas
    draw(ctx = new CanvasRenderingContext2D(), {color, lineWidth, fillOpacity} = {}){

        ctx.save();

        ctx.beginPath();
        ctx.strokeStyle = color ?? this.style.color;
        ctx.lineWidth = lineWidth ?? this.style.lineWidth;
        ctx.fillStyle = color ?? this.style.color;

        ctx.moveTo(this.point.x, this.point.y);

        ctx.arc(this.point.x, this.point.y, this.radius, -this.rotate, -(this.angle + this.rotate), true);

        ctx.closePath();

        ctx.stroke();
        ctx.globalAlpha = fillOpacity ?? this.style.fillOpacity;
        ctx.fill();

        ctx.restore();
    }
}