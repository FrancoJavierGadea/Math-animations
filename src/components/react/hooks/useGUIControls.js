import { GUI } from "dat.gui";
import { useEffect, useRef } from "react";

export function useGUIControls({folders = {}, containerRef, onChange, name = 'GUI'}){

    const dataRef = useRef({});
    const guiRef = useRef();

    useEffect(() => {

        const gui = new GUI({autoPlace: false});
        
        Object.entries(folders).forEach(([folderName, props]) => {

            dataRef.current[folderName] = {};

            const folder = gui.addFolder(folderName);
            const target = dataRef.current[folderName];

            props.forEach(({name, min = -5, max = 5, step = 0.1, value, type, onChange:handleChange}) => {

                switch (type) {

                    case 'range':
                        target[name] = value;

                        folder.add(target, name, min, max, step)
                        .onChange((value) => {

                            if(handleChange) handleChange({value, folderName, name, target,});
                            if(onChange) onChange({value, folderName, name, target,});
                        });
                        break;

                    case 'color':
                        target[name] = value;

                        folder.addColor(target, name)
                        .onChange((value) => {

                            if(handleChange) handleChange({value, folderName, name, target,});
                            if(onChange) onChange({value, folderName, name, target,});
                        });
                        break;

                    case 'array':
                        target[name] = value.join(' ');

                        folder.add(target, name)
                        .onChange((value) => {
                            const aux =  value.split(' ').map(v => Number(v));
                            
                            if(handleChange) handleChange({value: aux, folderName, name, target,});
                            if(onChange) onChange({value: aux, folderName, name, target,});
                        }); 
                        break;

                    case 'boolean':
                        target[name] = value;

                        folder.add(target, name)
                        .onChange((value) => {

                            if(handleChange) handleChange({value, folderName, name, target,});
                            if(onChange) onChange({value, folderName, name, target,});
                        });
                        break;
                }   
            });
        });

        gui.domElement.classList.add('GUI');
        gui.domElement.setAttribute('data-name', name);

        //Add element to DOM
        containerRef?.current?.appendChild(gui.domElement);

        guiRef.current = gui;

        return () => {

            gui.destroy();
        }

    }, [folders, name, onChange, containerRef]);

    return {guiRef, dataRef};
}