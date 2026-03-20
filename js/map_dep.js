/**
 * Author : Alexander Perlock
 * MACID : perlocka
 * Date Created : 11 03 26
 * Date Modified : 11 03 26
 * 
 * Houses auto generative map creation
 * 
 * DEPRICATED due to disfunctionality
 */
class Room {
    constructor(pos, connections) {
        this.pos = pos;
        this.connections = connections;
        this._expansion = 1;
    }

    get neighbors() {
        let out = [];

        for (let i = 0; i < 4; i++) {
            if (this.connections & (2 ** i)) {
                out[i] = [this.pos[0] + ((i - 1) % 2), this.pos[1] + Math.floor(Math.sin(i * Math.PI / 2))];
            }
        }

        return out;
        // return [
        //     this.connections & 1 ? [this.pos[0] - 1, this.pos[1]] : [null, null], // N
        //     this.connections & 2 ? [this.pos[0], this.pos[1] + 1] : [null, null], // E
        //     this.connections & 4 ? [this.pos[0] + 1, this.pos[1]] : [null, null], // S
        //     this.connections & 8 ? [this.pos[0], this.pos[0] - 1] : [null, null]  // W
        // ];
    }

    set expansion(bool) {
        this._expansion = bool;
    }

    get expansion() {
        return this._expansion;
    }

    draw(ctx) {
        console.log(this);
        ctx.beginPath();
        ctx.rect(this.pos[0] * 25, this.pos[1] * 25, this.pos[0] * 25 + 25, this.pos[1] * 25 + 25)

        ctx.closePath();

        ctx.fillStyle = "grey";
        ctx.fill();

        // ctx.translate(x, y);
    }
}

class GameMap {
    #prob = 0.5;

    constructor() {
        origin = new Room([0, 0], 15);
        this.map = new Array(origin);
        this.invalid = new Map();

        this.previous_nodes = new Array(origin);
        // console.log(this.map)
        this.previous_nodes = this.#generate();
        console.log(this.map)
    }

    // get #previous_nodes() {
    //     let out = [];
    //     for (let i = 0; i < this.map.length; i++) {
    //         if (this.map[i].expansion) {
    //             out.push(this.map[i]);
    //         }
    //     }

    //     return out;
    // }

    #generate() {
        console.log("AA", this.previous_nodes);
        const MAX_NODES = 100;
        let i = this.map.length;
        while (i < MAX_NODES && this.previous_nodes.at(-1)) {
            const prev = this.previous_nodes.at(-1);
            prev.expansion = 0;
            this.previous_nodes.pop();
            // if (!prev) {
            //     console.log(previous_nodes, i)
            //     return;
            // }
            // console.log(prev);
            const neighbors = prev.neighbors;
            for (const pos in neighbors) {
                // this.invalid.set(neighbors[pos].join(","), 1);
                const connections = this.#generate_connections(neighbors[pos]);
                const node = new Room(neighbors[pos], connections);
                this.map.push(node);
                i++;

                if (connections) {
                    // console.log("A", this.previous_nodes);
                    this.previous_nodes.push(node);
                    // console.log("B", this.previous_nodes);
                }
            }
            // console.log(previous_nodes);
            // console.log(this.invalid)

            // if (prev === this.previous_nodes.at(-1)) {
            //     // console.log(prev.expansion);
            //     prev.expansion = 0;
            //     // previous_nodes.at(-1).expansion = 0;
            //     // this.previous_nodes.pop();
            // }


        }
        console.log(i);

        for (const node in this.previous_nodes) {
            this.previous_nodes[node].expansion = 1;
        }

        return this.previous_nodes;
    }

    #generate_connections(pos) {
        // do only one?

        let out = 0;
        for (let i = 0; i < 4; i++) {
            if (this.#rand()) { continue }
            let newPos = [pos[0] + ((i - 1) % 2), pos[1] + Math.floor(Math.sin(i * Math.PI / 2))];
            if (!this.invalid.get(newPos.join(","))) {
                out += 2 ** i;
                this.invalid.set(newPos.join(","), 1);
            }
        }

        return out;
    }

    #rand() {
        return Math.floor(Math.random() / this.#prob);
        // will be true 1/prob : 1 times, thus canceling the action
        //       - false  prob : 1 times, thus continuing the action
    }

    draw(ctx) {
        this.map.forEach(room => {
            room.draw(ctx);
            
        });
    }
}



// class Map {
//     constructor() {
//         this.directions = {
//             north: 1,
//             east: 2,
//             south: 4,
//             west: 8
//         };

//         this.map = {};
//         this.max_nodes = 100;
//         this.node_prob = 0.5;
//         this.preExistingNode_prob = 0.05;

//         this.generate([0, 0]);
//         // console.log(this.map);
//     }

//     nodes() {
//         return Object.keys(this.map).length;
//     }

//     #rand(prob = this.node_prob) {
//         return !Math.floor(Math.random() / (prob == 0 ? this.prob : prob));
//     }

//     #direction_to_pos(base_pos, direction) {
//         return [base_pos[0] + (direction == "east" ? 1 : direction == "west" ? -1 : 0),
//                 base_pos[1] + (direction == "south" ? 1 : direction == "north" ? -1 : 0)];
//     }

//     generate(pos) {
//         this.#new_node(pos);
//         let connections = 0;
//         let direc;
//         for (direc of Object.keys(this.directions)) {
//             if (this.nodes() >= this.max_nodes) {
//                 break;
//             }
//             let new_pos = this.#direction_to_pos(pos, direc);
//             if (this.map[this.#node_string(new_pos)] && this.#rand(this.preExistingNode_prob)) {
//                 connections += this.directions[direc];
//                 this.#add_to_node(this.directions[direc]);
//             } else if (this.#rand(this.node_prob)) {
//                 connections += this.directions[direc];
//                 this.generate(new_pos);
//             }
//         }
//         this.#update_node(pos, connections);
//     }

//     #node_string(pos) {
//         return pos.join(",");
//     }

//     #new_node(pos) {
//         this.map[this.#node_string(pos)] = 0;
//     }

//     #update_node(pos, connections) {
//         this.map[this.#node_string(pos)] = connections;
//     }

//     #add_to_node(pos, connection) {
//         let current = this.map[this.#node_string(pos)];
//         if (! (current & connection)) {
//             this.map[this.#node_string(pos)] += connection;
//         }
//     }

// }