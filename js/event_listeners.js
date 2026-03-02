/**
 * Author : Alexander Perlock
 * MACID : perlocka
 * Date Created : 02 03 26
 * Date Modified : 02 03 26
 * 
 * Handles functionality on page load
 */

window.addEventListener("load", () => {
    // const banner = document.getElementById("banner");
    // const ctx_banner = banner.getContext("2d");

    trackpad = new Trackpad("banner");

    function add_click() {
        banner.addEventListener("click", function (event) {
            move_to_game();
            // let x = event.pageX - this.offsetLeft;
            // let y = event.pageY - this.offsetTop;
        });
    }

    function move_to_game() {
        // Nothing here yet
    }

});

