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
        this.x = this.center;
        this.y = this.center;

        let track_mouse = (event) => {
            this.get_pos(event);
            this.render();
        };
        this.c.addEventListener("pointerdown", (event) => {
            track_mouse(event);
            this.c.addEventListener("mousemove", track_mouse)
        });

        this.c.addEventListener("pointerup", () => {
            this.c.removeEventListener("mousemove", track_mouse);
            this.x = this.center;
            this.y = this.center;
            this.render();
        });

        this.render();
    }

    get_pos(event) {
        let x = event.x - this.c.offsetLeft;
        let y = event.y - this.c.offsetTop;
        if (Math.sqrt((this.center - x) ** 2 + (this.center - y) ** 2) > this.radius) {
            
        }
        this.x = x;
        this.y = y
        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);

        // cross centered at middle
        // outer circle boundary
        this.ctx.beginPath();
        this.ctx.arc(this.center, this.center, this.center - 4, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
        // circle at this.x, this.y, or touching boudary at maximum
        USR_CRCL_RADIUS = 25
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, USR_CRCL_RADIUS, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fillStyle = "rgba(78, 234, 255, 0.5)"; 
        this.ctx.fill();
    }
}