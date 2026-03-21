/**
 * Author : Alexander Perlock
 * MACID : perlocka
 * Date Created : 10 03 26
 * Date Modified : 21 03 26
 * 
 * Handles the page classes and their respective logic for : 
 *     - moving to the next page
 *     - interacting with elements on the page
 *     - etc.
 * 
 * Note : Game Page / Logic is in maze.js
 */

/**
 * Houses basic functions and definitions used by more than one page
 */
class Page {
    constructor() {
        this.end = 0;
    }

    /**
     * Creates an overlay to render onto the screen
     * 
     * @returns the overlay object
     */
    create_overlay() {
        const disp = document.getElementById("display");
        // disp.classList.add(this.constructor.name.toLowerCase()); // not actually used -> was for css formating
        return disp;
    }

    /**
     * Creates a new element and appends it to a parent
     * 
     * @param parent the HTML parent element
     * @param {string} type the HTML element code, if blank assumed to be a paragraph : "p"
     * @param {string} innerText the innerText of the element
     * @param {string} id the element's id
     * @param {Array<string>} classes the list of the element's classes 
     * 
     * @returns the new element
     */
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

    /**
     * Gets the page that should be displayed next
     * 
     * @param c the canvas element
     * @param ctx the canvas element's ctx
     * 
     * @returns the next page to be displayed
     */
    get_target(c, ctx) {
        return this.target;
    }

    /**
     * Updates the page and canvas
     * 
     * Parent is empty - allows for calling of a null function
     * 
     * @param c the canvas element
     * @param ctx the canvas element's ctx
     */
    update(c, ctx) {}

    /**
     * Clears the screen of unneeded elements and clears the canvas element
     * 
     * @param c the canvas element
     * @param ctx the canvas element's ctx
     */
    clear(c, ctx) {
        const disp = document.getElementById("display");
        disp.classList.remove(this.constructor.name.toLowerCase());
        disp.innerHTML = "";
        ctx.reset();
    }
}

/**
 * Handles Splash Page / Logic
 * 
 * @param c the canvas element
 */
class Splash extends Page {
    constructor(c) {
        super();
        this.target = Info;
        this.graphic = new GameMap(500);
        this.graphic_size = 0;

        // setTimeout(() => this.end = 1, 2.5 * 1000);
        c.addEventListener("mousedown", () => this.end = 1);
    }

    /**
     * Gets the page that should be displayed next
     * and clears the current viewing off the page
     * 
     * @param c the canvas element
     * @param ctx the canvas element's ctx
     * 
     * @returns the next page to be displayed
     */
    get_target(c, ctx) {
        this.clear(c, ctx);
        document.querySelector("header").childNodes.forEach(child => child.classList.remove("hidden"));
        return super.get_target();
    }

    /**
     * Updates the page and canvas
     * 
     * @param c the canvas element
     * @param ctx the canvas element's ctx
     */
    update(c, ctx) {
        if (this.graphic_size < 2) {
            this.graphic_size += 0.01;
        }
        this.#render(c, ctx)
    }

    /**
     * Draws the page onto a canvas element
     * 
     * @param c the canvas element
     * @param ctx the canvas element's ctx
     */
    #render(c, ctx) {
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.setTransform(1, 0, 0, 1, c.width * 0.5, c.height * 0.2);

        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.font = `${20 * this.graphic_size}px Arial`;
        ctx.textAlign = "center";

        ctx.fillText("Maze Game", 0, -80);

        ctx.setTransform(1, 0, 0, 1, c.width * 0.5, c.height * 0.4);
        this.graphic.draw(ctx, 4 * this.graphic_size);

        ctx.setTransform(1, 0, 0, 1, c.width * 0.5, c.height * 0.75);
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.font = `${10 * this.graphic_size}px Arial`;
        ctx.fillText("Press Anywhere To Start", 0, 0);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}
/**
 * Handles Start Page / Logic
 */
class Start extends Page {
    constructor() {
        super();
        this.target = Maze;

        this.create_overlay();
    }

