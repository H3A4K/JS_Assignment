/**
 * Author : Alexander Perlock
 * MACID : perlocka
 * Date Created : 02 03 26
 * Date Modified : 02 03 26
 * 
 * Handles functionality on page load
 */

window.addEventListener("load", () => {
    const c = document.getElementById("banner");
    const ctx = banner.getContext("2d");
    function adjust_view_port() {
        // c.width = window.innerWidth;
        // c.height = window.innerHeight;
        c.width = screen.width;
        c.height = screen.height;
        draw();
    }

    // controler = new Trackpad("controls");
    controler = new Keyboard();

    ball = {
        x: 100, y: 100, radius: 10
    }

    function update() {
        let vector = controler.get_adjusted_vector();
        ball.x += vector.x;
        ball.y += vector.y;
        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, c.width, c.height)
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "red";
        ctx.fill();
    }

    setInterval(update, 1);

    // function add_click() {
    //     banner.addEventListener("click", function (event) {
    //         move_to_game();
    //         // let x = event.pageX - this.offsetLeft;
    //         // let y = event.pageY - this.offsetTop;
    //     });
    // }

    // function move_to_game() {
    //     // Nothing here yet
    // }
    window.addEventListener("resize", adjust_view_port);
    adjust_view_port();
});

