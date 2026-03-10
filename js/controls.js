/**
 * Author : Alexander Perlock
 * MACID : perlocka
 * Date Created : 23 02 26
 * Date Modified : 23 02 26
 * 
 * Houses the class and methods for moving player objects
 */

class Trackpad {
    /**
     * Creates a mobile + desktop canvas element on a parent element
     * 
     * @param {String} parent_ID the HTML id of the element that should house the trackpad
     */
    constructor(parent_ID) {
        // create canvas element
        const p = document.getElementById(parent_ID);
        this.c = document.createElement("canvas");
        this.c.width = 300;
        this.c.height = 300;
        this.c.classList.add("trackpad");
        p.appendChild(this.c);

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
        
        let colour = "rgba(150, 150, 150, 0.5)";
        this.ctx.strokeStyle = colour;
        this.ctx.fillStyle = colour;

        const track_mouse = (event) => {
            this.#get_pos(event);
            this.render();
        };
        const start = (event) => {
            this.c.addEventListener("mousemove", track_mouse);
            this.c.addEventListener("touchmove", track_mouse);
            track_mouse(event);
        }
        const end = () => {
            this.c.removeEventListener("mousemove", track_mouse);
            this.c.removeEventListener("touchmove", track_mouse);  
            this.x = 0;
            this.y = 0;
            this.render();
        }

        // browser support
        this.c.addEventListener("pointerdown", start);
        this.c.addEventListener("pointerup", end);

        // mobile support 
        this.c.addEventListener("touchend", end);

        // leaving element
        this.c.addEventListener("mouseleave", end);

        this.render();
    }


    get_adjusted_vector() {
        let x = this.x / this.extrema;
        let y = this.y / this.extrema;
        let mult = (x ** 2 + y ** 2) ** (1 / 2);
        x *= mult; y *= mult;
        return {x:x, y:y};
    }

    #get_pos(event) {
        let x = 0; let y = 0    ;
        if (event.touches) {
            let touch = event.touches[0];
            x = touch.clientX;
            y = touch.clientY;
        } else {
            x = event.x;
            y = event.y;
        }
        x -= this.c.offsetLeft + this.center;
        y -= this.c.offsetTop + this.center;

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
        // this.ctx.strokeStyle = "rgba(150, 150, 150, 0.5)";
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
        // this.ctx.strokeStyle = this.colour;
        this.ctx.stroke();

        // circle at this.x, this.y, or touching boudary at maximum
        this.ctx.beginPath();
        this.ctx.arc(this.x + this.center, this.y + this.center, this.user_radius, 0, 2 * Math.PI);
        this.ctx.closePath();
        // this.ctx.fillStyle = this.colour;
        this.ctx.fill();
    }
}

class Keyboard {
    constructor() {
        this.keysPressed = {};
        this.v_x = 0;
        this.v_y = 0;
        document.addEventListener("keydown", (event) => {
            this.keysPressed[event.code] = true;
            this.#inputs();
        });

        document.addEventListener("keyup", (event) => {
            delete this.keysPressed[event.code];
            this.#inputs();
        })
    }

    #inputs() {
        this.v_x = 0;
        this.v_y = 0;
        let factor = 1;
        // console.log(this.keysPressed);
        Object.keys(this.keysPressed).forEach(key => {
            switch (key) {
                case "KeyW": // Up
                    this.v_y -= 1;
                    break;
                case "KeyA": // Left
                    this.v_x -= 1;
                    break;
                case "KeyS": // Down
                    this.v_y += 1;
                    break;
                case "KeyD": // Right
                    this.v_x += 1;
                    break;
                case "ShiftLeft": // Slow
                    factor = 0.5;
            }
        });
        if (Math.abs(this.v_x) + Math.abs(this.v_y) > 1) {
            this.v_x /= Math.sqrt(2);
            this.v_y /= Math.sqrt(2);
        }
        this.v_x *= factor;
        this.v_y *= factor;
    }

    get_adjusted_vector() {
        return {x:this.v_x, y:this.v_y};
    }
}