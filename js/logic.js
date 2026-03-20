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

    create_overlay() {
        const disp = document.getElementById("display");
        return disp;
    }

    create_e(parent, type = "p", innerText, id, classes) {
        const e = document.createElement(type);
        if (innerText) {
            e.innerHTML = innerText;
        }
        if (id) {
            e.id = id;
        }
        if (classes) {
            classes.forEach(c => e.classList.add(c));
        }

        parent.appendChild(e);
        return e;
    }   

    get_target(c, ctx) {
        return this.target;
    }

    update() { }

    clear(c, ctx) {
        const disp = document.getElementById("display");
        disp.innerHTML = "";
        ctx.reset();
    }
}

/**
 * 
 */
class Splash extends Page {

    constructor() {
        super();
        this.target = Start;

        this.graphic_size = 0;

        setTimeout(() => this.end = 1, 1 * 1000);
    }

    get_target(c, ctx) {
        this.clear(c, ctx);
        document.querySelector("header").childNodes.forEach(child => child.classList.remove("hidden"));
        return super.get_target();
    }

    update(c, ctx) {
        if (this.graphic_size < 2) {
            this.graphic_size += 0.01;
        }
        this.#render(c, ctx)
    }

    #render(c, ctx) {
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.setTransform(1, 0, 0, 1, c.width * 0.5, c.height * 0.25);

        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.font = `${30 * this.graphic_size}px Arial`;
        ctx.textAlign = "center";

        ctx.fillText("Maze Game", 0, -80);

        ctx.fillRect(-20 * this.graphic_size, -20 * this.graphic_size, 2*20 * this.graphic_size, 2*20 * this.graphic_size);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
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
        this.settings = {controller : null};

        this.create_overlay();

    }

    create_overlay() {
        const disp = super.create_overlay();

        const k = this.create_e(disp, "div", undefined, undefined, ["clickable"]);
        this.create_e(k, "h1", "Keyboard");
        this.create_e(k, "p", "<ul><li>W - Up</li><li>A - Left</li><li>S - Down</li><li>D - Right</li>");

        const t = this.create_e(disp, "div", undefined, undefined, ["clickable"]);
        this.create_e(t, "h1", "Touchpad");
        this.create_e(t, "p", "Creates a on-screen joystick style touchpad");

        const choose = (focus) => {
            this.activeFocus = focus;
            this.end = 1
        }

        k.addEventListener("mousedown", () => choose(Keyboard));
        t.addEventListener("mousedown", () => choose(Trackpad));


        return disp;
    }


    get_target(c, ctx) {
        if (this.activeFocus) {
            this.clear(c, ctx)
            this.settings.controller = this.activeFocus.name;
            localStorage.settings = JSON.stringify(this.settings);
            c.classList.add("hidden")
            return super.get_target(c, ctx);
        }
    }
}

class Start extends Page {
    constructor() {
        super();
        this.target = Game;

        this.create_overlay();
    }

    create_overlay() {
        const disp = super.create_overlay();

        const start = this.create_e(disp, "h1", "Start", undefined, ["clickable"]);

        const controls = this.create_e(disp, "h1", "Controls", undefined, ["clickable"]);

        const scores = this.create_e(disp, "h1", "Scoreboard", undefined, ["clickable"]);

        const choose = (focus) => {
            this.activeFocus = focus;
            this.end = 1
        }

        start.addEventListener("mousedown", () => choose(Game));
        controls.addEventListener("mousedown", () => choose(Setup));
        scores.addEventListener("mousedown", () => choose(Scoreboard));

    }

    get_target(c, ctx) {
        if (this.activeFocus) {
            this.clear(c, ctx);
            return this.activeFocus;
        }
    }

}

class Scoreboard extends Page {
    constructor(score) {
        super();
        this.target = Start;

        this.create_overlay(score);
    }

    get_target(c, ctx) {
        this.clear(c, ctx);
        return super.get_target(c, ctx);
    }

    create_overlay(score) {
        const disp = super.create_overlay();
        const exit = this.create_e(disp, "h1", "Exit", undefined, ["clickable"]);
        exit.addEventListener("mousedown", () => this.end = 1);

        if (score) {
            this.create_e(disp, "p", `Your time was ${score}`)
        }
        let scores_e = this.create_e(disp, "ul");
        let scores = localStorage.scores;
        if (!scores) {
            scores = [];
        } else {
            scores = JSON.parse(scores);
        }
        scores.reverse().splice(0, 10).forEach(score => this.create_e(scores_e, "li", `${score}s`));
    }
}

/**
 * 
 */
class Game extends Page {
    constructor(controller = new Trackpad("controls")) {
        super();
        this.controller = controller;
        this.map = new GameMap(100);
        this.factor = 256;
        this.target = Scoreboard;
        this.score = 0;

        this.current_room = this.map.start;
        this.player = {x: this.current_room.x, y: this.current_room.y};

    }

    get_score() {
        if (!this.end) {
            return -1;
        }

        return this.score / 1000;
    }

    clear(c, ctx) {
        super.clear(c, ctx);
        const controls = document.getElementById("controls");
        controls.innerHTML = "";
    }

    get_target(c, ctx) {
        this.clear(c, ctx);

        return this.target;
    }

    update(c, ctx) {
        this.score++;
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

        ctx.setTransform(this.factor, 0, 0, this.factor, transX, transY);
        this.map.draw(ctx, 1);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.fillStyle = "red";
        ctx.arc(c.width / 2, c.height / 2, 5, 0, 2 * Math.PI);
        ctx.fill();
    }

}