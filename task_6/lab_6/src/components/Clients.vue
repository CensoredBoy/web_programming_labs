<style>
body {
    font-family: Arial, sans-serif;
  }
  .card {
    margin: 15px 5px;
  }
  canvas {
    border: solid 1px #999;
  }
  p {
    margin: 5px 0 3px;
  }
</style>

<template>
    <div class="image-analyzer">
      <div class="card">
        <p>Выберите изображение из файла</p>
        <input type="file" @change="handleFileChange">
        <br>
        <img :src="imageSrc" @load="getImageData" v-if="imageSrc">
      </div>
      <div class="card">
        <p>Гистограмма</p>
        <div>
          <input type="radio" value="value" v-model="histogramMode" @change="drawHistogram">
          <label>Значение</label>
          <input type="radio" value="color" v-model="histogramMode" @change="drawHistogram">
          <label>Цвет</label>
        </div>
        <canvas ref="histogramCanvas" width="256" height="150"></canvas>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        imageSrc: null,
        imageData: null,
        histogramMode: 'value',
        histogramData: {
          cyan: new Array(256).fill(0),
          magenta: new Array(256).fill(0),
          yellow: new Array(256).fill(0),
          black: new Array(256).fill(0),
        },
      };
    },
    methods: {
      handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
          this.imageSrc = URL.createObjectURL(file);
        }
      },
      getImageData(event) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = event.target.width;
        canvas.height = event.target.height;
        ctx.drawImage(event.target, 0, 0);
        this.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        this.calculateHistogram();
        this.drawHistogram();
      },
      calculateHistogram() {
        this.histogramData.red = new Array(256).fill(0);
        this.histogramData.green = new Array(256).fill(0);
        this.histogramData.blue = new Array(256).fill(0);
        console.log('RED ' + (this.imageData[0] & 0xFF).toString(10))
        console.log('GREEN ' + ((this.imageData[0] >> 8) & 0xFF).toString(10))
        console.log('BLUE ' + ((this.imageData[0] >> 16) & 0xFF).toString(10))
        for (let i = 0; i < this.imageData.length; i += 4) {
          const r = this.imageData[i];
          const g = this.imageData[i + 1];
          const b = this.imageData[i + 2];

          this.histogramData.red[r]++;
          this.histogramData.green[g]++;
          this.histogramData.blue[b]++;
        }
      },
      drawHistogram() {
        const canvas = this.$refs.histogramCanvas;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const maxValue = Math.max(
          ...this.histogramData.red,
          ...this.histogramData.green,
          ...this.histogramData.blue
        );

        const drawChannel = (channel, color) => {
          ctx.fillStyle = color;
          for (let i = 0; i < 256; i++) {
            const value = this.histogramData[channel][i];
            const height = (value / maxValue) * canvas.height;
            ctx.fillRect(i, canvas.height - height, 1, height);
          }
        };

        if (this.histogramMode === 'value') {
          drawChannel('red', 'red');
          drawChannel('green', 'green');
          drawChannel('blue', 'blue');
        } else {
          const combined = new Array(256).fill(0);
          for (let i = 0; i < 256; i++) {
            combined[i] =
              this.histogramData.red[i] +
              this.histogramData.green[i] +
              this.histogramData.blue[i];
          }
          ctx.fillStyle = 'gray';
          for (let i = 0; i < 256; i++) {
            const value = combined[i];
            const height = (value / maxValue) * canvas.height;
            ctx.fillRect(i, canvas.height - height, 1, height);
          }
        }
      },

    },
  };
  </script>