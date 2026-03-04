/**
 * Author : Alexander Perlock
 * MACID : perlocka
 * Date Created : 23 02 26
 * Date Modified : 23 02 26
 * 
 * Houses the class and methods for creating a trackpad
 */


/**
 * Function description
 * 
 * @param {type} input
 * 
 * @returns output
 */
class Trackpad {
    constructor(canvas_ID) {
        this.c = document.getElementById(canvas_ID);
        this.c.classList.add("trackpad");
        this.ctx = this.c.getContext("2d");
        this.center = Math.min(this.c.width, this.c.height) / 2; // makes this a square
        this.user_radius = 25;
        this.border = 5;
        this.extrema = this.center - this.border - this.user_radius;
        this.grid = {
            minor_radius : this.center - 30,
            major_radius : 30
        }
        this.x = 0;
        this.y = 0;

        let track_mouse = (event) => {
            this.#get_pos(event);
            this.render();
        };
        this.c.addEventListener("pointerdown", (event) => {
            track_mouse(event);
            this.c.addEventListener("mousemove", track_mouse)
        });

        this.c.addEventListener("pointerup", () => {
            this.c.removeEventListener("mousemove", track_mouse);
            this.x = 0;
            this.y = 0;
            this.render();
        });

        this.c.addEventListener("mouseleave", () => {
            this.c.removeEventListener("mousemove", track_mouse);
            this.x = 0;
            this.y = 0;
            this.render();
        });

        this.render();
    }

    get_adjusted_vector() {
        let x = this.x / this.extrema;
        let y = this.y / this.extrema;
        let mult = (x ** 2 + y ** 2) ** (1 / 2);
        x *= mult; y *= mult;
        return [x, y];
    }

    #get_pos(event) {
        let x = event.x - this.c.offsetLeft - this.center;
        let y = event.y - this.c.offsetTop - this.center;

        let dist = (x ** 2 + y ** 2) ** (1 / 2);
        if (dist > this.extrema) {
            let mult = this.extrema / dist;
            x *= mult;
            y *= mult;
        }

        this.x = x;
        this.y = y;
    }

    #draw_cross() {
        this.ctx.beginPath();

        this.ctx.moveTo(this.center - this.grid.major_radius, this.center);
        this.ctx.lineTo(this.center - this.grid.minor_radius, this.center);

        this.ctx.moveTo(this.center + this.grid.major_radius, this.center);
        this.ctx.lineTo(this.center + this.grid.minor_radius, this.center);

        this.ctx.moveTo(this.center, this.center - this.grid.major_radius);
        this.ctx.lineTo(this.center, this.center - this.grid.minor_radius);

        this.ctx.moveTo(this.center, this.center + this.grid.major_radius);
        this.ctx.lineTo(this.center, this.center + this.grid.minor_radius);

        this.ctx.closePath();

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "rgba(150, 150, 150, 0.5)";
        this.ctx.stroke();
    }

    render() {
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);

        // cross centered at middle
        this.#draw_cross();

        // outer circle boundary
        this.ctx.beginPath();
        this.ctx.arc(this.center, this.center, this.center - 4, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.lineWidth = this.border;
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();

        // circle at this.x, this.y, or touching boudary at maximum
        this.ctx.beginPath();
        this.ctx.arc(this.x + this.center, this.y + this.center, this.user_radius, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fillStyle = "rgba(150, 150, 150, 0.5)";
        this.ctx.fill();
    }
}