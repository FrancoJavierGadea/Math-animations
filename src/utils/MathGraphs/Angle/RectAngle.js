import { RADIANS } from "../utils";

/**
 * @typedef {Object} AngleParams
 *  @property {String} name
 *  @property {Number} angle Angle value in radians
 *  @property {Number} radius Radius size in px
 *  @property {Point} point
 *  @property {Number} rotate Rotate angle in radians
 *  @property {import("./Angle.js").AngleStyles} style
 */

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

    //MARK: SVG 
    svg = {

        /**
         * @param {import("./Angle.js").AngleStyles} style Override styles 
         * @param {{jsx: Boolean}} opt 
         * @returns Object with SVG style properties in normal or jsx
         */
        getStyles: (style, {jsx = false} = {}) => {
    
            if(jsx){
    
                return {
                    'stroke': style?.color ?? this.style.color,
                    'strokeWidth': style?.lineWidth ?? this.style.lineWidth,
                    'fill': style?.color ?? this.style.color,
                    'fillOpacity': style?.opacity ?? this.style.fillOpacity,
                }
            }
            else {
    
                return {
                    'stroke': style?.color ?? this.style.color,
                    'stroke-width': style?.lineWidth ?? this.style.lineWidth,
                    'fill': style?.color ?? this.style.color,
                    'fill-opacity': style?.opacity ?? this.style.fillOpacity,
                }
            }
        },

        /**
         * @returns {String} The "d" path attribute
         */
        getPathD: () => {
    
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
        },
    
        /**
         * @param {import("./Angle.js").AngleStyles} style - Override styles 
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
    
        //MARK: Draw on SVG rect
        /**
         * @returns {{x:number, y:number, width:number, height:number, transform:string}} - SVG Rect element properties
         */
        getRectAttr: () => {
    
            const [i, j] = this.quadrant;
        
            return {
                x: this.point.x - Math.sign(1 - i) * this.size, 
                y: this.point.y - Math.sign(1 - j) * this.size,
                width: this.size,
                height: this.size,
                transform: `rotate(${-this.rotate * RADIANS}, ${this.point.x}, ${this.point.y})`
            }
        },
    
        /**
         * @param {import("./Angle.js").AngleStyles} style - Override styles 
         * @returns {SVGRectElement} SVG rect element
         */
        getRect: (style) => {
    
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    
            Object.entries({
                'class': 'Angle',
                ...this.svg.getStyles(style),
                'data-name': this.name,
                ...this.svg.getRectAttr()
            })
            .forEach(([key, value]) => {
    
                if(value) rect.setAttribute(key, value);
            });
            
            return rect;
        },
    }

    //MARK: Draw on Canvas
    /**
     * @param {CanvasRenderingContext2D} ctx - Canvas context 2D
     * @param {import("./Angle.js").AngleStyles} style - Override styles
     */
    draw(ctx = new CanvasRenderingContext2D(), style){

        ctx.save();

        ctx.strokeStyle = style?.color ?? this.style.color;
        ctx.lineWidth = style?.lineWidth ?? this.style.lineWidth;
        ctx.fillStyle = style?.color ?? this.style.color;
        
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
        ctx.globalAlpha = style?.fillOpacity ?? this.style.fillOpacity;
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