    /**
     * Creates an overlay to render onto the screen
     * 
     * @returns the overlay object
     */
    create_overlay() {
        const disp = super.create_overlay();

        const container = this.create_e(disp, "div", undefined, "home");

        const start = this.create_e(container, "h1", "Start", undefined, ["clickable", "title"]);

        const settings = this.create_e(container, "h1", "Settings", undefined, ["clickable", "title"]);

        const scores = this.create_e(container, "h1", "Scoreboard", undefined, ["clickable", "title"]);

        const info = this.create_e(container, "h1", "Info", undefined, ["clickable", "title"]);

        const choose = (focus) => {
            this.activeFocus = focus;
            this.end = 1
        }

        start.addEventListener("mousedown", () => choose(Maze));
        settings.addEventListener("mousedown", () => choose(Settings));
        scores.addEventListener("mousedown", () => choose(Scoreboard));
        info.addEventListener("mousedown", () => choose(Info));

    }

    /**
     * Gets the page that should be displayed next
     * and clears the current viewing off the page
     * 
     * @param c the canvas element
     * @param ctx the canvas element's ctx
     * 
     * @returns the next page to be displayed
     */
    get_target(c, ctx) {
        if (this.activeFocus) {
            this.clear(c, ctx);
            return this.activeFocus;
        }
    }

}

/**
 * Handles Setting Page / Logic
 */
class Settings extends Page {
    constructor() {
        super();
        let ls = localStorage.settings;
        if (!ls) {
            this.activeFocus = null;
            this.settings = {controller : null, rooms : 100};
        } else {
            this.settings = JSON.parse(ls);
            this.activeFocus = this.settings.controller;
        }
        this.target = Start;

        this.create_overlay();

    }

    /**
     * Creates an overlay to render onto the screen
     * 
     * @returns the overlay object
     */
    create_overlay() {
        const disp = super.create_overlay();

        this.create_e(disp, "h1", "Settings", undefined, ["title"]);

        this.create_e(disp, "h1", "Controller", undefined, ["title"])

        const controller_choices = this.create_e(disp, "div", undefined, undefined, ["choices"]);

        const keyboard = this.create_e(controller_choices, "div", undefined, undefined, ["clickable"]);
        this.create_e(keyboard, "h1", "Keyboard");
        const keyboard_list = this.create_e(keyboard, "ul");
        this.create_e(keyboard_list, "li", "W - Up");
        this.create_e(keyboard_list, "li", "A - Left");
        this.create_e(keyboard_list, "li", "S - Down");
        this.create_e(keyboard_list, "li", "D - Right");
        this.create_e(keyboard_list, "li", "Shift - Move at half speed");

        const trackpad = this.create_e(controller_choices, "div", undefined, undefined, ["clickable"]);
        this.create_e(trackpad, "h1", "Trackpad");
        this.create_e(trackpad, "p", "Creates a on-screen joystick style trackpad");

        this.create_e(disp, "h1", "Number of Rooms", undefined, ["title"])

        const rooms = this.create_e(disp, "div", undefined, "rooms");
        this.rooms = this.create_e(rooms, "input", undefined);
        this.rooms.setAttribute("type", "range");
        this.rooms.setAttribute("min", "0");
        this.rooms.setAttribute("max", "7");
        this.rooms.setAttribute("value", this.settings.rooms)
        this.rooms.setAttribute("oninput", "rooscurrent.innerText = 10 ** this.value");
        this.create_e(rooms, "p", 10 ** this.rooms.value, "rooscurrent")

        const b = this.create_e(disp, "h1", "Exit", undefined, ["clickable", "title"]);
        

        const choose = (element, focus) => {
            document.querySelectorAll(".selected").forEach(e => e.classList.remove("selected"));
            element.classList.add("selected");
            this.settings.controller = focus.name;
        }

        keyboard.addEventListener("mousedown", () => choose(keyboard, Keyboard));
        trackpad.addEventListener("mousedown", () => choose(trackpad, Trackpad));
        b.addEventListener("mousedown", () => this.end = 1)

        return disp;
    }

