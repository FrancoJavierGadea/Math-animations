
import { debounce } from "@utils/debounce";
import { Axis } from "@utils/MathGraphs/2d/Axis";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@/css/test.css";
import { useGUIControls } from "@react/hooks/useGUIControls";
import { Arrow } from "@utils/MathGraphs/2d/Arrow/Arrow";
import { DEGREES, RADIANS } from "@utils/MathGraphs/utils";

const WIDTH = 960;
const HEIGHT = 540;

const start = {x: 0, y: 0};
const end = {x: 3, y: 3};


function ArrowSVGTest() {
    const graphRef = useRef();
    const svgRef = useRef();

    const axis = useMemo(() => {

        return new Axis({});
    }, []);

    useEffect(() => {
        
        axis.svg.drawAxis(svgRef.current.querySelector('.axis'), {
            hideZero: true, 
            color: '#bebebe'
        });

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


    const [d, setD] = useState(arrow.svg.getPathD());
    const [style, setStyle] = useState(arrow.svg.getStyles(null, {jsx: true}));
    
    //MARK: Controls
    const controls = useMemo(() => {

        const updatePoint = debounce((e) => {

            arrow.update({
                [e.folderName]: axis.c2p(e.target.x, e.target.y)
            });
            setD(arrow.svg.getPathD());
        }, 500);

        const updateArrow = debounce((e) => {

            arrow.update({
                [e.name]: e.value
            });
            setD(arrow.svg.getPathD());
        }, 500);
        
        const updateStyles = debounce((e) => {

            arrow.style[e.name] = e.value;
            setStyle(arrow.svg.getStyles(null, {jsx: true}));
        }, 500);

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
                        setD(arrow.svg.getPathD());
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
        containerRef: graphRef,
    });


    //MARK: JSX
    return (<section className="Arrow-canvas-test test">

        <div className="Graph-container" ref={graphRef}>

            <svg width={WIDTH} height={HEIGHT} ref={svgRef}>
                
                <g className="axis"></g>

                <path d={d.line} {...style.line}/>
                {arrow.endArrow && <path d={d.endArrow} {...style.head}/>}
                {arrow.startArrow && <path d={d.startArrow} {...style.head}/>}

            </svg> 

        </div>

    </section>);
}

export default ArrowSVGTest;