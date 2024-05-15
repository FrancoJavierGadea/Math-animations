
/**
 * @typedef {Object} ArrowStyles
 *  @property {String} color default: #000
 *  @property {Number} lineWidth default: 1.0
 *  @property {Array<Number>} lineDash default: []
 * 
 * @typedef {Object} ArrowParams
 *  @property {import("@utils/MathGraphs/types.js").Point} start Start point
 *  @property {import("@utils/MathGraphs/types.js").Point} end End point
 *  @property {String} name 
 *  @property {ArrowStyles} style Arrow styles
 */

import { DEGREES } from "../utils";

export class Arrow {

    static defaultStyle = {
        color: '#000000',
        lineWidth: 1.0,
        lineDash: []
    }

    /**
     * @constructor
     * @param {ArrowParams} params
     */
    constructor(params = {}){

        const {
            start = [100, 100],
            end = [300, 100],
            name,
            size = 15,
            delta = 30 * DEGREES,
            startArrow = true,
            endArrow = true,
            style = {},
        } = params;

        this.name = name;
        this.style = {
            ...Arrow.defaultStyle,
            ...style
        }
        
        this.size = size;
        this.delta = delta;

        this.start = {
            x: start['x'] ?? start[0],
            y: start['y'] ?? start[1]
        }
        this.end = {
            x: end['x'] ?? end[0],
            y: end['y'] ?? end[1]
        }

        this.startArrow = startArrow;
        this.endArrow = endArrow;

        this.#initArrowHeads();
    }

    #arrowHeads;
    #arrowLine;

    #initArrowHeads(){

        const {start, end, endArrow, startArrow, size, delta} = this;

        const angle1 = Math.atan2(end.y - start.y, end.x - start.x);
        const angle2 = Math.atan2(start.y - end.y, start.x - end.x);

        this.#arrowLine = {
            start: {
                x: startArrow ? start.x + size * Math.cos(angle1) * 0.5 : start.x,
                y: startArrow ? start.y + size * Math.sin(angle1) * 0.5 : start.y
            },
            end: {
                x: endArrow ? end.x + size * Math.cos(angle2) * 0.5 : end.x,
                y: endArrow ? end.y + size * Math.sin(angle2) * 0.5 : end.y
            }
        }

        this.#arrowHeads = {
            startHead: {
                point: start,
                pivot1: {
                    x: start.x + size * Math.cos(angle1 + delta),
                    y: start.y + size * Math.sin(angle1 + delta)
                },
                pivot2: {
                    x: start.x + size * Math.cos(angle1 - delta),
                    y: start.y + size * Math.sin(angle1 - delta)
                },
            },
            endHead: {
                point: end,
                pivot1: {
                    x: end.x + size * Math.cos(angle2 + delta),
                    y: end.y + size * Math.sin(angle2 + delta)
                },
                pivot2: {
                    x: end.x + size * Math.cos(angle2 - delta),
                    y: end.y + size * Math.sin(angle2 - delta)
                },
            }
        }
    }

    //MARK: SVG
    svg = {

        /**
         * @param {ArrowStyles} style Override styles 
         * @param {{jsx: Boolean}} opt 
         * @returns {{line: Object, head: Object}} Object with SVG style properties in normal or JSX
         */
        getStyles: (style, {jsx = false} = {}) => {

            if(jsx) {
                return {
                    line: {
                        'stroke': style?.color ?? this.style.color,
                        'strokeWidth': style?.lineWidth ?? this.style.lineWidth,
                        'strokeDasharray': style?.lineDash?.join(' ') ?? this.style.lineDash.join(' '),
                        'fill': 'none',
                    },
                    head: {
                        'fill': style?.color ?? this.style.color,
                    }
                }
            }
            else {
                return {
                    line: {
                        'stroke': style?.color ?? this.style.color,
                        'stroke-width': style?.lineWidth ?? this.style.lineWidth,
                        'stroke-dasharray': style?.lineDash?.join(' ') ?? this.style.lineDash.join(' '),
                        'fill': 'none',
                    },
                    head: {
                        'fill': style?.color ?? this.style.color,
                    }
                }
            }
        }, 

        //MARK: SVG Path D
        /**
         * @returns {{line: String, startArrow: String, endArrow: String}} The "d" path attribute
         */
        getPathD: () => {

            const {start, end} = this.#arrowLine;

            const drawHead = ({point, pivot1, pivot2}) => {

                return [
                    `M${point.x} ${point.y}`,
                    `L${pivot1.x} ${pivot1.y}`,
                    `L${pivot2.x} ${pivot2.y}`,
                    `Z`
                ]
                .join('');
            }

            return {
                line: `M${start.x} ${start.y}L${end.x} ${end.y}`,
                startArrow: drawHead(this.#arrowHeads.startHead),
                endArrow: drawHead(this.#arrowHeads.endHead)
            };
        },

        //MARK: SVG G
        /**
         * @param {ArrowStyles} style - Override styles 
         * @returns {SVGPathElement} - SVG Path element
         */
        getG: (style) => {

            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('data-name', this.name);
            g.setAttribute('class', 'Arrow');

            const D = this.svg.getPathD();
            const Styles = this.svg.getStyles(style);

            //Draw line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            Object.entries({
                'class': 'Arrow-line',
                'd': D.line,
                ...Styles.line,
            })
            .forEach(([key, value]) => {
    
                if(value) line.setAttribute(key, value);
            });

            g.appendChild(line);

            //Draw Arrow heads
            const drawHead = (d) => {

                const head = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                head.setAttribute('d', d);
                head.setAttribute('class', 'Arrow-head');
                head.setAttribute('fill', Styles.head.fill);

                g.appendChild(head);
            }

            if(this.startArrow) drawHead(D.startArrow);
            if(this.endArrow) drawHead(D.endArrow);

            return g;
        }
    }


    //MARK: Draw on Canvas
    /**
     * @param {CanvasRenderingContext2D} ctx Canvas context 2D
     * @param {ArrowStyles} style Override styles 
     */
    draw(ctx, style){

        ctx.save();

        const {start, end} = this.#arrowLine;

        //Draw Line
        ctx.strokeStyle = style?.color ?? this.style.color;
        ctx.fillStyle = style?.color ?? this.style.color;
        ctx.lineWidth = style?.lineWidth ?? this.style.lineWidth;
        ctx.setLineDash(style?.lineDash ?? this.style.lineDash);
        
        ctx.beginPath();

        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);

        ctx.stroke();
        
        //Draw arrow heads
        ctx.setLineDash(Arrow.defaultStyle.lineDash);

        if(this.startArrow) this.#drawArrowHead(this.#arrowHeads.startHead, ctx);
        if(this.endArrow) this.#drawArrowHead(this.#arrowHeads.endHead, ctx);

        ctx.restore();
    }

    #drawArrowHead(head, ctx){
        ctx.beginPath();

        ctx.moveTo(head.point.x, head.point.y);
        ctx.lineTo(head.pivot1.x, head.pivot1.y);
        ctx.lineTo(head.pivot2.x, head.pivot2.y);
        ctx.closePath();

        ctx.fill();
    }
}