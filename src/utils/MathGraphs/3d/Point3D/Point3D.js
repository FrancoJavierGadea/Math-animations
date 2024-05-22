import * as THREE from "three";

export class Point3D {

    static defaultStyle = {
        color: '#ffffff'
    }

    constructor(params = {}){

        const {
            point = [0, 0, 0],
            radius = 0.1,
            segments = 16,
            style = {}
        } = params;

        this.point = {
            x: point.x ?? point[0],
            y: point.y ?? point[1],
            z: point.z ?? point[2],
        }
        this.radius = radius;

        this.style = {
            ...Point3D.defaultStyle,
            ...style
        }


        this.shape = new THREE.Mesh(
            new THREE.SphereGeometry(this.radius, this.segments, this.segments),
            new THREE.MeshBasicMaterial(this.style)
        );

        this.shape.position.set(this.point.x, this.point.y, this.point.z);
    }
}