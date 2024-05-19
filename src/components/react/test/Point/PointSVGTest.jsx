import { useGUIControls } from "@components/react/hooks/useGUIControls";
import { Axis } from "@utils/MathGraphs/2d/Axis";
import "@/css/test.css";
import { debounce } from "@utils/debounce";
import { useEffect, useMemo, useRef, useState } from "react";
import { Point } from "@utils/MathGraphs/2d/Point/Point";


const WIDTH = 960;
const HEIGHT = 540;

const initialPoint = {x: 2, y: 2}

function PointSVGTest() {

    const graphRef = useRef();
    const svgRef = useRef();

    const axis = useMemo(() => {

        return new Axis({});
    }, []);

    useEffect(() => {
        
        axis.svg.drawAxis(svgRef.current.querySelector('.axis'), {hideZero: true, color: '#bebebe'});

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
    
    
    //MARK: State
    const [d, setD] = useState(point.svg.getPathD());
    const [attributes, setAttributes] = useState(point.svg.getCircleAttr());
    const [style, setStyle] = useState(point.svg.getStyles(null, {jsx: true}));
    const [useCircle, setUseCircle] = useState(false);

        //MARK: Controls
    const controls = useMemo(() => {

        const updatePoint = debounce((e) => {
            const {x, y} = e.target;

            point.point.x = axis.x(x);
            point.point.y = axis.y(y);

            setD(point.svg.getPathD());
            setAttributes(point.svg.getCircleAttr());
        }, 500);

        const updateStyles = debounce((e) => {

            point.style[e.name] = e.value;

            setStyle(point.svg.getStyles(null, {jsx: true}));
        }, 500);

        return ({
            'point': [
                {
                    type: 'boolean', name: 'useCircle', value: false,
                    onChange: (e) => setUseCircle(e.value),
                },
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
                    onChange: debounce((e) => {
                        point.radius = e.value;

                        setD(point.svg.getPathD());
                        setAttributes(point.svg.getCircleAttr());
                    }, 500)
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
    return (<section className="PlotCanvasTest-canvas-test test">

        <div className="Graph-container" ref={graphRef}>

            <svg width={WIDTH} height={HEIGHT} ref={svgRef}>
                
                <g className="axis"></g>

                {
                    useCircle ?
                    
                        <circle {...attributes} {...style}/>
                    : 
                        <path d={d} {...style}/>
                    
                }
                
            </svg> 

        </div>

    </section>);
}

export default PointSVGTest;