
/**
 * @typedef {Object} LineStyles
 *  @property {String} color
 *  @property {Number} lineWidth
 *  @property {Array<Number>} lineDash
 * 
 * @typedef {Object} LineParams
 *  @property {String} name
 *  @property {Number} start Start point
 *  @property {Number} end End point
 *  @property {LineStyles} style
 */

export class Line {

    static defaultStyle = {
        color: '#000000',
        lineWidth: 1.0,
        lineDash: []
    }

    /**
     * @constructor
     * @param {LineParams} params 
     */
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

    //MARK: SVG
    svg = {

        /**
         * @param {LineStyles} style Override styles 
         * @param {{jsx: Boolean}} opt 
         * @returns Object with SVG style properties in normal or jsx
         */
        getStyles: (style, {jsx = false}) => {

            if(jsx) {
                return {
                    'stroke': style?.color ?? this.style.color,
                    'strokeWidth': style?.lineWidth ?? this.style.lineWidth,
                    'strokeDasharray': style?.lineDash?.join(' ') ?? this.style.lineDash.join(' '),
                    'fill': 'none',
                }
            }
            else {
                return {
                    'stroke': style?.color ?? this.style.color,
                    'stroke-width': style?.lineWidth ?? this.style.lineWidth,
                    'stroke-dasharray': style?.lineDash?.join(' ') ?? this.style.lineDash.join(' '),
                    'fill': 'none',
                }
            }
        }, 

        /**
         * @returns {String} The "d" path attribute
         */
        getPathD: () => {
    
            return `M${this.start.x} ${this.start.y}L${this.end.x} ${this.end.y}`;
        },
    
        /**
         * @param {LineStyles} style - Override styles 
         * @returns {SVGPathElement} - SVG Path element
         */
        getPath: (style) => {
    
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
            Object.entries({
                'class': 'Line',
                ...this.svg.getStyles(style),
                'data-name': this.name,
                'd': this.svg.getPathD()
            })
            .forEach(([key, value]) => {
    
                if(value) path.setAttribute(key, value);
            });
            
            return path;
        },
    
        //MARK: Draw on SVG line
        /**
         * @returns {{x1:number, y1:number, x2:number, y2:number}} - SVG Line element properties
         */
        getLineAttr: () => {
            return {
                'x1': this.start.x,
                'y1': this.start.y,
                'x2': this.end.x,
                'y2': this.end.y
            }
        },
    
        /**
         * @param {LineStyles} style - Override styles 
         * @returns {SVGLineElement} - SVG Line element
         */
        getLine: (style) => {
    
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    
            Object.entries({
                'class': 'Line',
                ...this.svg.getStyles(style),
                'data-name': this.name,
                ...this.svg.getLineAttr()
            })
            .forEach(([key, value]) => {
    
                if(value) line.setAttribute(key, value);
            });
            
            return line;
        },
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
