import { style } from "d3";
import { Plot } from "./Plot";


export class AcotPlot {

    static defaultDashPlotStyle = {
        lineDash: [5],
        opacity: 0.5
    }


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
    getPath(){

        return {
            plot: this.elements.plot.getPathD(),
            dashPlot: this.elements.dashPlot.getPathD()
        }
    }

    getAttr(){

        return {
            plot: this.elements.plot.getPolylineAttr(),
            dashPlot: this.elements.dashPlot.getPolylineAttr()
        }
    }

    getG({plotStyle = {}, dashPlotStyle = {}, usePolyline = true} = {}){

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        Object.entries({
            'class': 'Acot-plot',
            'data-name': this.name,
        })
        .forEach(([key, value]) => {

            if(value) g.setAttribute(key, value);
        });

        g.appendChild(usePolyline ? this.elements.dashPlot.getPolyline(dashPlotStyle) : this.elements.dashPlot.getPath(dashPlotStyle));

        g.appendChild(usePolyline ? this.elements.plot.getPolyline(dashPlotStyle) : this.elements.plot.getPath(dashPlotStyle));
        
        return g;
    }


    //MARK: Draw on Canvas
    draw(ctx = new CanvasRenderingContext2D(), {plotStyle, dashPlotStyle} = {}){

        this.elements.dashPlot.draw(ctx, dashPlotStyle);

        this.elements.plot.draw(ctx, plotStyle);
    }
}