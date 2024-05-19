import { useGUIControls } from "@components/react/hooks/useGUIControls";
import { Axis } from "@utils/MathGraphs/2d/Axis";
import "@/css/test.css";
import { PointWithProyections } from "@utils/MathGraphs/2d/Point/PointWithProyections";
import { debounce } from "@utils/debounce";
import { useEffect, useMemo, useRef, useState } from "react";


const WIDTH = 960;
const HEIGHT = 540;

const initialPoint = {x: 2, y: 2}

function PointWithProyectionsSVGTest() {

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


    //MARK: State
    const [d, setD] = useState(point.svg.getPathD());
    const [attributes, setAttributes] = useState(point.svg.getAttr());
    const [style, setStyle] = useState(point.svg.getStyles(null, {jsx: true}));

    const [useLine, setUseLine] = useState(false);
    const [useCircle, setUseCircle] = useState(false);

    
    //MARK: Controls
    const controls = useMemo(() => {

        const updatePoint = debounce((e) => {
            const {x, y} = e.target;

            point.update({point: [axis.x(x), axis.y(y)]});

            setD(point.svg.getPathD());
            setAttributes(point.svg.getAttr());
        }, 500);

        const updateOrigin = debounce((e) => {
            const {x, y} = e.target;

            point.update({origin: [axis.x(x), axis.y(y)]});

            setD(point.svg.getPathD());
            setAttributes(point.svg.getAttr());
        }, 500);

        const updateStyles = debounce((e) => {

            point[e.folderName][e.name] = e.value;

            setStyle(point.svg.getStyles(null, {jsx: true}));
        }, 500);

        return ({
            'point': [
                {
                    type: 'boolean', name: 'useLine', value: false,
                    onChange: (e) => setUseLine(e.value),
                },
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
                        point.update({radius: e.value});

                        setD(point.svg.getPathD());
                        setAttributes(point.svg.getAttr());
                    }, 500)
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
    return (<section className="PlotCanvasTest-canvas-test test">

        <div className="Graph-container" ref={graphRef}>

            <svg width={WIDTH} height={HEIGHT} ref={svgRef}>
                
                <g className="axis"></g>

                {
                    useLine ? <>
                        <line {...attributes.lineX} {...style.lineX}/>
                        <line {...attributes.lineY} {...style.lineY}/>
                    </>
                    : <>
                        <path d={d.lineX} {...style.lineX}/>
                        <path d={d.lineY} {...style.lineY}/>
                    </>
                }
                {
                    useCircle ? <>
                    
                        <circle {...attributes.point} {...style.point}/>
                        <circle {...attributes.pointX} {...style.pointX}/>
                        <circle {...attributes.pointY} {...style.pointY}/>
                    </>
                    : <>
                        <path d={d.point} {...style.point}/>
                        <path d={d.pointX} {...style.pointX}/>
                        <path d={d.pointY} {...style.pointY}/>
                    </>
                }
                
            </svg> 

        </div>

    </section>);
}

export default PointWithProyectionsSVGTest;