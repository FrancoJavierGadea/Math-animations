

import { Axis } from "@utils/MathGraphs/2d/Axis";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@/css/test.css";
import { useGUIControls } from "@react/hooks/useGUIControls";
import { useStats } from "@react/hooks/useStats";
import { Arrow } from "@utils/MathGraphs/2d/Arrow/Arrow";
import { DEGREES, RADIANS } from "@utils/MathGraphs/utils";

const WIDTH = 960;
const HEIGHT = 540;

const start = {x: 0, y: 0};
const end = {x: 3, y: 3};

function ArrowCanvasTest() {

    const graphRef = useRef();
    const canvasRef = useRef();
    const svgRef = useRef();

    const axis = useMemo(() => {

        return new Axis({});
    }, []);

    useEffect(() => {
        
        axis.svg.drawAxis(svgRef.current, {hideZero: true, color: '#bebebe'});

    }, [axis]);

    //MARK: Arrow, Canvas and Stats
    const arrow = useMemo(() => {

        return new Arrow({
            start: axis.coordsToPoint(start.x, start.y),
            end: axis.coordsToPoint(end.x, end.y),
            axis,
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

            arrow.draw(CTX);

            stats.end();
            ID = requestAnimationFrame(draw);
        }

        draw();

        return () => {

            if(ID) cancelAnimationFrame(ID);
        }

    }, [arrow]);


    //MARK: Controls
    const controls = useMemo(() => {

        const updatePoint = (e) => {

            arrow.update({
                [e.folderName]: axis.c2p(e.target.x, e.target.y)
            });
        };

        const updateArrow = (e) => {

            arrow.update({
                [e.name]: e.value
            });
        };
        
        const updateStyles = (e) => {

            arrow.style[e.name] = e.value;
        };

        return ({
            'start': [
                {type: 'range', name: 'x', value: start.x, onChange: updatePoint},
                {type: 'range', name: 'y', value: start.y, onChange: updatePoint},
            ],
            'end': [
                {type: 'range', name: 'x', value: end.x, onChange: updatePoint},
                {type: 'range', name: 'y', value: end.y, onChange: updatePoint},
            ],
            'arrow': [
                {
                    type: 'boolean', name: 'startArrow', value: arrow.startArrow,
                    onChange: updateArrow
                },
                {
                    type: 'boolean', name: 'endArrow', value: arrow.endArrow,
                    onChange: updateArrow
                },
                {
                    type: 'range', name: 'size', min: 0, max: 100, step: 1, value: arrow.size,
                    onChange: updateArrow 
                },
                {
                    type: 'range', name: 'delta', min: 0, max: 60, step: 1, value: arrow.delta * RADIANS,
                    onChange: (e) => {
                        arrow.update({delta: e.value * DEGREES});
                    } 
                },
            ],
            'style': [
                {
                    type: 'color', name: 'color', value: arrow.style.color, 
                    onChange: updateStyles
                },
                {
                    type: 'range', name: 'lineWidth', min: 1, max: 5, value: arrow.style.lineWidth, 
                    onChange: updateStyles
                },
                {
                    type: 'array', name: 'lineDash', value: arrow.style.lineDash, 
                    onChange: updateStyles
                }
            ]
        });
    }, [start, end, arrow]);

    const GUI = useGUIControls({
        folders: controls,
        containerRef: graphRef
    });


    //MARK: JSX
    return (<section className="Arrow-canvas-test test">

        <div className="Graph-container" ref={graphRef}>

            <svg width={WIDTH} height={HEIGHT} ref={svgRef}/> 

            <canvas width={WIDTH} height={HEIGHT} ref={canvasRef}/>
        </div>

    </section>);
}

export default ArrowCanvasTest;