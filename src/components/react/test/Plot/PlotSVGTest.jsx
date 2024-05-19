import { Axis } from "@utils/MathGraphs/2d/Axis";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@/css/test.css";
import {Plot} from "@utils/MathGraphs/2d/Plot/Plot";
import { useGUIControls } from "@react/hooks/useGUIControls";
import { debounce } from "@utils/debounce";

const WIDTH = 960;
const HEIGHT = 540;

const fx = ({a = 0.5, vx = 0, vy = -4} = {}) => {

    return (x) => a * Math.pow(x - vx, 2) + vy;
}

function PlotSVGTest() {

    const graphRef = useRef();
    const svgRef = useRef();

    const axis = useMemo(() => {

        return new Axis({});
    }, []);

    useEffect(() => {
        
        axis.svg.drawAxis(svgRef.current.querySelector('.axis'), {hideZero: true, color: '#bebebe'});

    }, [axis]);

    //MARK: Plot, Canvas and Stats
    const plot = useMemo(() => {

        return new Plot({
            axis,
            func: fx(),
            style: {
                color: '#0000ff',
                lineWidth: 4
            }
        });
    }, [axis]);


    //MARK: State
    const [usePolyline, setUsePolyline] = useState(false);

    //Path D attribute
    const [d, setD] = useState(plot.svg.getPathD());

    //Polyline attributes
    const [polylineAttr, setPolylineAttr] = useState(plot.svg.getPolylineAttr());

    const [style, setStyle] = useState(plot.svg.getStyles(null, {jsx: true}));


    //MARK: Controls
    const controls = useMemo(() => {

        const updateFunction = debounce((e) => {

            switch(e.folderName){

                case 'function':
                    const {a, vx, vy} = e.target;
                    plot.update({ func: fx({a, vx, vy}) });
                    break;

                case 'range':
                    const {min, max} = e.target;
                    plot.update({ range: [min, max] });
                    break;

                case 'step':
                    plot.update({ step: e.target.step });
                    break; 
            }

            setD(plot.svg.getPathD());
            setPolylineAttr(plot.svg.getPolylineAttr());
        }, 500);

        const updateStyles = debounce((e) => {

            plot.style[e.name] = e.value;
    
            setStyle(plot.svg.getStyles(null, {jsx: true}));
        }, 500);

        return ({
            'function': [
                {type: 'range', name: 'a', value: 0.5, onChange: updateFunction},
                {type: 'range', name: 'vx', value: 0, onChange: updateFunction},
                {type: 'range', name: 'vy', value: -4, onChange: updateFunction},
                {
                    type: 'boolean', name: 'usePolyline', value: usePolyline,
                    onChange: (e) => setUsePolyline(e.value),
                }
            ],
            'range': [
                {type: 'range', name: 'min', min: -10, max: 0, value: plot.range.min, onChange: updateFunction },
                {type: 'range', name: 'max', min: 0, max: 10, value: plot.range.max, onChange: updateFunction }
            ],
            'step': [
                {type: 'range', name: 'step', min: 0.1, max: 1, value: plot.step, onChange: updateFunction },
            ],
            'style': [
                {
                    type: 'color', name: 'color', value: plot.style.color,
                    onChange: updateStyles
                },
                {
                    type: 'range', name: 'lineWidth', min: 1, max: 5, value: plot.style.lineWidth, 
                    onChange: updateStyles
                },
                {
                    type: 'range', name: 'opacity', min: 0, max: 1, value: plot.style.opacity, 
                    onChange: updateStyles
                },
                {
                    type: 'array', name: 'lineDash', value: plot.style.lineDash, 
                    onChange: updateStyles
                }
            ],
        })
    }, []);

    const GUI = useGUIControls({
        folders: controls,
        containerRef: graphRef,
    });


    //MARK: JSX
    return (<section className="PlotCanvasTest-canvas-test test">

        <div className="Graph-container" ref={graphRef}>

            <svg width={WIDTH} height={HEIGHT} ref={svgRef}>
                
                <g className="axis"></g>

                {
                    usePolyline ? 
                        <polyline {...polylineAttr} {...style} />
                    :
                        <path d={d} {...style} />
                }

            </svg> 

        </div>

    </section>);
}

export default PlotSVGTest;