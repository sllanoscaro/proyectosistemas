let maze = [
      [0, 0, 0, 1, 1],
      [0, 1, 0, 1, 2],
      [0, 1, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 1]
    ];
    let qTable = Array(5).fill().map(() => Array(5).fill().map(() => Array(4).fill(0)));
    let state = [0, 0];
    let actions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up
    let learningRate = document.getElementById('learningRate').value;
    let explorationRate = document.getElementById('explorationRate').value;
    let discountFactor = 0.9;
    let episodeCount = 0;
    let stepCount = 0;
    let visitedPath = [];

    function setup() {
      let canvasWidth = document.getElementById('mazeCanvas').offsetWidth;
      let canvas = createCanvas(canvasWidth, canvasWidth);
      canvas.parent('mazeCanvas');
      drawMaze();
    }

    function drawMaze(invalidMoves = []) {
      background(255);
      let cellSize = width / 5;

      // Dibujar el laberinto
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          let x = j * cellSize;
          let y = i * cellSize;
          if (maze[i][j] === 1) {
            fill(0); // Pared
          } else if (maze[i][j] === 2) {
            fill(0, 255, 0); // Meta
          } else {
            fill(255); // Espacio libre
          }
          rect(x, y, cellSize, cellSize);
        }
      }

      // Dibujar movimientos inválidos
      invalidMoves.forEach(([i, j]) => {
        let x = j * cellSize;
        let y = i * cellSize;
        fill(150, 150, 150); // Gris para movimientos inválidos
        rect(x + cellSize * 0.25, y + cellSize * 0.25, cellSize * 0.5, cellSize * 0.5);
      });

      // Dibujar pasos válidos
      let visitedCells = new Map();
      for (let index = 0; index < visitedPath.length; index++) {
        const [i, j] = visitedPath[index];
        visitedCells.set(`${i},${j}`, index + 1);
      }

      visitedCells.forEach((step, key) => {
        const [i, j] = key.split(',').map(Number);
        let x = j * cellSize;
        let y = i * cellSize;
        fill(173, 216, 230); // Azul claro
        rect(x + cellSize * 0.25, y + cellSize * 0.25, cellSize * 0.5, cellSize * 0.5);
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(cellSize * 0.3);
        text(step, x + cellSize / 2, y + cellSize / 2);
      });

      // Dibujar posición actual del agente
      let [i, j] = state;
      let x = j * cellSize;
      let y = i * cellSize;
      fill(255, 0, 0); // Rojo
      ellipse(x + cellSize / 2, y + cellSize / 2, cellSize / 2);
    }

        function windowResized() {
          let canvasWidth = document.getElementById('mazeCanvas').offsetWidth;
          resizeCanvas(canvasWidth, canvasWidth);
          drawMaze();
    }

    function runEpisode() {
      visitedPath = [];
      state = [0, 0];
      stepCount = 0;
      while (stepCount < 20) {
        let actionIdx = chooseAction();
        let nextState = [state[0] + actions[actionIdx][0], state[1] + actions[actionIdx][1]];
        let reward = getReward(nextState);
        console.log(`Paso ${stepCount + 1}: Estado actual: ${state}, Acción: ${actionIdx}, Siguiente estado: ${nextState}, Recompensa: ${reward}`);
        if (reward !== -1) {
          visitedPath.push([...nextState]);
          updateQTable(actionIdx, nextState, reward);
          state = nextState;
          stepCount++;
        }
        if (maze[state[0]][state[1]] === 2) break;
      }
      episodeCount++;
      console.log(`Episodio ${episodeCount} finalizado. Tabla Q:`, qTable);
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

    document.getElementById('reset').addEventListener('click', reset);
    window.addEventListener('resize', windowResized);

    function logQTable() {
      console.log("Tabla Q:");
      console.log(qTable);
    }
    document.getElementById('runEpisode').addEventListener('click', () => {

      runEpisode();
      logQTable();
    });