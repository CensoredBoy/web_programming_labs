<template>
  <div>
    <h1>Ковёр Серпинского</h1>
    <div>
      <br />
      <svg :width="w" :height="h">
        <rect
          v-for="(pixel, index) in pixels"
          :key="index"
          fill="#000000"
          fill-opacity="1"
          :x="pixel.x"
          :y="pixel.y"
          width="1"
          height="1"
        />
      </svg>
      <br />

      <label>Начальная точка:</label>
      <input type="number" v-model="pointStart" />
      <label>Конечная точка:</label>
      <input type="number" v-model="pointEnd" />
      <br />
      <button @click="drawCarpet">Перерисовать ковёр</button>
      <div id="time"></div>
    </div>

    <canvas id="performanceChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  data() {
    return {
      w: 500,
      h: 500,
      A: [0, 0],
      B: [0, 1],
      C: [1, 1],
      D: [1, 0],
      pointStart: 0,
      pointEnd: 100000,
      pixels: [],
      chart: null,
    };
  },
  methods: {
    async drawCarpet() {
      const response = await fetch("http://localhost:3000/api/drawCarpet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          A: [0, 0],
          B: [0, 1],
          C: [1, 1],
          D: [1, 0],
          pointStart: this.pointStart,
          pointEnd: this.pointEnd,
        }),
      });

      const data = await response.json();
      this.pixels = data.pixels;

      document.getElementById("time").innerHTML = `
        <p>Время начала построения: ${data.startDate}</p>
        <p>Время окончания построения: ${data.endDate}</p>
        <p>Время построения: ${data.elapsedTime} мс</p>
      `;

      this.updateChart(["Точки"], [data.elapsedTime]);
    },
    updateChart(labels, data) {
      if (!this.chart) {
        const ctx = document.getElementById("performanceChart").getContext("2d");
        this.chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Время выполнения (мс)",
                data: data,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } else {
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
      }
    },
  },
};
</script>

<style scoped>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
svg {
  border: 1px solid #000000;
}
input {
  width: 60px;
  margin: 5px;
}
#time {
  font-size: 18px;
  margin-top: 20px;
}
</style>
