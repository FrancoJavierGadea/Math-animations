
/**
 * @typedef {Object} PointStyles
 *  @property {String} color
 *  @property {Number} lineWidth
 *  @property {String} borderColor
 *  @property {Number} fillOpacity
 * 
 * @typedef {Object} PointParams
 *  @property {String} name
 *  @property {Number} radius Start point
 *  @property {LineStyles} style
 */

export class Point {

    static defaultStyle = {
        color: '#000000',
        borderColor: '#ffffff',
        lineWidth: 1.0,
        fillOpacity: 1
    }

    /**
     * @constructor
     * @param {PointParams} params 
     */
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

    //MARK: SVG
    svg = {
        /**
         * @param {PointStyles} style Override styles 
         * @param {{jsx: Boolean}} opt 
         * @returns Object with SVG style properties in normal or jsx
         */
        getStyles: (style, {jsx = false}) => {

            if(jsx) {
                return {
                    'stroke': style?.borderColor ?? this.style.borderColor,
                    'strokeWidth': (style?.lineWidth ?? this.style.lineWidth) - 1,
                    'fill': style?.color ?? this.style.color,
                    'fillOpacity': style?.fillOpacity ?? this.style.fillOpacity,
                }
            }
            else {
                return {
                    'stroke': style?.borderColor ?? this.style.borderColor,
                    'stroke-width': (style?.lineWidth ?? this.style.lineWidth) - 1,
                    'fill': style?.color ?? this.style.color,
                    'fill-opacity': style?.fillOpacity ?? this.style.fillOpacity,
                }
            }
        },
        
        /**
         * @returns {String} The "d" path attribute
         */
        getPathD: () => {
    
            return [
                `M${this.point.x} ${this.point.y}`,
                `m${this.radius} ${0}`,
                `a${this.radius} ${this.radius} 0 ${0} 0 ${-2 * this.radius} ${0}`,
                `a${this.radius} ${this.radius} 0 ${0} 0 ${2 * this.radius} ${0}`,
            ]
            .join('');
        },

        /**
         * @param {PointStyles} style - Override styles 
         * @returns {SVGPathElement} - SVG Path element
         */
        getPath: (style) => {
    
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
            Object.entries({
                'class': 'Angle',
                ...this.svg.getStyles(style),
                'data-name': this.name,
                'd': this.svg.getPathD()
            })
            .forEach(([key, value]) => {
    
                if(value) path.setAttribute(key, value);
            });
            
            return path;
        },

        //MARK: Draw on SVG circle
        /** @returns {{cx:number, cy:number, r:number}} */
        getCircleAttr(){
            return {
                'cx': this.point.x,
                'cy': this.point.y,
                'r': this.radius
            }
        },

        /**
         * @param {PointStyles} styles 
         * @returns {SVGCircleElement}
         */
        getCircle: (style) => {
    
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    
            Object.entries({
                'class': 'Angle',
                ...this.svg.getStyles(style),
                'data-name': this.name,
                ...this.svg.getCircleAttr()
            })
            .forEach(([key, value]) => {
    
                if(value) circle.setAttribute(key, value);
            });
            
            return circle;
        },
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