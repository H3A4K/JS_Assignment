/**
 * Author : Alexander Perlock
 * MACID : perlocka
 * Date Created : 10 03 26
 * Date Modified : 10 03 26
 * 
 * Main Game, Splash, and Setup Page Logic
 */

/**
 * 
 */
class Page {

    constructor(c, ctx) {
        this.c = c;
        this.ctx = ctx;
        this.end = 0;
    }

    get_target() {
        return this.target;
    }

    update() {
        this.#logic();
        this.#render();
    }

    #logic() {}

    #render() {}
}

/**
 * 
 */
class Splash extends Page {

    constructor(c, ctx, controller) {
        super(c, ctx);
        this.target = Setup;

        this.#render();
        setTimeout(() => this.end = 1, 1000);
    }

    #render() {

    }
}

/**
 * 
 */
class Setup extends Page {
    constructor(c, ctx) {
        super(c, ctx);
        this.activeFocus = null;
        this.target = Game;

        this.#render();
        this.c.addEventListener("mousedown", this.#move_focus);

        const disp = document.getElementById("display");
        const k = document.createElement("img");
        k.setAttribute("src", "./assets/images/keyboard.png");
        k.style.left = "33%";
        // k.style.width = "25%";

        const t = document.createElement("img");
        t.setAttribute("src", "./assets/images/trackpad.png");
        t.style.right = "33%";
        // t.style.width = "14%";

        disp.appendChild(k);
        disp.appendChild(t);
        console.log("opened");
    }

    get_target() {
        if (this.activeFocus) {
            controller = new this.activeFocus();
            return super.get_target();
        }
    }

    #move_focus() {

    }

    #end() {
        this.c.removeEventListener("mousedown", this.#move_focus);
    }

    // update() {
    //     this.#render();
    // }

    get_option() {
        return;
    }

    #render() {
        
    }
}

/**
 * 
 */
class Game extends Page {
    constructor(c, ctx, controller = new Trackpad("controls")) {
        super(c, ctx);
    }

}