    /**
     * Gets the page that should be displayed next
     * and clears the current viewing off the page
     * 
     * @param c the canvas element
     * @param ctx the canvas element's ctx
     * 
     * @returns the next page to be displayed
     */
    get_target(c, ctx) {
        this.clear(c, ctx);

        this.settings.rooms = this.rooms.value;
        console.log(this.settings);
        localStorage.settings = JSON.stringify(this.settings);
        
        c.classList.add("hidden")
        return super.get_target(c, ctx);
        
    }
}

/**
 * Handles Scoreboard Page / Logic
 */
class Scoreboard extends Page {
    constructor(score) {
        super();
        this.target = Start;

        this.create_overlay(score);
    }

    /**
     * Gets the page that should be displayed next
     * and clears the current viewing off the page
     * 
     * @param c the canvas element
     * @param ctx the canvas element's ctx
     * 
     * @returns the next page to be displayed
     */
    get_target(c, ctx) {
        this.clear(c, ctx);
        return super.get_target(c, ctx);
    }

    /**
     * Creates an overlay to render onto the screen
     * 
     * @returns the overlay object
     */
    create_overlay(score) {
        const disp = super.create_overlay();

        if (score) {
            this.create_e(disp, "h1", "Congrats!!", undefined, ["title"]);
            this.create_e(disp, "p", `Your time was ${score}`);
        }
        this.create_e(disp, "h1", "Scoreboard", undefined, ["title"]);

        const format_score = (parent, controller, rooms, score) => {
            const s = this.create_e(parent, "li");
            this.create_e(s, "p", controller, undefined, ["controller"]);
            this.create_e(s, "p", rooms, undefined, ["rooms"]);
            this.create_e(s, "p", score, undefined, ["score"]);
        }

        const example_scores = this.create_e(disp, "ul", undefined, "example_score");
        format_score(example_scores, "Controller", "Rooms", "Score");
        format_score(example_scores, "Controller", "Rooms", "Score");

        const scores_e = this.create_e(disp, "ul", undefined, "scores");
        let scores = localStorage.scores;
        if (!scores) {
            scores = [];
        } else {
            scores = JSON.parse(scores);
        }

        scores.reverse().splice(0, 8).forEach(score => format_score(scores_e, score.controller, score.rooms, `${score.score}s`) );

        const exit = this.create_e(disp, "h1", "Exit", undefined, ["clickable", "title"]);
        exit.addEventListener("mousedown", () => this.end = 1);
    }
}

class Info extends Page {
    constructor() {
        super();

        this.target = Start;

        this.create_overlay();
    }

    /**
     * Gets the page that should be displayed next
     * and clears the current viewing off the page
     * 
     * @param c the canvas element
     * @param ctx the canvas element's ctx
     * 
     * @returns the next page to be displayed
     */
    get_target(c, ctx) {
        this.clear(c, ctx);
        return super.get_target(c, ctx);
    }

    /**
     * Creates an overlay to render onto the screen
     * 
     * @returns the overlay object
     */
    create_overlay() {
        const disp = super.create_overlay();

        this.create_e(disp, "h1", "Info", undefined, ["title"]);

        const info = this.create_e(disp, "div", undefined, "info");
        this.create_e(info, "p", "The objective of the maze is to navigate to a randomly generated golden coloured exit.");
        this.create_e(info, "p", "At any time you may click the exit button in the top left corner to return to the main menu.");
        this.create_e(info, "p", "All other click-able elements are denoted by their round borders.");

        this.create_e(disp, "h1", "Credits", undefined, ["title"]);
        const credits = this.create_e(disp, "div", undefined, "credits");
        this.create_e(credits, "p", "Author : Alexander Perlock");
        this.create_e(credits, "p", "Date of Creation : 21 March 2026");
        this.create_e(credits, "p", "Product of McMaster University Course Computer Science 1XD3 - Winter 2026")

        const exit = this.create_e(disp, "h1", "Exit", undefined, ["clickable", "title"]);
        exit.addEventListener("mousedown", () => this.end = 1);
    }
}