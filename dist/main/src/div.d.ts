export default class DIV {
    parent: HTMLElement;
    elm: HTMLElementTagNameMap[keyof HTMLElementTagNameMap];
    isCircle: boolean;
    x: number;
    y: number;
    _height: number;
    _width: number;
    constructor(type?: keyof HTMLElementTagNameMap, config?: {
        parent?: HTMLElement;
    });
    initParent(parent?: HTMLElement): void;
    elmType(): "div" | "input";
    style(property: any): string;
    hide(): this;
    show(): this;
    text(text?: any, color?: any, size?: any, dir?: any): this | {
        value: string;
        color: string;
        size: string;
        dir: string;
    };
    bg_color(hix: any): string | this;
    width(): number;
    setWidth(val: number, duration?: any, splite?: string): this | Promise<this>;
    height(): number;
    setHeight(val: number, duration?: any, splite?: string): this | Promise<this>;
    size(w?: number | string, h?: number | string): this;
    border(w: any, hix: any, dir?: (1 | 2 | 3 | 4)[] | (1 | 2 | 3 | 4)): this;
    circle(): this;
    free(): this;
    box(): this;
    top(get?: boolean | number, inc?: number): number | this;
    left(get?: boolean | number, inc?: number): number | this;
    center(parent: any): this;
    rotate(deg: any): this;
    axe_center(val?: any): this;
    attr(name: any, val?: any): string | this;
    onclick(fnc: any): void;
    ondclick(fnc: any): void;
    onmouseout(fnc: any): void;
    onchange(fnc: any): void;
    remove(): void;
}
