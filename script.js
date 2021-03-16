const worldSize = 200;
const gridSize = 40;
const grids = worldSize / gridSize;
const samples = grids + 1;

const data = Array.from({ length: samples }, () =>
  new Array(samples).fill(0)
);

data[2][2] = 1;
data[2][3] = 1;
data[3][2] = 1;
data[3][3] = 1;

(() => {
  const c = document.getElementById("c");

  c.width = worldSize;
  c.height = worldSize;

  const ctx = c.getContext("2d");

  ctx.lineWidth = 2;

  drawBackground(c, ctx);

  drawData(ctx);

  // drawOutlineCulledSmooth(ctx);
})();

function drawBackground(canvas, ctx) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "lightgray";
  strokeGrid(ctx, gridSize);
}

function strokeGrid(ctx, gridSize) {
  ctx.beginPath();

  for (let i = 0; i <= ctx.canvas.width; i += gridSize) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, ctx.canvas.height);
  }

  for (let i = 0; i <= ctx.canvas.height; i += gridSize) {
    ctx.moveTo(0, i);
    ctx.lineTo(ctx.canvas.width, i);
  }

  ctx.closePath();

  ctx.stroke();
}

function drawData(ctx) {
  for (let y = 0; y < samples; y++) {
    for (let x = 0; x < samples; x++) {
      if (data[x][y] === 0) continue;
      ctx.fillStyle = `rgba(0, 0, 0, ${data[x][y]})`;
      fillCircle(ctx, x * gridSize, y * gridSize, 4);
    }
  }
}

function fillCircle(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

const surroundingSamples = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1],
];

function drawOutlineCulledSmooth(ctx) {
  ctx.strokeStyle = "red";

  // ctx.beginPath();

  for (let y = 0; y < grids; y++) {
    for (let x = 0; x < grids; x++) {
      if (data[x][y] === 0) continue;

      const isTop = y === 0;
      const isBottom = y === data.length - 1;
      const isLeft = x === 0;
      const isRight = x === data.length - 1;
      const surroundings = [
        !isLeft && !isTop ? data[x - 1][y - 1] : 0,
        !isTop ? data[x][y - 1] : 0,
        !isRight && !isTop ? data[x + 1][y - 1] : 0,
        !isLeft ? data[x - 1][y] : 0,
        data[x][y],
        !isRight ? data[x + 1][y] : 0,
        !isLeft && !isBottom ? data[x - 1][y + 1] : 0,
        !isBottom ? data[x][y + 1] : 0,
        !isRight && !isBottom ? data[x + 1][y + 1] : 0
      ];
      const surroundingsMass = surroundings.reduce(
        (curr, prev) => curr + prev,
        0
      );

      const centerOfMass = [
        (-1 * surroundings[0] +
          0 * surroundings[1] +
          1 * surroundings[2] +
          -1 * surroundings[3] +
          0 * surroundings[4] +
          1 * surroundings[5] +
          -1 * surroundings[6] +
          0 * surroundings[7] +
          1 * surroundings[8]) /
          surroundingsMass,
        (-1 * surroundings[0] +
          -1 * surroundings[1] +
          -1 * surroundings[2] +
          0 * surroundings[3] +
          0 * surroundings[4] +
          0 * surroundings[5] +
          1 * surroundings[6] +
          1 * surroundings[7] +
          1 * surroundings[8]) /
          surroundingsMass
      ];

      console.log(centerOfMass);

      ctx.fillStyle = "red";
      fillCircle(
        ctx,
        x * gridSize + gridSize / 2 + gridSize * centerOfMass[0],
        y * gridSize + gridSize / 2 + gridSize * centerOfMass[1],
        10
      );

      // if (y > 0 && data[x][y - 1] === 0) {
      //   ctx.moveTo(gridSize * data[x][y], gridSize * data[x][y]);
      //   ctx.lineTo(gridSize, 0);
      // }
      // if (x < chunkCount - 1 && data[x + 1][y] === 0) {
      //   ctx.moveTo(gridSize, 0);
      //   ctx.lineTo(gridSize, gridSize);
      // }
      // if (y < chunkCount - 1 && data[x][y + 1] === 0) {
      //   ctx.moveTo(gridSize, gridSize);
      //   ctx.lineTo(0, gridSize);
      // }
      // if (x > 0 && data[x - 1][y] === 0) {
      //   ctx.moveTo(0, gridSize);
      //   ctx.lineTo(0, 0);
      // }
      // ctx.resetTransform();
    }
  }
  // ctx.closePath();

  // ctx.stroke();
}