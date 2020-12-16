import { Vector } from "./math";
import DIV from "./div";
export declare class Spot {
    r: number;
    color: string;
    zoom: boolean;
    parent: Line[];
    pos: Vector;
    use: boolean;
    elm: DIV;
    constructor(x: number | Spot, y: number, { c, r }: {
        r?: number;
        c?: string;
    });
    update(vector: [number, number]): void;
    state(s: boolean, x: any, y?: number, c?: string): void;
}
export declare class Line {
    object: any;
    spot1: Spot;
    spot2: Spot;
    size: number;
    color: string;
    length: number;
    angle: number;
    axe: Spot;
    AntiAxe: Spot;
    elm: DIV;
    constructor(spot1: Spot, spot2: Spot, size?: number, color?: string);
    calc_angle(): void;
    update(): void;
    width(size: any, inc?: number, axe?: number): void;
    rotate(angle?: number, axe?: Spot, inc?: number): void;
    remove(): void;
}
export declare function dot(x?: number, y?: number, w?: number, c?: string, fct?: string): DIV;
export declare class Triangle {
    elm: DIV;
    angle: number;
    w: number;
    h: number;
    color: String;
    pos: Vector;
    constructor(x: Vector | number, y: number, w: number, h: number | string, color?: string);
    show(): void;
    update(pos: any): void;
    calc_angle(pos: any): void;
}
