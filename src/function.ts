import { MessageBox } from './messageBox.js';

export function imgLoad(img: HTMLImageElement, callback: (img: HTMLImageElement) => void): void {
    const timer = setInterval(() => {
        if (img && img.complete) {
            clearInterval(timer);
            callback(img);
        }
    }, 50);
}

export function imgLoadWith<T>(img: HTMLImageElement, thing: T, callback: (img: HTMLImageElement, thing: T) => void): void {
    const timer = setInterval(() => {
        if (img && img.complete) {
            clearInterval(timer);
            callback(img, thing);
        }
    }, 50);
}

export function between(x: number, a: number, b: number): boolean {
    if (a > b) {
        const temp = a;
        a = b;
        b = temp;
    }
    return a <= x && x <= b;
}

export function jb(x: number, a: number, b: number): number {
    if (a > b) {
        const temp = a;
        a = b;
        b = temp;
    }
    if (x < a) {
        return a;
    }
    else if (x > b) {
        return b;
    }
    else {
        return x;
    }
}

export function addDownMessage(message: string): void {
    const newBox = new MessageBox(60, 384, 360, 32, 100, 1);
    newBox.set(message);
    let i = 0;
    while (mainAutoBox[i]) i++;
    mainAutoBox[i] = $.extend(true, {}, newBox);
}
