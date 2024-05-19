

import { Axis } from "@utils/MathGraphs/2d/Axis";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@/css/test.css";
import { useGUIControls } from "@react/hooks/useGUIControls";
import { useStats } from "@react/hooks/useStats";
import Line from "@utils/MathGraphs/2d/Line";

const WIDTH = 960;
const HEIGHT = 540;

const start = {x: 0, y: 0};
const end = {x: 3, y: 3};

function LineCanvasTest() {

    const graphRef = useRef();
    const canvasRef = useRef();
    const svgRef = useRef();

    const axis = useMemo(() => {

        return new Axis({});
    }, []);

    useEffect(() => {
        
        axis.svg.drawAxis(svgRef.current, {hideZero: true, color: '#bebebe'});

    }, [axis]);

    //MARK: Line, Canvas and Stats
    const line = useMemo(() => {

        return Line.from2Points({
            start: axis.coordsToPoint(start.x, start.y),
            end: axis.coordsToPoint(end.x, end.y),
            style: {
                color: '#0000ff',
                lineWidth: 4
            }
        });
    }, [axis, start, end]);

    const statsRef = useStats({containerRef: graphRef})

    useEffect(() => {
        
        const canvas = canvasRef.current;
        const CTX = canvas.getContext('2d');
        const stats = statsRef.current;

        let ID = null;

        const draw = () => {

            stats.begin();

            CTX.clearRect(0, 0, canvas.width, canvas.height);

            line.draw(CTX);

            stats.end();
            ID = requestAnimationFrame(draw);
        }

        draw();

        return () => {

            if(ID) cancelAnimationFrame(ID);
        }

    }, [line]);

    
    //MARK: Controls
    const controls = useMemo(() => ({
        'start': [
            {
                type: 'range', name: 'x', value: start.x,
                onChange: (e) => line.start = axis.c2p(e.target.x, e.target.y),
            },
            {
                type: 'range', name: 'y', value: start.y,
                onChange: (e) => line.start = axis.c2p(e.target.x, e.target.y),
            },
        ],
        'end': [
            {
                type: 'range', name: 'x', value: end.x,
                onChange: (e) => line.end = axis.c2p(e.target.x, e.target.y),
            },
            {
                type: 'range', name: 'y', value: end.y,
                onChange: (e) => line.end = axis.c2p(e.target.x, e.target.y),
            },
        ],
        'style': [
            {
                type: 'color', name: 'color', value: line.style.color,
                onChange: (e) => line.style[e.name] = e.value, 
            },
            {
                type: 'range', name: 'lineWidth', min: 1, max: 5, value: line.style.lineWidth,
                onChange: (e) => line.style[e.name] = e.value,    
            },
            {
                type: 'array', name: 'lineDash', value: line.style.lineDash,
                onChange: (e) => line.style[e.name] = e.value, 
            }
        ]
    }), [start, end, line]);

    const GUI = useGUIControls({
        folders: controls,
        containerRef: graphRef,
    });


    //MARK: JSX
    return (<section className="Arrow-canvas-test test">

        <div className="Graph-container" ref={graphRef}>

            <svg width={WIDTH} height={HEIGHT} ref={svgRef}/> 

            <canvas width={WIDTH} height={HEIGHT} ref={canvasRef}/>
        </div>

    </section>);
}

export default LineCanvasTest;