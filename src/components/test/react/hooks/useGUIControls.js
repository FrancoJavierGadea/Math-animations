import { GUI } from "dat.gui";
import { useEffect, useRef } from "react";

export function useGUIControls({folders = {}, containerRef, onChange = () => {}, name = 'GUI'}){

    const dataRef = useRef({});
    const guiRef = useRef();

    useEffect(() => {

        const gui = new GUI({autoPlace: false});
        
        Object.entries(folders).forEach(([folderName, props]) => {

            dataRef.current[folderName] = {};

            const folder = gui.addFolder(folderName);

            props.forEach(({name, min = -5, max = 5, step = 0.1, value, type}) => {

                switch (type) {

                    case 'range':
                        dataRef.current[folderName][name] = value;

                        folder.add(dataRef.current[folderName], name, min, max, step)
                        .onChange((value) => {

                            onChange({value, folderName, name, target: dataRef.current[folderName]});
                        });
                        break;

                    case 'color':
                        dataRef.current[folderName][name] = value;

                        folder.addColor(dataRef.current[folderName], name)
                        .onChange((value) => {

                            onChange({value, folderName, name, target: dataRef.current[folderName]});
                        });
                        break;

                    case 'array':
                        dataRef.current[folderName][name] = value.join(' ');

                        folder.add(dataRef.current[folderName], name)
                        .onChange((value) => {

                            onChange({
                                value: value.split(' ').map(v => Number(v)),
                                folderName, 
                                name, 
                                target: dataRef.current[folderName]
                            })
                        }); 
                        break;

                    case 'boolean':
                        dataRef.current[folderName][name] = value;

                        folder.add(dataRef.current[folderName], name)
                        .onChange((value) => {

                            onChange({value, folderName, name, target: dataRef.current[folderName]});
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