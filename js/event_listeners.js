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

    const exit = document.getElementById("exit");
    exit.addEventListener("mousedown", () => {
        activeInstance.clear(c, ctx); 
        change_instance(Start);
    });

    function add_to_score(s) {
        if (s === -1) { return }
        let scores = localStorage.scores;
        if (!scores) { 
            scores = [] 
        } else {
            scores = JSON.parse(scores);
        }
        scores.push(s);
        localStorage.scores = JSON.stringify(scores);
    }

    function change_instance(target) {
        if (!target) { return }
        latest_score = null;
        switch (true) {
            case activeInstance instanceof Game:
                latest_score = activeInstance.get_score();
                add_to_score(latest_score);
                break;
        }

        console.log(activeInstance, activeInstance instanceof Game, latest_score);

        switch (target) {
            case Splash: 
                c.classList.remove("hidden");
                activeInstance = new target();
                break;
            case Setup: case Start:
                c.classList.add("hidden");
                activeInstance = new target();
                break;
            case Game:
                c.classList.remove("hidden");
                let ls = localStorage.settings;
                let controller_string;
                if (!ls) {
                    controller_string = "Trackpad";
                } else {
                    controller_string = JSON.parse(localStorage.settings).controller;
                }
                let controller = controller_string == "Keyboard" ? new Keyboard() : new Trackpad();
                activeInstance = new target(controller);
                break;
            case Scoreboard:
                c.classList.add("hidden");
                activeInstance = new target(latest_score);
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
        c.height = screen.height * 0.9;

        activeInstance.update(c, ctx);
    }
    window.addEventListener("resize", adjust_view_port);
    adjust_view_port();

});

