class Bird {
    constructor() {
        this.x = 50;
        this.y = height / 2;
        this.gravity = 0.6;
        this.lift = -15;
        this.velocity = 0;
        this.dead = false;
        this.weights = [random(-5, 5), random(-5, 5), random(-5, 5), random(-5, 5)];
        this.color = 255;
    }

    draw() {
        if (!this.dead) {
            fill(this.color);
            //line(this.x, this.y, pipes[0].x+30, pipes[0].top + height / 16)
            ellipse(this.x, this.y, 25, 25);
        }
    }

    up() {
        this.velocity += this.lift;
    }

    update() {
        if (this.dead) {
            if (this.x > -100)
                this.x -= 2;
        } else {
            this.velocity += this.gravity;
            this.velocity *= 0.9;
            this.y += this.velocity;
            if (this.y > height) {
                this.y = height;
                this.velocity = 0;
            }
            if (this.y < 0) {
                this.y = 0;
                this.velocity = 0;
            }
            if (this.hits(pipes[0]) || this.hitsBorder()) {
                this.dead = true;
            } else {
                this.decide();
            }
        }
    }

    decide() {
        let inputs = [
            dist(this.x, this.y, this.x, pipes[0].top + height / 16),
            this.y - pipes[0].top,
            this.y - pipes[0].top + height / 8,
            this.velocity
                ];
        let output = (this.weights[0] * inputs[0] + this.weights[1] * inputs[1] + this.weights[2] * inputs[2] + this.weights[3] * inputs[3]);
        if (output > 0.5) {
            this.up();
        }
    }

    score() {
        return -dist(this.x, this.y, pipes[0].x+10, pipes[0].top + height / 16);
    }

    hitsBorder() {
        if (this.y + 12.5 >= height || this.y - 12.5 <= 0) {
            return true;
        }
        return false;
    }

    hits(pipe) {
        if (this.x + 12.5 >= pipe.x && this.x - 12.5 <= pipe.x) {
            if (this.y + 12.5 >= height - pipe.bottom || this.y <= pipe.top + 12.5) {
                return true;
            }
        }
        return false;
    }

    mutate(weights) {
        let newbird = new Bird();
        for (let i = 0; i < weights.length; i++) {
            if (random(0, 1) < 0.1) {
                newbird.weights[i] = random(-5, 5);
            } else {
                newbird.weights[i] = weights[i];
            }
        }
        return newbird;
    }
}