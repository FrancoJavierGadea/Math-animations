import { useEffect, useRef } from "react";
import Stats from "stats.js";

export function useStats({containerRef, name = 'Stats'}){

    const statsRef = useRef();

    useEffect(() => {
        
        const stats = new Stats();

        stats.dom.classList.add('Stats');
        stats.dom.setAttribute('data-name', name);

        containerRef?.current.appendChild(stats.dom);

        statsRef.current = stats;

    }, [containerRef, name]);

    return statsRef;
}