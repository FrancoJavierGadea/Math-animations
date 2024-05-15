import { Axis } from "@utils/MathGraphs/Axis";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@/css/test.css";
import { useGUIControls } from "../hooks/useGUIControls";
import { useStats } from "../hooks/useStats";
import { DEGREES, RADIANS } from "@utils/MathGraphs/utils";
import { Angle } from "@utils/MathGraphs/Angle/Angle";

const WIDTH = 960;
const HEIGHT = 540;

const initialAngle = 45 * DEGREES;

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

    //MARK: Angle, Canvas and Stats
    const angle = useMemo(() => {

        return new Angle({
            point: axis.origin,
            angle: initialAngle,
            radius: 70,
            style: {
                color: '#0000ff',
                lineWidth: 4
            }
        });
    }, [axis, initialAngle]);

    const statsRef = useStats({containerRef: graphRef})

    useEffect(() => {
        
        const canvas = canvasRef.current;
        const CTX = canvas.getContext('2d');
        const stats = statsRef.current;

        let ID = null;

        const draw = () => {

            stats.begin();

            CTX.clearRect(0, 0, canvas.width, canvas.height);

            angle.draw(CTX);

            stats.end();
            ID = requestAnimationFrame(draw);
        }

        draw();

        return () => {

            if(ID) cancelAnimationFrame(ID);
        }

    }, [angle]);

    
    //MARK: hangleChange
    const handleChange = useCallback((e) => {

        if(['angle'].includes(e.folderName)){

            switch(e.name){

                case 'angle':
                    angle.angle = e.value * DEGREES;
                    break;

                case 'radius':
                    angle.radius = e.value;
                    break;

                case 'rotate':
                    angle.rotate = e.value * DEGREES;
                    break;
            }
        }
        
        if(e.folderName === 'point'){
            const {x, y} = e.target;

            angle.point.x = axis.x(x);
            angle.point.y = axis.y(y);
        }

        if(e.folderName === 'style'){

            angle.style[e.name] = e.value;
        }

    }, [angle]);

    
    //MARK: Controls
    const controls = useMemo(() => ({
        'angle': [
            {type: 'range', name: 'angle', value: angle.angle * RADIANS, min: 0, max: 360, step: 1},
            {type: 'range', name: 'radius', value: angle.radius, min: 10, max: 200, step: 1},
            {type: 'range', name: 'rotate', value: 0, min: 0, max: 360, step: 1}
        ],
        'point': [
            {type: 'range', name: 'x', value: 0,},
            {type: 'range', name: 'y', value: 0,}
        ],
        'style': [
            {type: 'color', name: 'color', value: angle.style.color},
            {type: 'range', name: 'lineWidth', value: angle.style.lineWidth, min: 1, max: 5},
            {type: 'range', name: 'fillOpacity', value: angle.style.fillOpacity, min: 0, max: 1},
        ],
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