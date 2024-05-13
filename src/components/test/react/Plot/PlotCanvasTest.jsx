import { Axis } from "@utils/MathGraphs/Axis";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@/css/test.css";
import {Plot} from "@utils/MathGraphs/Plot/Plot";
import { useGUIControls } from "../hooks/useGUIControls";
import { useStats } from "../hooks/useStats";

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
        
        axis.drawAxis(svgRef.current, {hideZero: true, color: '#bebebe'});

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

    
    //MARK: hangleChange
    const handleChange = useCallback((e) => {

        if(['function', 'range', 'step'].includes(e.folderName)){

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
        }

        if(e.folderName === 'style'){

            plot.style[e.name] = e.value;
        }

    }, [plot]);

    
    //MARK: Controls
    const controls = useMemo(() => ({
        'function': [
            {type: 'range', name: 'a', value: 0.5},
            {type: 'range', name: 'vx', value: 0},
            {type: 'range', name: 'vy', value: -4}
        ],
        'range': [
            {type: 'range', name: 'min', value: plot.range.min, min: -10, max: 0},
            {type: 'range', name: 'max', value: plot.range.max, min: 0, max: 10}
        ],
        'step': [
            {type: 'range', name: 'step', value: plot.step, min: 0.1, max: 1},
        ],
        'style': [
            {type: 'color', name: 'color', value: plot.style.color},
            {type: 'range', name: 'lineWidth', value: plot.style.lineWidth, min: 1, max: 5},
            {type: 'range', name: 'opacity', value: plot.style.opacity, min: 0, max: 1},
            {type: 'array', name: 'lineDash', value: plot.style.lineDash }
        ]
    }), []);

    const GUI = useGUIControls({
        folders: controls,
        containerRef: graphRef,
        onChange: handleChange
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