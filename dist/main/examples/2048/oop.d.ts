import DIV from "../../src/div";
import { Vector } from "../../src/math";
export declare class Box {
    border: String;
    elm: DIV;
    squars: Squar[];
    size: number;
    constructor(color: string, border: string, size: number);
    initialise(start: any): void;
    move(dir: any): void;
    swap(first: any, last: any): void;
}
export declare class Squar {
    parent: Box;
    pos: Vector;
    size: number;
    elm: DIV;
    value: number;
    index: number;
    constructor(position: any, size: any, color: any, index: any, parent: any);
    setVal(val: number): void;
    color(): string;
    setIndex(index: any): void;
}
