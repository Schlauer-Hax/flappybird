class Pipe {

    constructor (offset) {
        this.x = width+offset;
        this.top = random(height/4, height/1.25);
        this.bottom = height - this.top - height/8;
    }

    draw() {
        stroke(0);
        fill('lightgreen');
        rect(this.x, 0, 25, this.top);
        rect(this.x, height, 25, -this.bottom);
    }
}