
import * as D3Scale from "d3-scale";
import * as D3Axis from "d3-axis";
import * as D3Select from "d3-selection";

export class Axis {

    constructor(params = {}){

        const {
            lengthX = 500,
            lengthY = 500,
            rangeX = [-5, 5],
            rangeY = [-5, 5],
            center = [500, 262]
        } = params;

        this.center = {
            x: center['x'] ?? center[0],
            y: center['y'] ?? center[1]
        }
        this.length = {
            x: lengthX,
            y: lengthY
        }
        this.rangeX = {
            min: rangeX['min'] ?? rangeX[0],
            max: rangeX['max'] ?? rangeX[1]
        }
        this.rangeY = {
            min: rangeY['min'] ?? rangeY[0],
            max: rangeY['max'] ?? rangeY[1]
        }

        this.scaleX = this.#createScale({range: this.rangeX, length: this.length.x, center: this.center.x});
        this.scaleY = this.#createScale({range: {min: this.rangeY.max, max: this.rangeY.min}, length: this.length.y, center: this.center.y});

        this.origin = {
            x: this.scaleX(0),
            y: this.scaleY(0)
        }

    }

    #createScale({range, length, center}){

        const {min, max} = range;

        const unit = length / (Math.abs(min) + Math.abs(max));

        const from = center - Math.abs(min) * unit;
        const to = center + Math.abs(max) * unit;

        return D3Scale.scaleLinear([min, max], [from, to]);
    }

    x(x){

        return x === 0 ? this.origin.x : this.scaleX(x);
    }
    y(y){

        return y === 0 ? this.origin.y : this.scaleY(y);
    }
    coordsToPoint(x, y){

        const point = [this.x(x), this.y(y)];

        point.x = point.at(0);
        point.y = point.at(1);

        return point;
    }


    //----------------------------- Draw Axis on SVG -------------------
    drawAxisX(svg, opt = {}){

        const {hideZero, color = '#000000'} = opt;

        const selection = (svg instanceof D3Select.selection) ? svg : D3Select.select(svg);

        const [min, max] = this.scaleX.domain();

        const axis = D3Axis.axisBottom(this.scaleX)
            .ticks(Math.abs(min) + Math.abs(max))
            .tickFormat((d, i) => {

                return d === 0 && hideZero ? '' : d;
            });

        selection.append('g')
            .attr('class', 'Axis-x')
            .attr('color', color)
            .attr('transform', `translate(${0}, ${this.center.y})`)
            .call(axis);
    }

    drawAxisY(svg, opt = {}){

        const {hideZero, color = '#000000'} = opt;

        const selection = (svg instanceof D3Select.selection) ? svg : D3Select.select(svg);

        const [min, max] = this.scaleY.domain();

        const axis = D3Axis.axisLeft(this.scaleY)
            .ticks(Math.abs(min) + Math.abs(max))
            .tickFormat((d, i) => {

                return d === 0 && hideZero ? '' : d;
            });

        selection.append('g')
            .attr('class', 'Axis-y')
            .attr('color', color)
            .attr('transform', `translate(${this.center.x}, ${0})`)
            .call(axis);
    }

    drawAxis(svg, opt){

        const selection = (svg instanceof D3Select.selection) ? svg : D3Select.select(svg);

        this.drawAxisX(selection, opt);
        this.drawAxisY(selection, opt);
    }
}