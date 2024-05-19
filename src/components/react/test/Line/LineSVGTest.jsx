
import { Axis } from "@utils/MathGraphs/2d/Axis";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "@/css/test.css";
import { useGUIControls } from "@react/hooks/useGUIControls";
import Line from "@utils/MathGraphs/2d/Line";
import { debounce } from "@utils/debounce";

const WIDTH = 960;
const HEIGHT = 540;

const start = {x: 0, y: 0};
const end = {x: 3, y: 3};

function LineSVGTest() {

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


    const [useLine, setUseLine] = useState(false);
    const [d, setD] = useState(line.svg.getPathD());
    const [style, setStyle] = useState(line.svg.getStyles(null, {jsx: true}));
    const [lineAttr, setLineAttr] = useState(line.svg.getLineAttr());
    
    //MARK: Controls
    const controls = useMemo(() => {

        const updateStyle = debounce((e) => {

            line.style[e.name] = e.value;
            setStyle(line.svg.getStyles(null, {jsx: true}));
        }, 500);

        const updatePoint = debounce((e) => {

            line[e.folderName] = axis.c2p(e.target.x, e.target.y);
            setD(line.svg.getPathD());
            setLineAttr(line.svg.getLineAttr());
        }, 500);
        
        return ({
            'useLine': [
                {
                    type: 'boolean', name: 'useLine', value: false,
                    onChange: (e) => setUseLine(e.value),
                }
            ],
            'start': [
                {
                    type: 'range', name: 'x', value: start.x,
                    onChange: (e) => updatePoint(e),
                },
                {
                    type: 'range', name: 'y', value: start.y,
                    onChange: (e) => updatePoint(e),
                },
            ],
            'end': [
                {
                    type: 'range', name: 'x', value: end.x,
                    onChange: (e) => updatePoint(e)
                },
                {
                    type: 'range', name: 'y', value: end.y,
                    onChange: (e) => updatePoint(e)
                },
            ],
            'style': [
                {
                    type: 'color', name: 'color', value: line.style.color,
                    onChange: updateStyle
                },
                {
                    type: 'range', name: 'lineWidth', min: 1, max: 5, value: line.style.lineWidth,
                    onChange: updateStyle
                },
                {
                    type: 'array', name: 'lineDash', value: line.style.lineDash,
                    onChange: updateStyle 
                }
            ]
        });
    }, [start, end, line]);

    const GUI = useGUIControls({
        folders: controls,
        containerRef: graphRef,
    });


    //MARK: JSX
    return (<section className="Arrow-canvas-test test">

        <div className="Graph-container" ref={graphRef}>

            <svg width={WIDTH} height={HEIGHT} ref={svgRef}>
                
                <g className="axis"></g>

                { useLine ?
                    <line {...lineAttr} {...style}/>
                  :
                    <path d={d} {...style}/>
                }

            </svg> 

        </div>

    </section>);
}

export default LineSVGTest;