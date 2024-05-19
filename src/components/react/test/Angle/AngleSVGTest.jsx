import { DEGREES, RADIANS } from "@utils/MathGraphs/utils";
import { Axis } from "@utils/MathGraphs/2d/Axis";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@/css/test.css";
import { useGUIControls } from "@react/hooks/useGUIControls";
import { debounce } from "@utils/debounce";
import { Angle } from "@utils/MathGraphs/2d/Angle/Angle";

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

    
    
    //MARK: Controls
    const controls = useMemo(() => {

        const updateAngle = debounce((e) => {
            angle[e.name] = e.value * DEGREES;

            setD(angle.svg.getPathD());
        }, 500);

        const updatePoint = debounce((e) => {
            const {x, y} = e.target;

            angle.point.x = axis.x(x);
            angle.point.y = axis.y(y);

            setD(angle.svg.getPathD());
        }, 500);

        const updateStyles = debounce((e) => {
            angle.style[e.name] = e.value;

            setStyle(angle.svg.getStyles(null, {jsx: true}));
        }, 500);

        return ({
            'angle': [
                {
                    type: 'range', name: 'angle', value: angle.angle * RADIANS, min: 0, max: 360, step: 1,
                    onChange: updateAngle
                },
                {
                    type: 'range', name: 'radius', value: angle.radius, min: 10, max: 200, step: 1,
                    onChange: debounce((e) => {
                        angle.radius = e.value;

                        setD(angle.svg.getPathD());
                    }, 500)
                },
                {
                    type: 'range', name: 'rotate', value: 0, min: 0, max: 360, step: 1,
                    onChange: updateAngle
                }
            ],
            'point': [
                {
                    type: 'range', name: 'x', value: 0,
                    onChange: updatePoint
                },
                {
                    type: 'range', name: 'y', value: 0,
                    onChange: updatePoint
                }
            ],
            'style': [
                {
                    type: 'color', name: 'color', value: angle.style.color,
                    onChange: updateStyles
                },
                {
                    type: 'range', name: 'lineWidth', min: 1, max: 5, value: angle.style.lineWidth, 
                    onChange: updateStyles
                },
                {
                    type: 'range', name: 'fillOpacity', min: 0, max: 1, value: angle.style.fillOpacity, 
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