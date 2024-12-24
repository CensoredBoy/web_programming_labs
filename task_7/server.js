const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/drawCarpet', (req, res) => {
  const { A, B, C, D, pointStart, pointEnd } = req.body;

  // Проверка входных данных
  if (!A || !B || !C || !D || pointStart === undefined || pointEnd === undefined) {
    return res.status(400).json({ error: "Некорректные входные данные" });
  }

  const pixels = [];
  const e = []; // Хранилище координат
  let startTime = performance.now();
  const startDate = new Date().toLocaleTimeString();

  // Добавляем первую точку
  let p = { x: A[0] * 500, y: A[1] * 500 };
  pixels.push(p);
  e.push([A[0], A[1]]);

  const ABCD = [A, B, C, D];

  for (let i = pointStart; i < pointEnd; i++) {
    const U = ABCD[Math.floor(Math.random() * ABCD.length)];
    const G = e[Math.floor(Math.random() * e.length)];

    let dx = Math.abs(U[0] - G[0]) / 1.7;
    let dy = Math.abs(U[1] - G[1]) / 1.7;
    let nx = G[0];
    let ny = G[1];

    if (U[0] > G[0]) {
      nx += dx;
    } else {
      nx -= dx;
    }

    if (U[1] > G[1]) {
      ny += dy;
    } else {
      ny -= dy;
    }

    let newPoint = { x: nx * 500, y: ny * 500 };
    pixels.push(newPoint);
    e.push([nx, ny]);
  }

  const endTime = performance.now();
  const endDate = new Date().toLocaleTimeString();
  const elapsedTime = (endTime - startTime).toFixed(2);

  res.json({
    pixels,
    startDate,
    endDate,
    elapsedTime
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
