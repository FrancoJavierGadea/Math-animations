
/**
 * @typedef {Object} AngleStyles
 *  @property {String} color
 *  @property {Number} lineWidth
 *  @property {Number} fillOpacity
 * 
 * @typedef {Object} AngleParams
 *  @property {String} name
 *  @property {Number} angle Angle value in radians
 *  @property {Number} radius Radius size in px
 *  @property {Point} point
 *  @property {Number} rotate Rotate angle in radians
 *  @property {AngleStyles} style
 */

export class Angle {

    static defaultStyle = {
        color: '#000000',
        lineWidth: 1.0,
        fillOpacity: 0.4
    }

    /**
     * @constructor
     * @param {AngleParams} params 
     */
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

    //MARK: SVG
    svg = {
        /**
         * @param {AngleStyles} style Override styles 
         * @param {{jsx: Boolean}} opt 
         * @returns Object with SVG style properties in normal or jsx
         */
        getStyles: (style, {jsx = false}) => {
    
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

        //MARK: Draw on SVG Path
        /**
         * @returns {String} The "d" path attribute
         */
        getPathD: () => {
    
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
        },

        /**
         * @param {AngleStyles} style - Override styles 
         * @returns {SVGPathElement} - SVG Path element
         */
        getPath: (style) => {
    
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
            Object.entries({
                'class': 'Angle',
                ...this.svg.getAngleStyles(style),
                'data-name': this.name,
                'd': this.svg.getPathD()
            })
            .forEach(([key, value]) => {
    
                if(value) path.setAttribute(key, value);
            });
            
            return path;
        },
    }

    //MARK: Draw on Canvas
    /**
     * @param {CanvasRenderingContext2D} ctx - Canvas context 2D
     * @param {import("./Angle.js").AngleStyles} style - Override styles
     */
    draw(ctx = new CanvasRenderingContext2D(), style){

        ctx.save();

        ctx.beginPath();
        ctx.strokeStyle = style?.color ?? this.style.color;
        ctx.lineWidth = style?.lineWidth ?? this.style.lineWidth;
        ctx.fillStyle = style?.color ?? this.style.color;

        ctx.moveTo(this.point.x, this.point.y);

        ctx.arc(this.point.x, this.point.y, this.radius, -this.rotate, -(this.angle + this.rotate), true);

        ctx.closePath();

        ctx.stroke();
        ctx.globalAlpha = style?.fillOpacity ?? this.style.fillOpacity;
        ctx.fill();

        ctx.restore();
    }
}