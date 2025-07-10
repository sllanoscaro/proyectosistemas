let maze = [
    [0, 0, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 2]
];

let qTable = Array(5).fill().map(() => Array(5).fill().map(() => Array(4).fill(0)));
let state = [0, 0];
let actions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up
let learningRate = 0.20;
let explorationRate = 0.20;
let discountFactor = 0.9;
let episodeCount = 115;
let stepCount = 100;

function setup() {
    let canvasWidth = document.getElementById('mazeCanvas').offsetWidth;
    let canvas = createCanvas(canvasWidth, canvasWidth);
    canvas.parent('mazeCanvas');
    drawMaze();
}

function drawMaze() {
    background(255);
    let cellSize = width / 5;
    for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        let x = j * cellSize;
        let y = i * cellSize;
            if (maze[i][j] === 1) {
                fill(0);
            } else if (maze[i][j] === 2) {
                fill(0, 255, 0);
            } else {
                fill(255);
            }
            rect(x, y, cellSize, cellSize);
            if (i === state[0] && j === state[1]) {
                fill(255, 0, 0);
                ellipse(x + cellSize / 2, y + cellSize / 2, cellSize / 2);
            }
        }
    }
}

function windowResized() {
    let canvasWidth = document.getElementById('mazeCanvas').offsetWidth;
    resizeCanvas(canvasWidth, canvasWidth);
    drawMaze();
}

function runEpisode() {
    state = [0, 0];
    stepCount = 0;
    while (stepCount < 100) {
        let actionIdx = chooseAction();
        let nextState = [state[0] + actions[actionIdx][0], state[1] + actions[actionIdx][1]];
        let reward = getReward(nextState);
        if (reward !== -1) {
            updateQTable(actionIdx, nextState, reward);
            state = nextState;
        }
        stepCount++;
        if (maze[state[0]][state[1]] === 2) break;
    }
    episodeCount++;
    document.getElementById('episodeCount').textContent = episodeCount;
    document.getElementById('stepCount').textContent = stepCount;
    drawMaze();
}

function chooseAction() {
    if (Math.random() < explorationRate) {
        return Math.floor(Math.random() * 4);
    }
    return qTable[state[0]][state[1]].indexOf(Math.max(...qTable[state[0]][state[1]]));
}

function getReward(nextState) {
    if (nextState[0] < 0 || nextState[0] >= 5 || nextState[1] < 0 || nextState[1] >= 5 || maze[nextState[0]][nextState[1]] === 1) {
        return -1;
    }
    if (maze[nextState[0]][nextState[1]] === 2) {
        return 10;
    }
    return -0.1;
}

function updateQTable(actionIdx, nextState, reward) {
    let currentQ = qTable[state[0]][state[1]][actionIdx];
    let maxNextQ = Math.max(...qTable[nextState[0]][nextState[1]]);
    qTable[state[0]][state[1]][actionIdx] = currentQ + learningRate * (
        reward + discountFactor * maxNextQ - currentQ
    );
}

function reset() {
    qTable = Array(5).fill().map(() => Array(5).fill().map(() => Array(4).fill(0)));
    state = [0, 0];
    episodeCount = 0;
    stepCount = 0;
    document.getElementById('episodeCount').textContent = episodeCount;
    document.getElementById('stepCount').textContent = stepCount;
    drawMaze();
}

document.getElementById('learningRate').addEventListener('input', (e) => {
    learningRate = parseFloat(e.target.value);
    document.getElementById('learningRateValue').textContent = learningRate.toFixed(2);
});

document.getElementById('explorationRate').addEventListener('input', (e) => {
    explorationRate = parseFloat(e.target.value);
    document.getElementById('explorationRateValue').textContent = explorationRate.toFixed(2);
});

document.getElementById('runEpisode').addEventListener('click', runEpisode);
document.getElementById('reset').addEventListener('click', reset);
window.addEventListener('resize', windowResized);
