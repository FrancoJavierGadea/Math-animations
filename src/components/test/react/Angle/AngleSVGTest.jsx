import { DEGREES, RADIANS } from "@utils/MathGraphs/utils";
import { Axis } from "@utils/MathGraphs/Axis";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@/css/test.css";
import { useGUIControls } from "../hooks/useGUIControls";
import { debounce } from "@utils/debounce";
import { Angle } from "@utils/MathGraphs/Angle/Angle";

const WIDTH = 960;
const HEIGHT = 540;

const initialAngle = 45 * DEGREES;

function AngleSVGTest() {

    const graphRef = useRef();
    const svgRef = useRef();

    const axis = useMemo(() => {

        return new Axis({});
    }, []);

    useEffect(() => {
        
        axis.svg.drawAxis(svgRef.current.querySelector('.axis'), {hideZero: true, color: '#bebebe'});

    }, [axis]);

    //MARK: Angle
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


    //MARK: State

    //Path D attribute
    const [d, setD] = useState(angle.svg.getPathD());

    const [style, setStyle] = useState(angle.svg.getStyles(null, {jsx: true}));

    
    //MARK: hangleChange
    const debouncedHandleChage = useMemo(() => {

        return debounce((e) => {

            if(e.folderName === 'path-polyline') setUsePolyline(e.target.usePolyline);

            if(['angle'].includes(e.folderName)){

                switch(e.name){

                    case 'angle':

                        angle.angle = e.value * DEGREES;
                        break;

                    case 'radius':
                        
                        angle.radius = e.value;
                        break;
                }

                setD(angle.svg.getPathD());
            }
    
            if(e.folderName === 'style'){
    
                angle.style[e.name] = e.value;
    
                setStyle(angle.svg.getStyles(null, {jsx: true}));
            }
    
        }, 200);

    }, [angle, setStyle, setD]);


    //MARK: Controls
    const controls = useMemo(() => ({

        'angle': [
            {type: 'range', name: 'angle', value: angle.angle * RADIANS, min: 0, max: 360, step: 1},
            {type: 'range', name: 'radius', value: angle.radius, min: 10, max: 200, step: 1}
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
        onChange: debouncedHandleChage 
    });


    //MARK: JSX
    return (<section className="PlotCanvasTest-canvas-test test">

        <div className="Graph-container" ref={graphRef}>

            <svg width={WIDTH} height={HEIGHT} ref={svgRef}>
                
                <g className="axis"></g>

                <path d={d} {...style} />
                
            </svg> 

        </div>

    </section>);
}

export default AngleSVGTest;