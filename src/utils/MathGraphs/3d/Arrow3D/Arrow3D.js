import { DEGREES } from "@utils/MathGraphs/utils";
import * as THREE from "three";

export class Arrow3D {

    static defaultStyle = {
        color: '#ffffff',
        transparent: true,
        opacity: 1
    }

    constructor(params = {}){

        const {
            start = [0, 0, 0],
            end = [1, 1, 1],
            lineWidth = 0.02,
            segments = 8,
            size = 0.2,
            delta = 0.05,
            startArrow = false,
            endArrow = true,
            style = {}
        } = params;

        this.start = {
            x: start.x ?? start[0],
            y: start.y ?? start[1],
            z: start.z ?? start[2],
        };
        this.end = {
            x: end.x ?? end[0],
            y: end.y ?? end[1],
            z: end.z ?? end[2],
        };

        this.style = {
            ...Arrow3D.defaultStyle,
            ...style
        };

        this.startArrow = startArrow;
        this.endArrow = endArrow;

        this.#initShape({lineWidth, segments, delta, size});
    }

    #initShape({lineWidth, segments, delta, size}){

        let length = Math.hypot((this.end.x - this.start.x), (this.end.y - this.start.y), (this.end.z - this.start.z));
        
        if(this.endArrow) length -= size;
        if(this.startArrow) length -= size;

        const d = (() => {
            if(this.startArrow === this.endArrow) return 0;
            if(this.startArrow) return size / 2;
            if(this.endArrow) return -size / 2;
        })() 
        

        const line = new THREE.Mesh(
            new THREE.CylinderGeometry(lineWidth, lineWidth, length, segments, segments)
            .translate(0, d, 0)
            .rotateX(90 * DEGREES),
            new THREE.MeshBasicMaterial(this.style)
        );

        this.shape = new THREE.Group();
        this.shape.add(line);

        if(this.startArrow){

            const startHead = new THREE.Mesh(
                new THREE.ConeGeometry(lineWidth + delta, size, segments)
                .translate(0, this.endArrow ? (size / 2) : 0, 0)
                .rotateX(-90 * DEGREES),
                new THREE.MeshBasicMaterial(this.style)
            );
    
            startHead.position.set(0, 0, -length / 2);

            this.shape.add(startHead);
        }

        if(this.endArrow){

            const endHead = new THREE.Mesh(
                new THREE.ConeGeometry(lineWidth + delta, size, segments)
                .translate(0, this.startArrow ? (size / 2) : 0, 0)
                .rotateX(90 * DEGREES),
                new THREE.MeshBasicMaterial(this.style)
            );
    
            endHead.position.set(0, 0, length / 2);

            this.shape.add(endHead);
        }

        const middle = {
            x: (this.start.x + this.end.x) / 2,
            y: (this.start.y + this.end.y) / 2,
            z: (this.start.z + this.end.z) / 2,
        }

        this.shape.position.set(middle.x, middle.y, middle.z);
        this.shape.lookAt(this.end.x, this.end.y, this.end.z);
    }
}