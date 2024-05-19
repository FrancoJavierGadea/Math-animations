import { useGUIControls } from "@components/react/hooks/useGUIControls";
import { Axis } from "@utils/MathGraphs/2d/Axis";
import "@/css/test.css";
import { PointWithProyections } from "@utils/MathGraphs/2d/Point/PointWithProyections";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStats } from "@components/react/hooks/useStats";


const WIDTH = 960;
const HEIGHT = 540;

const initialPoint = {x: 2, y: 2}

function PointWithProyectionsCanvasTest() {

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

        return new PointWithProyections({
            point: axis.c2p(initialPoint.x, initialPoint.y),
            radius: 5,
            origin: axis.origin,
            lineStyle: {
                color: '#0000ff',
                lineWidth: 4
            },
            pointStyle: {
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

        const updateOrigin = (e) => {
            const {x, y} = e.target;

            point.update({origin: [axis.x(x), axis.y(y)]});
        }

        const updateStyles = (e) => {

            point[e.folderName][e.name] = e.value;
        }

        return ({
            'point': [
                {
                    type: 'range', name: 'x', value: initialPoint.x,
                    onChange: updatePoint
                },
                {
                    type: 'range', name: 'y', value: initialPoint.y,
                    onChange: updatePoint
                },
                {
                    type: 'range', name: 'radius', min: 0, max: 100, step: 1, value: point.radius,
                    onChange: (e) => {
                        point.update({radius: e.value});
                    }
                }
            ],
            'origin': [
                {
                    type: 'range', name: 'x', value: 0,
                    onChange: updateOrigin
                },
                {
                    type: 'range', name: 'y', value: 0,
                    onChange: updateOrigin
                },
            ],
            'lineStyle': [
                {
                    type: 'color', name: 'color', value: point.lineStyle.color,
                    onChange: updateStyles
                },
                {
                    type: 'range', name: 'lineWidth', min: 1, max: 5, value: point.lineStyle.lineWidth, 
                    onChange: updateStyles
                },
                {
                    type: 'array', name: 'lineDash', value: point.lineStyle.lineDash, 
                    onChange: updateStyles
                }
            ],
            'pointStyle': [
                {
                    type: 'color', name: 'color', value: point.pointStyle.color,
                    onChange: updateStyles
                },
                {
                    type: 'color', name: 'borderColor', value: point.pointStyle.borderColor,
                    onChange: updateStyles
                },
                {
                    type: 'range', name: 'lineWidth', min: 1, max: 5, value: point.pointStyle.lineWidth, 
                    onChange: updateStyles
                },
                {
                    type: 'range', name: 'fillOpacity', min: 0, max: 1, value: point.pointStyle.fillOpacity, 
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

export default PointWithProyectionsCanvasTest;

