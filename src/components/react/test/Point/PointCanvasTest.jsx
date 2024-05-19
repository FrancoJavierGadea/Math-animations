import { useGUIControls } from "@components/react/hooks/useGUIControls";
import { Axis } from "@utils/MathGraphs/2d/Axis";
import "@/css/test.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStats } from "@components/react/hooks/useStats";
import { Point } from "@utils/MathGraphs/2d/Point/Point";


const WIDTH = 960;
const HEIGHT = 540;

const initialPoint = {x: 2, y: 2}

function PointCanvasTest() {

    const graphRef = useRef();
    const canvasRef = useRef();
    const svgRef = useRef();

    const axis = useMemo(() => {

        return new Axis({});
    }, []);

    useEffect(() => {
        
        axis.svg.drawAxis(svgRef.current, {hideZero: true, color: '#bebebe'});

    }, [axis]);

    //MARK: Point
    const point = useMemo(() => {

        return new Point({
            point: axis.c2p(initialPoint.x, initialPoint.y),
            radius: 5,
            style: {
                color: '#ffff00',
            }
        });
    }, [axis, initialPoint]);

    const statsRef = useStats({containerRef: graphRef})

    useEffect(() => {
        
        const canvas = canvasRef.current;
        const CTX = canvas.getContext('2d');
        const stats = statsRef.current;

        let ID = null;

        const draw = () => {

            stats.begin();

            CTX.clearRect(0, 0, canvas.width, canvas.height);

            point.draw(CTX);

            stats.end();
            ID = requestAnimationFrame(draw);
        }

        draw();

        return () => {

            if(ID) cancelAnimationFrame(ID);
        }

    }, [point]);

    //MARK: Controls
    const controls = useMemo(() => {

        const updatePoint = (e) => {
            const {x, y} = e.target;

            point.update({point: [axis.x(x), axis.y(y)]});
            
        }

        const updateStyles = (e) => {

            point.style[e.name] = e.value;
        }

        return ({
            'point': [
                {
                    type: 'range', name: 'x', value: initialPoint.x,
                    onChange: (e) => {
                        point.point.x = axis.x(e.value);
                    }
                },
                {
                    type: 'range', name: 'y', value: initialPoint.y,
                    onChange: (e) => {
                        point.point.y = axis.y(e.value);
                    }
                },
                {
                    type: 'range', name: 'radius', min: 0, max: 100, step: 1, value: point.radius,
                    onChange: (e) => {
                        point.radius = e.value;
                    }
                }
            ],
            'pointStyle': [
                {
                    type: 'color', name: 'color', value: point.style.color,
                    onChange: updateStyles
                },
                {
                    type: 'color', name: 'borderColor', value: point.style.borderColor,
                    onChange: updateStyles
                },
                {
                    type: 'range', name: 'lineWidth', min: 1, max: 5, value: point.style.lineWidth, 
                    onChange: updateStyles
                },
                {
                    type: 'range', name: 'fillOpacity', min: 0, max: 1, value: point.style.fillOpacity, 
                    onChange: updateStyles
                },
            ],
        });
    }, []);

    const GUI = useGUIControls({
        folders: controls,
        containerRef: graphRef,
    });

    //MARK: JSX
    return (<section className="pointCanvasTest-canvas-test test">

        <div className="Graph-container" ref={graphRef}>

            <svg width={WIDTH} height={HEIGHT} ref={svgRef}/> 

            <canvas width={WIDTH} height={HEIGHT} ref={canvasRef}/>
        </div>

    </section>);
}

export default PointCanvasTest;