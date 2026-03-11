/**
 * Author : Alexander Perlock
 * MACID : perlocka
 * Date Created : 02 03 26
 * Date Modified : 09 03 26
 * 
 * Handles functionality on page load
 */
window.addEventListener("load", () => {
    const c = document.getElementById("banner");
    const ctx = c.getContext("2d");
    let controller = null;

    let activeInstance = new Splash(c, ctx);

    // let controler = new Trackpad("controls");
    // let controler = new Keyboard();

    function change_instance(target) {
        if (!target) { return }

        // gets relavent information
        switch (true) {
            case activeInstance instanceof Splash:
            case activeInstance instanceof Game:
                break;
            case activeInstance instanceof Setup:
                controller = new activeInstance.activeFocus();
                console.log(controller);
                break;
        }

        // changes to proper page
        switch (target) {
            case Splash: case Setup:
                activeInstance = new target(c, ctx);
                break;
            case Game:
                activeInstance = new target(c, ctx, controller);
                break;
        }
    }

    setInterval(() => {
        activeInstance.update();
        if (activeInstance.end) {
            change_instance(activeInstance.get_target());
        }
    }, 1);
    
    // Allows for resizing the canvas
    function adjust_view_port() {
        c.width = screen.width;
        c.height = screen.height;
        console.log(c.width, c.height)
        // draw();
    }
    window.addEventListener("resize", adjust_view_port);
    adjust_view_port();
});


    // ball = {
    //     x: 100, y: 100, radius: 10
    // }

    // function update() {
    //     let vector = controler.get_adjusted_vector();
    //     ball.x += vector.x;
    //     ball.y += vector.y;
    //     draw();
    // }



    // function draw() {
    //     ctx.clearRect(0, 0, c.width, c.height)
    //     ctx.beginPath();
    //     ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    //     ctx.closePath();
    //     ctx.fillStyle = "red";
    //     ctx.fill();
    // }