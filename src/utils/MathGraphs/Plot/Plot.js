

export class Plot {

    static defaultStyle = {
        color: '#000000',
        lineWidth: 1.0,
        lineDash: [],
        opacity: 1
    }

    constructor(params = {}){

        const {
            func = (x) => x,
            range = [-5, 5],
            step = 0.1,
            axis,
            name,
            style = {},
        } = params;

        this.function = func;
        this.range = {
            min: range['min'] ?? range[0],
            max: range['max'] ?? range[1]
        }
        this.step = Math.abs(step);
        this.axis = axis;
        this.name = name;
        this.style = {
            ...Plot.defaultStyle,
            ...style
        };

        this.points = this.#generatePoints();
    }

    #generatePoints(){

        const values = [];

        let x = this.range.min;

        do {
            let y = this.function(x);

            values.push({
                point: {x, y},
                axisPoint: {
                    x: this.axis?.x(x), 
                    y: this.axis?.y(y)
                }
            })

            x += this.step;
        }
        while(x <= this.range.max);

        return values;
    }


    //MARK: SVG Style
    getStyle(style){

        return {
            'stroke': style?.color ?? this.style.color,
            'stroke-width': style?.lineWidth ?? this.style.lineWidth,
            'stroke-opacity': style?.opacity ?? this.style.opacity,
            'stroke-dasharray': style?.lineDash?.join(' ') ?? this.style.lineDash.join(' '),
            'fill': 'none',
        }
    }

    //MARK: Draw on SVG Path
    getPathD(){

        let d = '';

        for (let i = 0; i < this.points.length; i++) {

            const {axisPoint} = this.points[i];

            d += i === 0 ? `M${axisPoint.x} ${axisPoint.y}` : `L${axisPoint.x} ${axisPoint.y}`;
        }

        return d;
    }

    getPath(style){
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        Object.entries({
            'class': 'Plot',
            ...this.getStyle(style),
            'data-name': this.name,
            'd': this.getPathD()
        })
        .forEach(([key, value]) => {

            if(value) path.setAttribute(key, value);
        });
        
        return path;
    }

    //MARK: Draw on SVG Polyline
    getPolylineAttr(){

        return {
            points: this.points.reduce((acc, point) => {

                const {axisPoint} = point;
    
                acc += `${axisPoint.x},${axisPoint.y} `;

                return acc;
            }, '')
            .trimEnd()
        }
    }

    getPolyline(style){
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');

        Object.entries({
            'class': 'Plot',
            ...this.getStyle(style),
            'data-name': this.name,
            ...this.getPolylineAttr()
        })
        .forEach(([key, value]) => {

            if(value) polyline.setAttribute(key, value);
        });
        
        return polyline;
    }

    //MARK: Draw on Canvas
    draw(ctx = new CanvasRenderingContext2D(), style){

        ctx.save();

        ctx.strokeStyle = style?.color ?? this.style.color;
        ctx.lineWidth = style?.lineWidth ?? this.style.lineWidth;
        ctx.setLineDash(style?.lineDash ?? this.style.lineDash);
        ctx.globalAlpha = style?.opacity ?? this.style.opacity;

        ctx.beginPath();

        for (let i = 0; i < this.points.length; i++) {

            const {axisPoint} = this.points[i];

            if(i === 0) {

                ctx.moveTo(axisPoint.x, axisPoint.y);
            }
            else {

                ctx.lineTo(axisPoint.x, axisPoint.y);
            }
        }

        ctx.stroke();

        ctx.restore();
    }
}