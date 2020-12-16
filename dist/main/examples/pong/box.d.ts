import DIV from "../../src/div";
import { Vector } from "../../src/math";
export default class Box {
    pos: Vector;
    color: string;
    mass: number;
    vol: Vector;
    acc: Vector;
    size: Vector;
    elm: DIV;
    constructor(pos: any, size: any, mass: any, color: any);
    createElm(): void;
    updateElm(): void;
    updatePhysic(): void;
    calcCollision(mass: any, vol: any): Vector;
    applyForce(force: any): void;
}
