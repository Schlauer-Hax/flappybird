let pipes = [];
let birds = [];

// [-0.10769436057674131, 0.5020725721278287, -0.22381380924331395, 0.8391195485821452]

function setup() {
  createCanvas(800, 600);
  start();
  // birds[0].weights = [-0.10769436057674131, 0.5020725721278287, -0.22381380924331395, 0.8391195485821452]; birds[1].weights = [-0.39230240684732554, 1.5149016789049954, -0.6796751374269032, 2.782210299941119]
}

function start() {
  for (let i = 0; i < 5; i++) {
    pipes.push(new Pipe(i * width / 4));
  }
  for (let i = 0; i < 250; i++) {
    birds.push(new Bird());
  }
}

onkeyup = function (event) {
  if (event.keyCode == 32) {
    for (let i = 0; i < birds.length; i++) {
      birds[i].up();
    }
  }
}

let bestgoalcount = 0;
let goalcount = 0;
let generation = 0;
function draw() {
  background(220);
  birds.forEach(bird => {
    bird.update()
    bird.color = 255;
    bird.draw();
  });
  const score = birds.map(bird => bird.score()).sort((a, b) => b - a)[0];
  const bestbird = birds.filter(bird => bird.score() == score)[0];
  bestbird.color = 'red';
  birds[0].color = 'yellow';
  bestbird.draw();
  birds[0].draw();
  if (birds.every(bird => bird.dead)) {
    generation++;
    if (goalcount > bestgoalcount) {
      bestgoalcount = goalcount;
    }
    goalcount = 0;
    mutate();
    return;
  }
  pipes.forEach(pipe => pipe.draw());
  if (pipes[0] && pipes[0].x < 50 - 25) {
    pipes.shift();
    pipes.push(new Pipe(50 + width / 4));
    goalcount++;
  }
  pipes.forEach(pipe => pipe.x -= 2);

  fill(0);
  textSize(32);
  text(`Score: ${goalcount}`, 10, 30);
  text(`Best Score: ${bestgoalcount}`, 10, 60);
  text(`Generation: ${generation}`, 10, 90);
  text(`Living Birds: ${birds.filter(bird => !bird.dead).length}`, 10, 120);
  fill(255);

  strokeWeight(5)
  fill('yellow');
  text('Last Generation', width-300, 30);
  fill('red')
  text('Current Generation', width-300, 280);
  fill(255);
  strokeWeight(1)
  drawNetwork(birds[0], 50);
  drawNetwork(bestbird, 300);

}

function drawNetwork(bird, yoffset) {
  textSize(16)

  bird.weights.forEach((weight, i) => {
    strokeWeight((weight + 10) * 0.5);
    line(width - 50, 100+yoffset, width - 200, 25 + (i * 50)+yoffset);
    strokeWeight(5);
    text(Math.round(weight * 100) / 100, width - 150, 25 + (i * 50) + yoffset);
  });

  const inputs = [
    dist(bird.x, bird.y, bird.x, pipes[0].top + height / 16),
    bird.y - pipes[0].top,
    bird.y - pipes[0].top + height / 8,
    bird.velocity
  ];
  inputs.forEach((value, i) => {
    text(Math.round(value * 100) / 100, width - 300, 25 + (i * 50) + yoffset);
  });

  strokeWeight(1)
  ellipse(width - 50, 100+yoffset, 25, 25);
  ellipse(width - 200, 25+yoffset, 25, 25);
  ellipse(width - 200, 75+yoffset, 25, 25);
  ellipse(width - 200, 125+yoffset, 25, 25);
  ellipse(width - 200, 175+yoffset, 25, 25);
}

function mutate() {
  const score = birds.map(bird => bird.score()).sort((a, b) => b - a)[0];
  const bestbird = birds.filter(bird => bird.score() == score)[0];
  const bestweights = Array.from(bestbird.weights);
  console.log(bestweights)
  pipes = [];
  birds = [];
  start();

  birds = birds.map(bird => bird.mutate(bestweights));
  birds[0].weights = bestweights;
}