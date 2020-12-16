import { Vector } from "../../src/math";
import { Triangle } from "../../src/shapes";
import { RoadLine } from "./index";
export declare class Plain {
    zones: any[];
    column: number;
    width: number;
    constructor(bgSize: Vector, playerSize: Vector);
}
export declare class Mover {
    pos: Vector;
    vol: Vector;
    acc: Vector;
    max: {
        speed: number;
        force: number;
    };
    elm: Triangle;
    zone: number;
    plain: Plain;
    constructor(plain: Plain, size: {
        x: number;
        y: number;
    }, maxSpeed: number, maxForce: number, pos?: Vector, color?: string);
    update(): void;
    updateZones(): void;
    getCurrentZone(): number;
    getNeiborsFromSideZones(): any[];
    applayForce(f: any): void;
    follow(target: any, road: {
        lines: RoadLine[];
    }): void;
    seek(target: any): any;
    separate(): Vector;
    aligment(): Vector;
}
export declare class Road {
    wide: number;
    lines: RoadLine[];
    constructor(wide: number);
}
