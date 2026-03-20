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
    constructor() {
        this.end = 0;
    }

    get_target() {
        return this.target;
    }

    update() { }
}

/**
 * 
 */
class Splash extends Page {

    constructor() {
        super();
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
    constructor() {
        super();
        this.activeFocus = null;
        this.target = Start;
        this.end = 0;
        this.settings = {controller : null};


        const choose = (focus) => {
            this.activeFocus = focus;
            this.end = 1
        }

        const disp = document.getElementById("display");
        const k = document.createElement("img");
        k.setAttribute("src", "./assets/images/keyboard.png");
        k.style.left = "33%";
        // k.style.width = "25%";
        k.addEventListener("mousedown", () => choose(Keyboard));

        const t = document.createElement("img");
        t.setAttribute("src", "./assets/images/trackpad.png");
        t.style.right = "33%";
        // t.style.width = "14%";
        t.addEventListener("mousedown", () => choose(Trackpad));

        disp.appendChild(k);
        disp.appendChild(t);

        console.log("opened");
    }

    get_target() {
        if (this.activeFocus) {
            const disp = document.getElementById("display");
            disp.querySelectorAll("img").forEach(img => disp.removeChild(img));
            this.settings.controller = this.activeFocus.name;
            localStorage.settings = JSON.stringify(this.settings);
            return super.get_target();
        }
    }
}

class Start extends Page {
    constructor(c, ctx) {
        super(c, ctx);
        this.target = Game;
        this.end = 0;
    }

    update() {
        console.log("DONE");
    }
}

/**
 * 
 */
class Game extends Page {
    constructor(controller = new Trackpad("controls")) {
        super();
        this.controller = controller;
        this.end = 0;
        this.map = new GameMap(5);
        this.factor = 256;
        this.target = Start;

        this.current_room = this.map.start;
        this.player = {x: this.current_room.x, y: this.current_room.y};

    }

    get_target(c, ctx) {
        ctx.clearRect(0, 0, c.width, c.height);

        return this.target;
    }

    update(c, ctx) {
        console.log()
        this.move();
        this.#render(c, ctx);
    }

    move() {
        let vector = this.controller.get_adjusted_vector(this.factor);

        if (vector.x === 0 && vector.y === 0) { return }

        this.validate_move(vector, "x");
        this.validate_move(vector, "y");

        let x = Math.floor(this.player.x + 0.5);
        let y = Math.floor(this.player.y + 0.5);
        if (x !== this.current_room.x || y !== this.current_room.y){
            this.current_room = this.map.rooms.find(r => r.x === x && r.y === y);

            if (this.current_room === this.map.end) {
                this.end = 1;
                console.log("done");
            }
        }
    }

    validate_move(vector, dir) {
        let rot;
        if (dir == "x") {
            rot = Math.sign(vector[dir]) > 0 ? 1 : 3;
        } else {
            rot = Math.sign(vector[dir]) > 0 ? 2 : 0;
        }
        if (this.current_room.exits & 1 << rot) {
            this.player[dir] += vector[dir];
            return;
        }

        let relative = this.player[dir] - this.current_room[dir] + 0.5;

        if ((relative < 0.5 && vector[dir] > 0) || (relative > 0.5 && vector[dir] < 0)) {
            this.player[dir] += vector[dir];
            return;
        }

        if (relative + vector[dir] < 0.05) {
            this.player[dir] = this.current_room[dir] - 0.45;
        } else if (relative + vector[dir] > 0.95) {
            this.player[dir] = this.current_room[dir] + 0.45;
        } else {
            this.player[dir] += vector[dir];
        }

    }

    #render(c, ctx) {
        ctx.clearRect(0, 0, c.width, c.height);

        let transX = c.width * 0.5 - this.player.x * this.factor;
        let transY = c.height * 0.5 - this.player.y * this.factor;

        ctx.setTransform(this.factor, 0, 0, this.factor, transX, transY)
        this.map.draw(ctx, 1);
        ctx.setTransform(1, 0, 0, 1, 0, 0)

        ctx.fillStyle = "red";
        ctx.arc(c.width / 2, c.height / 2, 5, 0, 2 * Math.PI);
        ctx.fill();
    }

}