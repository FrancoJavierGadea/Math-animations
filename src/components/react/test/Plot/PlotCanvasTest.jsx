import { Axis } from "@utils/MathGraphs/2d/Axis";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@/css/test.css";
import {Plot} from "@utils/MathGraphs/2d/Plot/Plot";
import { useGUIControls } from "@react/hooks/useGUIControls";
import { useStats } from "@react/hooks/useStats";

const WIDTH = 960;
const HEIGHT = 540;

const fx = ({a = 0.5, vx = 0, vy = -4} = {}) => {

    return (x) => a * Math.pow(x - vx, 2) + vy;
}

function PlotCanvasTest() {

    const graphRef = useRef();
    const canvasRef = useRef();
    const svgRef = useRef();

    const axis = useMemo(() => {

        return new Axis({});
    }, []);

    useEffect(() => {
        
        axis.svg.drawAxis(svgRef.current, {hideZero: true, color: '#bebebe'});

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

    const statsRef = useStats({containerRef: graphRef})

    useEffect(() => {
        
        const canvas = canvasRef.current;
        const CTX = canvas.getContext('2d');
        const stats = statsRef.current;

        let ID = null;

        const draw = () => {

            stats.begin();

            CTX.clearRect(0, 0, canvas.width, canvas.height);

            plot.draw(CTX);

            stats.end();
            ID = requestAnimationFrame(draw);
        }

        draw();

        return () => {

            if(ID) cancelAnimationFrame(ID);
        }

    }, [plot]);

    
    //MARK: Controls
    const controls = useMemo(() => {

        const updateFunction = (e) => {

            const {a, vx, vy} = e.target;
            plot.update({ func: fx({a, vx, vy}) });
        }

        const updateStyle = (e) => {

            plot.style[e.name] = e.value;
        }
        
        return ({
            'function': [
                {type: 'range', name: 'a', value: 0.5, onChange: updateFunction },
                {type: 'range', name: 'vx', value: 0, onChange: updateFunction },
                {type: 'range', name: 'vy', value: -4, onChange: updateFunction }
            ],
            'range': [
                {
                    type: 'range', name: 'min', min: -10, max: 0, value: plot.range.min,
                    onChange: (e) => plot.update({range: [e.target.min, e.target.max]}), 
                },
                {
                    type: 'range', name: 'max', min: 0, max: 10, value: plot.range.max,
                    onChange: (e) => plot.update({range: [e.target.min, e.target.max]}), 
                }
            ],
            'step': [
                {
                    type: 'range', name: 'step', min: 0.1, max: 1, value: plot.step,
                    onChange: (e) => plot.update({step: e.value}), 
                },
            ],
            'style': [
                {
                    type: 'color', name: 'color', value: plot.style.color,
                    onChange: updateStyle
                },
                {
                    type: 'range', name: 'lineWidth', min: 1, max: 5, value: plot.style.lineWidth,
                    onChange: updateStyle
                },
                {
                    type: 'range', name: 'opacity', min: 0, max: 1, value: plot.style.opacity,
                    onChange: updateStyle
                },
                {
                    type: 'array', name: 'lineDash', value: plot.style.lineDash,
                    onChange: updateStyle
                }
            ]
        });
    }, []);

    const GUI = useGUIControls({
        folders: controls,
        containerRef: graphRef,
    });


    //MARK: JSX
    return (<section className="PlotCanvasTest-canvas-test test">

        <div className="Graph-container" ref={graphRef}>

            <svg width={WIDTH} height={HEIGHT} ref={svgRef}/> 

            <canvas width={WIDTH} height={HEIGHT} ref={canvasRef}/>
        </div>

    </section>);
}

export default PlotCanvasTest;