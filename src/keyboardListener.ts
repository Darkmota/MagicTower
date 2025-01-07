const keysDown: Record<number, boolean> = {};
const keysReacted: Record<number, number> = {};
for (let i = 0; i < 256; ++i) {
    keysReacted[i] = 0;
}

interface KeyboardListener {
    ready: boolean;
    set(): void;
    refresh(): void;
}

function kble(i: number): boolean {
    if (i in keysDown) {
        if (keysReacted[i] === 0) {
            keysReacted[i] = 1;
            return true;
        } else {
            return keysReacted[i] === 13;
        }
    }
    return false;
}

class KeyboardListenerImpl implements KeyboardListener {
    public ready: boolean = false;

    public set(): void {
        addEventListener("keydown", (e: KeyboardEvent) => {
            keysDown[e.keyCode] = true;
        }, false);

        addEventListener("keyup", (e: KeyboardEvent) => {
            keysReacted[e.keyCode] = 0;
            delete keysDown[e.keyCode];
        }, false);

        this.ready = true;
    }

    public refresh(): void {
        for (let i = 0; i < 256; ++i) {
            if (keysReacted[i] !== 13 && keysReacted[i] !== 0) {
                ++keysReacted[i];
            }
        }
        if (!this.ready || mainWait.ready) return;
        
        if (mainBox && typeof mainBox.input === 'function') {
            if (kble(40)) { // Down
                mainBox.input("Down");
            } else if (kble(37)) { // Left
                mainBox.input("Left");
            } else if (kble(39)) { // Right
                mainBox.input("Right");
            } else if (kble(38)) { // Up
                mainBox.input("Up");
            } else if (kble(13) || kble(108)) { // Enter
                mainBox.input("Enter");
            }
        } else {
            if (mainHero.movable) {
                if (kble(40)) { // Down
                    mainHero.go_down();
                } else if (kble(37)) { // Left
                    mainHero.go_left();
                } else if (kble(39)) { // Right
                    mainHero.go_right();
                } else if (kble(38)) { // Up
                    mainHero.go_up();
                }
            }
            if (keysDown[83]) {
                if (!mainMonsterBook.ready) {
                    mainMonsterBook.set();
                }
            } else {
                mainMonsterBook.ready = false;
            }
        }
    }
}

export { KeyboardListenerImpl as KeyboardListener }
