/**
 * Author : Alexander Perlock
 * MACID : perlocka
 * Date Created : 11 03 26
 * Date Modified : 11 03 26
 * 
 * Houses auto generative map creation
 */
class Room {
    constructor(x, y, exits) {
        this.x = x;
        this.y = y;
        this.exits = exits;
        // 0001 -> N
        // 0010 -> E
        // 0100 -> S
        // 1000 -> W
    }

    get adjacent() {
        const out = [];
        for (let i = 0; i < 4; i ++) {
            if (this.exits & 1 << i) {
                out[i] = [this.x - ((i - 2) % 2), this.y + ((i - 1) % 2)]
            }
        }
        //  0  1  2  3  i
        //  1  0 -1  0  y
        //  0  1  0 -1  x
        return out;
    }

    pos_by_direction(direction) {
        let index = Math.log2(direction);
        return pos_by_index(index);
    }

    pos_by_index(index) {
        return [this.x - ((index - 2) % 2), this.y + ((index - 1) % 2)];
    }

    add(exit) {
        let n = this.exits | exit;
        if (n >= 0 && n <= 15) {
            this.exits = n;
        }
    }

    subtract(exit) {
        let n = this.exits & (~exit);
        if (n >= 0 && n <= 15) {
            this.exits = n;
        }
    }

    draw(ctx, factor, colour = "rgba(160, 160, 160, 0.5)") {
        let half = factor / 2;
        let space_between = factor / 16;

        ctx.fillStyle = colour;
        ctx.fillRect(
            this.x * factor - half, 
            this.y * factor - half, 
            factor, factor
        );

        for (let i = 0; i < 4; i++) {
            if (!(1 << i & this.exits)) {
                let x = (n) => factor * (this.x + 1/2 * (Math.abs(n - 1.5) < 1 ? 1 : -1));
                let y = (n) => factor * (this.y + 1/2 * (n > 1 ? 1 : -1));
                ctx.beginPath();
                ctx.moveTo(x(i), y(i));
                ctx.lineTo(x((i + 1) % 4), y((i + 1) % 4));
                ctx.closePath();
                ctx.strokeStyle = "rgba(60, 60, 60, 1)";
                ctx.lineWidth = space_between / 2;
                ctx.stroke();
            }
        }
    }

}


class GameMap {
    constructor(num_rooms = 100) {
        this.rooms = new Array(new Room(0, 0, 15));
        this.possible_rooms = [...this.rooms[0].adjacent];

        this.invalid = new Set();
        this.invalid.add("0,0");

        this.start; this.end;

        // make a room
        // generate random directions
            // pick a random room to go from
            // generate more random directions

        this.generate(num_rooms);
    }

    generate(num_rooms) {
        while (this.rooms.length < num_rooms && this.possible_rooms.length > 0) {
            let ind = Math.floor(Math.random() * this.possible_rooms.length);
            let temp_pos = this.possible_rooms[ind];

            if (temp_pos === null || this.invalid.has(temp_pos.join(","))) {
                this.remove_index(this.possible_rooms, ind);
                continue;
            }

            let exits = 0;
            let available = this.available(temp_pos);
            
            const num = Math.floor(Math.random() * (available.length - 1)) + 1;
            for (let i = 0; i < num; i ++) {
                let index = Math.floor(Math.random() * available.length);
                this.possible_rooms.push(available[index][0]);
                exits += available[index][1];
                this.remove_index(available, index);
            }

            this.add_room(temp_pos, exits);

            this.remove_index(this.possible_rooms, ind);
        }

        this.purge_possible_rooms();

        this.add_room(this.possible_rooms[0], 0);
        this.remove_index(this.possible_rooms, 0);

        this.add_room(this.possible_rooms[this.possible_rooms.length - 1], 0);
        this.remove_index(this.possible_rooms, this.possible_rooms.length - 1);

        this.remove_unused_exits();
    }

    add_room(pos, exits) {
        this.invalid.add(pos.join(","));
        this.rooms.push(new Room(pos[0], pos[1], exits));
    }

    remove_index(arr, index) {
        arr.splice(index, 1);
    }

    available(pos) {
        const out = []
        for (let i = 0; i < 4; i ++) {
            let potential = [pos[0] - ((i - 2) % 2), pos[1] + ((i - 1) % 2)];
            let key = potential.join(",");
            if (!this.invalid.has(key) || this.possible_rooms.includes(potential)) {
                out.push([potential, 1 << i]);
            }
        }
        return out;
    }

    purge_possible_rooms() {
        let rm_ind = [];
        this.possible_rooms.forEach((room, index) => {
            if (this.invalid.has(room.join(",")) || this.rooms.find(r => r.x === room[0] && r.y === room[1]) !== undefined) {
                rm_ind.push(index);
            }
        });

        rm_ind.forEach(ind => this.remove_index(this.possible_rooms, ind));
    }

    remove_unused_exits() {
        this.rooms.forEach(room => {
            for (let i = 0; i < 4; i ++) {
                if (!(room.exits & 1 << i)) { continue }

                const adj_pos = room.pos_by_index(i);
                const adj = this.rooms.find(r => r.x === adj_pos[0] && r.y === adj_pos[1]);
                if (adj === undefined) {
                    room.subtract(1 << i);
                }

                const adj_dir = 1 << (i + 2) % 4;

                if (!this.invalid.has(adj_pos.join(","))) {
                    room.subtract(1 << i);
                } else {
                    adj.add(adj_dir);
                }
            }
        })
    }

    get start() {
        return this.rooms[this.rooms.length - 2];
    }

    get end() {
        return this.rooms[this.rooms.length - 1];
    }

    draw(ctx, factor) {
        this.rooms.slice(0, this.rooms.length - 2).forEach(room => room.draw(ctx, factor));
        this.rooms[this.rooms.length - 2].draw(ctx, factor, "rgba(255, 255, 255, 1)");
        this.rooms[this.rooms.length - 1].draw(ctx, factor, "rgba(255, 215, 0, 1)");
    }
}