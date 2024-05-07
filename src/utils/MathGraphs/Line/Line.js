
export class Line {

    static defaultStyle = {
        color: '#000000',
        lineWidth: 1.0,
        lineDash: []
    }

    constructor(params = {}){

        const {
            start = [100, 100],
            end = [300, 100],
            name,
            style = {},
        } = params;

        this.name = name;
        this.style = {
            ...Line.defaultStyle,
            ...style
        }

        this.start = {
            x: start['x'] ?? start[0],
            y: start['y'] ?? start[1]
        }
        this.end = {
            x: end['x'] ?? end[0],
            y: end['y'] ?? end[1]
        }
    }

    //MARK: Draw on SVG Path
    getPathD(){

        return `M${this.start.x} ${this.start.y}L${this.end.x} ${this.end.y}`;
    }

    getPath(style = {}){

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        Object.entries({
            'class': 'Line',
            'stroke': style?.color ?? this.style.color,
            'stroke-width': style?.lineWidth ?? this.style.lineWidth,
            'stroke-dasharray': style?.lineDash?.join(' ') ?? this.style.lineDash.join(' '),
            'fill': 'none',
            'data-name': this.name,
            'd': this.getPathD()
        })
        .forEach(([key, value]) => {

            if(value) path.setAttribute(key, value);
        });
        
        return path;
    }

    //MARK: Draw on SVG line
    getLineAttr(){
        return {
            'x1': this.start.x,
            'y1': this.start.y,
            'x2': this.end.x,
            'y2': this.end.y
        }
    }

    getLine(style){

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

        Object.entries({
            'class': 'Line',
            'stroke': style?.color ?? this.style.color,
            'stroke-width': style?.lineWidth ?? this.style.lineWidth,
            'stroke-dasharray': style?.lineDash?.join(' ') ?? this.style.lineDash.join(' '),
            'fill': 'none',
            'data-name': this.name,
            ...this.getLineAttr()
        })
        .forEach(([key, value]) => {

            if(value) line.setAttribute(key, value);
        });
        
        return line;
    }

    //MARK: Draw on Canvas
    draw(ctx = new CanvasRenderingContext2D(), style = {}){

        ctx.save();

        ctx.strokeStyle = style?.color ?? this.style.color;
        ctx.lineWidth = style?.lineWidth ?? this.style.lineWidth;
        ctx.setLineDash(style?.lineDash ?? this.style.lineDash);
        
        ctx.beginPath();

        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);

        ctx.stroke();

        ctx.restore();
    }
}


//MARK: LinePointWithAngle
