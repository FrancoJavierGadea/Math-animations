import { Plot } from "./Plot";

/**
 * @typedef {[min:number, max:number] | {min:number, max:number}} Range
 * 
 * @typedef {[x:number, y:number] | {x:number, y:number}} Point
 *
 * @typedef {Object} Styles
 *  @property {String} color
 *  @property {Number} lineWidth
 *  @property {Number} opacity
 *  @property {Array<Number>} lineDash
 * 
 * @typedef {Object} AcotPlotParams
 *  @property {String} name
 *  @property {(x:number) => number} func
 *  @property {Range} range
 *  @property {Number} step
 *  @property {import("../Axis.js").Axis} axis
 *  @property {Number} buff
 *  @property {Styles} plotStyle 
 *  @property {Styles} dashPlotStyle
 */


export class AcotPlot {

    static defaultDashPlotStyle = {
        color: '#000000',
        lineWidth: 1.0,
        lineDash: [5],
        opacity: 0.5
    }

    /**
     * @constructor
     * @param {AcotPlotParams} params 
     */
    constructor(params = {}){

        const {
            func = (x) => x,
            range = [-5, 5],
            step = 0.1,
            axis,
            name,
            buff = 3,
            plotStyle = {},
            dashPlotStyle = {}  
        } = params;

        this.function = func;
        this.range = {
            min: range['min'] ?? range[0],
            max: range['max'] ?? range[1]
        }
        this.step = Math.abs(step);
        this.buff = Math.abs(buff);
        this.axis = axis;
        this.name = name;

        this.plotStyle = plotStyle;
        this.dashPlotStyle = {
            ...AcotPlot.defaultDashPlotStyle,
            ...dashPlotStyle
        }

        this.#initChildren();
    }

    #initChildren(){

        this.elements = {

            plot: new Plot({
                func: this.function,
                range: this.range,
                step: this.step,
                axis: this.axis,
                style: this.plotStyle
            }),

            dashPlot: new Plot({
                func: this.function,
                range: [this.range.min - this.buff, this.range.max + this.buff],
                step: this.step,
                axis: this.axis,
                style: this.dashPlotStyle
            })
        }

        this.children = [
            this.elements.dashPlot,
            this.elements.plot
        ]
    }

    //MARK: Draw on SVG
    svg = {

        getPathD: () => {
    
            return {
                plot: this.elements.plot.svg.getPathD(),
                dashPlot: this.elements.dashPlot.svg.getPathD()
            }
        },
        
        getPolylineAttr: () => {
    
            return {
                plot: this.elements.plot.svg.getPolylineAttr(),
                dashPlot: this.elements.dashPlot.svg.getPolylineAttr()
            }
        },

        /**
         * @param {{plotStyle: {}, dashPlotStyle: {}, usePolyline: Boolean}} opt
         * @returns {SVGGElement}
         */
        getG: ({plotStyle = {}, dashPlotStyle = {}, usePolyline = true} = {}) => {
    
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
            Object.entries({
                'class': 'Acot-plot',
                'data-name': this.name,
            })
            .forEach(([key, value]) => {
    
                if(value) g.setAttribute(key, value);
            });
    
            g.appendChild(usePolyline ? 
                this.elements.dashPlot.svg.getPolyline(dashPlotStyle) 
                : 
                this.elements.dashPlot.svg.getPath(dashPlotStyle)
            );
    
            g.appendChild(usePolyline ? 
                this.elements.plot.svg.getPolyline(plotStyle) 
                : 
                this.elements.plot.svg.getPath(plotStyle)
            );
            
            return g;
        }
    } 




    //MARK: Draw on Canvas
    /**
     * @param {CanvasRenderingContext2D} ctx Canvas context 2D
     * @param {{plotStyle: {}, dashPlotStyle: {}}} styles Override styles 
     */
    draw(ctx, {plotStyle, dashPlotStyle} = {}){

        this.elements.dashPlot.draw(ctx, dashPlotStyle);

        this.elements.plot.draw(ctx, plotStyle);
    }
}