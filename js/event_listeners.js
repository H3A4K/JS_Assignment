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

    let activeInstance =  new Splash();



    function change_instance(target) {
        if (!target) { return }

        // gets relavent information
        // switch (true) {
        //     case activeInstance instanceof Splash:
        //     case activeInstance instanceof Start:
        //     case activeInstance instanceof Game:
        //         break;
        //     case activeInstance instanceof Setup:
        //         // console.log(controller);
        //         break;
        // }

        // changes to proper page
        switch (target) {
            case Splash: case Setup: case Start:
                activeInstance = new target();
                break;
            case Game:
                let controller_string = JSON.parse(localStorage.settings).controller;
                let controller = controller_string == "Keyboard" ? new Keyboard() : new Trackpad();
                activeInstance = new target(controller);
                break;
        }
        console.log(activeInstance)
    }

    setInterval(() => {
        activeInstance.update(c, ctx);
        if (activeInstance.end) {
            change_instance(activeInstance.get_target(c, ctx));
        }
    }, 1);

    
    // Allows for resizing the canvas
    function adjust_view_port() {
        c.width = screen.width * 1;
        c.height = screen.height * 1;

        activeInstance.update(c, ctx);
    }
    window.addEventListener("resize", adjust_view_port);
    adjust_view_port();

});

