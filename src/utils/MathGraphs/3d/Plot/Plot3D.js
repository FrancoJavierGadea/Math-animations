import * as THREE from "three";
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

export class Plot3D {

    static defaultStyle = {
        color: '#ffffff',
    };

    constructor(params = {}){

        const {
            func = (x, y) => x*x + y,
            range = [-3, 3],
            step = 0.1,
            segments = 16,
            name,
            style = {},
        } = params;

        this.function = func;
        this.range = {
            min: range['min'] ?? range[0],
            max: range['max'] ?? range[1]
        }
        this.step = Math.abs(step);
        this.name = name;
        this.style = {
            ...Plot3D.defaultStyle,
            ...style
        };

        this.#initShape({segments});
    }

    #initShape({segments}){

        const meshFunction = (u, v, target) => {

            let x = (this.range.max - this.range.min) * u + this.range.min;
            let y = (this.range.max - this.range.min) * v + this.range.min;
            let z = this.function(x, y);

            if(!isNaN(z)){
                target.set(x, y, z);
            }
            else {
                target.set(0, 0, 0);
            };
        }

        const plotGeometry = new ParametricGeometry(meshFunction, segments, segments);

        const material = new THREE.MeshBasicMaterial({
            color: '#ffffff', 
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });

        const plot = new THREE.Mesh(plotGeometry, material);

        const wireframe = new THREE.WireframeGeometry(plotGeometry);

        const lines = new THREE.LineSegments(wireframe, 
            new THREE.MeshBasicMaterial({
                color: '#cf1c1c', 
                side: THREE.DoubleSide,
            })
        );


        this.shape = new THREE.Group();

        this.shape.add(plot, lines);
    }
}