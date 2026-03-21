/**
 * Author : Alexander Perlock
 * MACID : perlocka
 * Date Created : 21 03 26
 * Date Modified : 21 03 26
 * 
 * Handles Game Page / Logic
 * 
 * Note : File created on 21 03 26, but Maze class started creation on 10 03 26
 */

/**
 * Handles Game Page / Logic
 */
class Maze extends Page {
    constructor() {
        super();
        this.settings = localStorage.settings;
        if (!this.settings) {
            this.controller = new Trackpad("controls");
            this.map = new GameMap(1000);
            this.settings = {controller: "Trackpad", rooms: 1000};
        } else {
            this.settings = JSON.parse(this.settings);
            this.controller = this.settings.controller == "Keyboard" ? new Keyboard() : new Trackpad();
            this.map = new GameMap(10 ** this.settings.rooms);
        }
        this.factor = 256;
        this.target = Scoreboard;
        this.start = new Date();

        this.current_room = this.map.start;
        this.player = {x: this.current_room.x, y: this.current_room.y};

    }
    
    /**
     * Returns the score of the game instance as a formatted object containing:
     *      controller  - The controller used
     *      rooms       - How many rooms were generated
     *      score       - The time in s that it took to find the exit
     * 
     * @returns the score object
     */
    get_score() {
        if (!this.end) {
            return -1;
        }

        const time = new Date();

        return {controller : this.settings.controller, rooms : 10 ** this.settings.rooms, score : (time - this.start) / 1000};
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
        this.move();
        this.#render(c, ctx);
    }

    move() {
        let vector = this.controller.get_adjusted_vector(this.factor / 4);

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