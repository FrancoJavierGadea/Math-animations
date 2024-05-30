

/**
 * @typedef ControlsDatGUIParams 
 *  @property {HTMLElement} container
 *  @property {String} name
 * 
 * @callback onChange
 *  @param {Object} e
 *  @param {String} e.name
 *  @param {String} e.folder
 *  @param {Object} e.target
 *  @param {String | Number | String[]} e.value
 *
 * @callback onClick
 *  @param {Object} e
 *  @param {String} e.name
 *  @param {String} e.folder
 *  @param {Object} e.target
 */

import { GUI } from "dat.gui";

export class ControlsDatGUI {


    /**
     * @constructor
     * @param {ControlsDatGUIParams} params 
     */
    constructor(params = {}){

        const {

            container,
            name
        } = params;

        this.container = container;
        this.name = name;
        this.gui = new GUI({autoPlace: false});
        this.data = {};
        this.folders = {}; 
    }

    //MARK: addRange
    /**
     * @param {String} name
     * @param {Number} value
     * @param {onChange} onChange 
     * @param {{folder:String, min:Number, max:Number, step:Number}} opt default: {folder, min = -5, max = 5, step = 1}
     */
    addRange(name, value = 0, onChange, {folder, min = -5, max = 5, step = 1} = {}){

        const handleChange = (value, target) => {

            if(onChange) onChange({value, folder, name, target});
        };

        if(folder){

            if(this.folders[folder]){

                this.data[folder][name] = value;
            }
            else {
                this.data[folder] = {[name]: value};
                this.folders[folder] = this.gui.addFolder(folder);
            }

            const target = this.data[folder];

            this.folders[folder].add(target, name, min, max, step)
            .onChange((value) => handleChange(value, target));
        }
        else {

            this.data[name] = value;

            const target = this.data;

            this.gui.add(target, name, min, max, step)
            .onChange((value) => handleChange(value, target));
        }
    }

    //MARK: addColor
    /**
     * @param {String} name 
     * @param {String} value 
     * @param {onChange} onChange 
     * @param {{folder: String}} opt
     */
    addColor(name, value = '#ffffff', onChange, {folder} = {}){

        const handleChange = (value, target) => {

            if(onChange) onChange({value, folder, name, target});
        };

        if(folder){

            if(this.folders[folder]){

                this.data[folder][name] = value;
            }
            else {
                this.data[folder] = {[name]: value};
                this.folders[folder] = this.gui.addFolder(folder);
            }

            const target = this.data[folder];

            this.folders[folder].addColor(target, name)
            .onChange((value) => handleChange(value, target));
        }
        else {

            this.data[name] = value;

            const target = this.data;

            this.gui.addColor(target, name)
            .onChange((value) => handleChange(value, target));
        }
    }

    //MARK: addBoolean
    /**
     * @param {String} name 
     * @param {Boolean} value 
     * @param {onChange} onChange 
     * @param {{folder: String}} opt 
     */
    addBoolean(name, value = false, onChange, {folder} = {}){

        const handleChange = (value, target) => {

            if(onChange) onChange({value, folder, name, target});
        };

        if(folder){

            if(this.folders[folder]){

                this.data[folder][name] = value;
            }
            else {
                this.data[folder] = {[name]: value};
                this.folders[folder] = this.gui.addFolder(folder);
            }

            const target = this.data[folder];

            this.folders[folder].add(target, name)
            .onChange((value) => handleChange(value, target));
        }
        else {

            this.data[name] = value;

            const target = this.data;

            this.gui.add(target, name)
            .onChange((value) => handleChange(value, target));
        }
    }

    //MARK: addArray
    /**
     * @param {String} name 
     * @param {String[]} value 
     * @param {onChange} onChange 
     * @param {{folder: String, separator: String}} opt default: {folder, separator = ' '}
     */
    addArray(name, value = [], onChange, {folder, separator = ' '} = {}){

        const handleChange = (value, target) => {

            if(onChange) onChange({
                value: value.split(separator).filter(v => v), 
                folder, name, target
            });
        }

        if(folder){

            if(this.folders[folder]){

                this.data[folder][name] = value.join(separator);
            }
            else {
                this.data[folder] = {[name]: value.join(separator)};
                this.folders[folder] = this.gui.addFolder(folder);
            }

            const target = this.data[folder];

            this.folders[folder].add(target, name)
            .onChange((value) => handleChange(value, target));
        }
        else {

            this.data[name] = value.join(separator);

            const target = this.data;

            this.gui.add(target, name)
            .onChange((value) => handleChange(value, target));
        }
    }

    //MARK: addButton
    /**
     * @param {String} name 
     * @param {onClick} onClick 
     * @param {{folder: String}} opt
     */
    addButton(name, onClick = () => {}, {folder} = {}){

        const handleClick = function(){

            if(onClick) onClick({folder, name, target: this});
        }

        if(folder){

            if(this.folders[folder]){

                this.data[folder][name] = handleClick;
            }
            else {
                this.data[folder] = {[name]: handleClick};
                this.folders[folder] = this.gui.addFolder(folder);
            }

            const target = this.data[folder];

            this.folders[folder].add(target, name);
        }
        else {

            this.data[name] = handleClick;

            const target = this.data;

            this.gui.add(target, name);
        }
    }


    //MARK: Append
    /**
     * @param {HTMLElement} container 
     */
    append(container){

        const element = container ?? this.container;

        this.gui.domElement.classList.add('GUI');
        this.gui.domElement.setAttribute('data-name', this.name);

        //Add element to DOM
        element.appendChild(this.gui.domElement);
    }
}

