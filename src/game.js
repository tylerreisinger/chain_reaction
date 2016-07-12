var game = null;

var random_int = function(min, max) {
    return Math.floor(Math.random() * (max-min+1)) + min;
};

function GameTimer(start_time) {
    var start_time = start_time;
    var frame_time = start_time;
    var last_frame_time = start_time;

    this.new_frame = function(ts) {
        last_frame_time = frame_time;
        frame_time = ts;
    };

    this.elapsed_ms = function() {
        return frame_time - last_frame_time;
    };
};

function Vec2d(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

function Node(rank) {
    this.rank = rank;
    this.color = null;

    this.merge_with = function(node) {
        return new Node(this.rank + node.rank);
    };
};

function GameState(nodes) {
    this.MAX_NUM_NODES = 15;
    this.nodes = nodes;

    this.get_nodes = function() {
        return nodes;
    };

    this.node_count = function() {
        return this.nodes.length;
    };
}

function GameStateRenderer(origin, radius, offset_angle) {
    this.origin = origin;
    this.radius = radius;
    this.offset_angle = offset_angle; 
    this.node_radius = 12;

    this.render = function(ctx, game_state) {
        var node_count = game_state.node_count();

        if(node_count == 0) {
            return;
        }

        var d_angle = (Math.PI*2.0) / node_count;

        ctx.save();
        ctx.translate(this.origin.x, this.origin.y);
        ctx.rotate(this.offset_angle);
        for(var i = 0; i < node_count; ++i) {
            var angle = this.offset_angle + d_angle*i;
            if(angle > 2*Math.PI) {
                angle -= 2*Math.PI;
            }

            ctx.beginPath();
            ctx.arc(0, -this.radius, this.node_radius, 0.0, 2.0*Math.PI, false);
            ctx.fill();

            ctx.rotate(d_angle);
        }
        ctx.restore();
    }
}

var build_random_initial_state = function() {
    var num_nodes = random_int(3, 6);
    var nodes = [];

    for(var i = 0; i < num_nodes; ++i) {
        var rank = random_int(1, 3);
        var node = new Node(rank);
        nodes.push(node);
    }

    return nodes;
}

function Game() {
    var width = 800;
    var height = 600;
    var game_time = new GameTimer(performance.now());
    var game_state = null;
    this.renderer = null;

    this.run = function() {
        initialize();
        window.requestAnimationFrame(pre_step);
    };
    
    var pre_step = function(time) {
        game_time.new_frame(time);
        window.requestAnimationFrame(step);
    };

    var step = function(time) {
        var canvas = document.getElementById("game_canvas");
        var ctx = canvas.getContext("2d");
        game_time.new_frame(time)

        update(game_time);
        render(ctx);
        window.requestAnimationFrame(step);
    };

    var initialize = function() {
        game_state = new GameState(build_random_initial_state());
        this.renderer = new GameStateRenderer(new Vec2d(width/2, height/2), 200, Math.PI/2.0);
        console.log(game_state);
    };

    var update = function(game_time) {
        
    };

    var render = function(ctx) {
        ctx.clearRect(0, 0, width, height);
        this.renderer.render(ctx, game_state);
    };
}

function on_start() {
    console.log("Starting...");
    game = new Game();
    game.run();
}

window.onload = function() {
    on_start();
}
