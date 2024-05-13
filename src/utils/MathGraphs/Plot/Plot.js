
/**
 * @typedef {Object} PlotStyles
 *  @property {String} color
 *  @property {Number} lineWidth
 *  @property {Number} opacity
 *  @property {Array<Number>} lineDash
 * 
 * @typedef {Object} PlotParams
 *  @property {String} name
 *  @property {(x:number) => number} func
 *  @property {import("@utils/MathGraphs/types.js").Range} range
 *  @property {Number} step
 *  @property {import("@utils/MathGraphs/Axis.js").Axis} axis
 *  @property {PlotStyles} style
 */

export class Plot {

    static defaultStyle = {
        color: '#000000',
        lineWidth: 1.0,
        lineDash: [],
        opacity: 1
    }

    /**
     * @constructor
     * @param {PlotParams} params 
     */
    constructor(params){
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

    /**
     * @param {Object} params
     * @param {(x:number) => number} params.func
     * @param {import("@utils/MathGraphs/types.js").Range} params.range
     * @param {import("../Axis.js").Axis} params.axis
     * @param {number} params.step
     */
    update({func, range, step, axis} = {}){

        if(func) this.function = func;

        if(range) this.range = {
            min: range['min'] ?? range[0],
            max: range['max'] ?? range[1]
        };

        if(step) this.step = Math.abs(step);

        if(axis) this.axis = axis;
         
        this.points = this.#generatePoints();
    }

    
    //MARK: SVG
    svg = {
        /**
         * @param {PlotStyles} style - Override styles 
         * @param {{jsx:boolean}} options 
         * @returns 
         */
        getStyles: (style, {jsx = false} = {}) => {
    
            if(jsx){
    
                return {
                    'stroke': style?.color ?? this.style.color,
                    'strokeWidth': style?.lineWidth ?? this.style.lineWidth,
                    'strokeOpacity': style?.opacity ?? this.style.opacity,
                    'strokeDasharray': style?.lineDash?.join(' ') ?? this.style.lineDash.join(' '),
                    'fill': 'none',
                }
            }
            else {
    
                return {
                    'stroke': style?.color ?? this.style.color,
                    'stroke-width': style?.lineWidth ?? this.style.lineWidth,
                    'stroke-opacity': style?.opacity ?? this.style.opacity,
                    'stroke-dasharray': style?.lineDash?.join(' ') ?? this.style.lineDash.join(' '),
                    'fill': 'none',
                }
            }
        },

        //MARK: Draw on SVG Path
        /**
         * @returns {String} The "d" path attribute
         */
        getPathD: () => {
    
            let d = '';
    
            for (let i = 0; i < this.points.length; i++) {
    
                const {axisPoint} = this.points[i];
    
                d += i === 0 ? `M${axisPoint.x} ${axisPoint.y}` : `L${axisPoint.x} ${axisPoint.y}`;
            }
    
            return d;
        },
    
        /**
         * @param {PlotStyles} style - Override styles 
         * @returns {SVGPathElement} - SVG Path element
         */
        getPath: (style) => {
    
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
            Object.entries({
                'class': 'Plot',
                ...this.svg.getStyles(style),
                'data-name': this.name,
                'd': this.svg.getPathD()
            })
            .forEach(([key, value]) => {
    
                if(value) path.setAttribute(key, value);
            });
            
            return path;
        },
    
        //MARK: Draw on SVG Polyline
        /**
         * @returns {{points:string}}
         */
        getPolylineAttr: () => {
    
            return {
                points: this.points.reduce((acc, point) => {
    
                    const {axisPoint} = point;
        
                    acc += `${axisPoint.x},${axisPoint.y} `;
    
                    return acc;
                }, '')
                .trimEnd()
            }
        },
    
        /**
         * @param {PlotStyles} style - Override styles 
         * @returns {SVGPolylineElement} - SVG Polyline element
         */
        getPolyline: (style) => {

            const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    
            Object.entries({
                'class': 'Plot',
                ...this.svg.getStyles(style),
                'data-name': this.name,
                ...this.svg.getPolylineAttr()
            })
            .forEach(([key, value]) => {
    
                if(value) polyline.setAttribute(key, value);
            });
            
            return polyline;
        },
    }


    //MARK: Draw on Canvas
    /**
     * @param {CanvasRenderingContext2D} ctx - Canvas context 2D
     * @param {PlotStyles} style - Override styles
     */
    draw(ctx, style){

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