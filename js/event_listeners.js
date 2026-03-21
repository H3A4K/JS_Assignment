/**
 * Author : Alexander Perlock
 * MACID : perlocka
 * Date Created : 02 03 26
 * Date Modified : 21 03 26
 * 
 * Handles functionality on page load
 */
window.addEventListener("load", () => {
    const c = document.getElementById("banner");
    const ctx = c.getContext("2d");

    let activeInstance =  new Splash(c);

    // Handles returning to the main menu by clicking the exit element
    const exit = document.getElementById("exit");
    exit.addEventListener("mousedown", () => {
        activeInstance.clear(c, ctx); 
        change_instance(Start);
    });

    /**
     * Adds a game score to local storage
     * 
     * @param s the new score
     */
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

    /**
     * Swaps from the current page to target
     * 
     * @param target The page to be swapped to
     */
    function change_instance(target) {
        if (!target) { return }
        latest_score = {score : null};
        switch (true) {
            case activeInstance instanceof Maze:
                latest_score = activeInstance.get_score();
                add_to_score(latest_score);
                break;
        }
        switch (target) {
            case Splash: 
                c.classList.remove("hidden");
                activeInstance = new target(c);
                break;
            case Maze: 
                c.classList.remove("hidden");
                activeInstance = new target();
                break;
            case Settings: case Start: case Info:
                c.classList.add("hidden");
                activeInstance = new target();
                break;
            case Scoreboard:
                c.classList.add("hidden");
                activeInstance = new target(latest_score.score);
                break;
        }
    }

    // Main update loop
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

