<script lang="ts" setup>
import { ref } from 'vue'
import { blobToDownload } from '@/utils/index'

const audioRef = ref<HTMLAudioElement>()
const canvasRef = ref<HTMLCanvasElement>()
const inputRef = ref<HTMLInputElement>()

const onPlay = () => {
  audioRef.value?.play()
  onLoadAudio()
}

const onDownload = () => {
  const file = inputRef.value.files?.[0]
  if (file) {
    blobToDownload(file, file.name ?? '')
  }
}

const handleFiles = (event) => {
  const files = event.target.files
  if (files.length) {
    const file = files[0]
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        audioRef.value.src = reader.result
      }
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }
}

function onLoadAudio() {
  const context = new window.AudioContext()
  const analyser = context.createAnalyser()
  analyser.fftSize = 512
  const source = context.createMediaElementSource(audioRef.value)

  source.connect(analyser)
  analyser.connect(context.destination)

  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)

  const canvas = canvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const ctx = canvas.getContext('2d')
  const WIDTH = canvas.width
  const HEIGHT = canvas.height

  const barWidth = (WIDTH / bufferLength) * 1.5

  let barHeight

  function renderFrame() {
    requestAnimationFrame(renderFrame)

    analyser.getByteFrequencyData(dataArray)

    ctx.clearRect(0, 0, WIDTH, HEIGHT)

    for (let i = 0, x = 0; i < bufferLength; i++) {
      barHeight = dataArray[i]

      const h = 160 + 200 * (i / bufferLength)
      const s = 50 + 50 * (i / bufferLength)
      const l = 50 + 50 * (i / bufferLength)

      ctx.fillStyle = `hsl(${h}deg ${s}% ${l}%)`
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight)

      x += barWidth + 2
    }
  }

  renderFrame()
}
</script>

<template>
  <div class="btn-group">
    <input type="file" ref="inputRef" accept="audio/*" @change="handleFiles" />
    <div class="btn" @click="onPlay">PLAY</div>
    <div class="btn" @click="onDownload">DownLoad</div>
  </div>
  <div class="admin-container">
    <canvas id="canvas" ref="canvasRef"></canvas>
    <audio
      id="audio"
      ref="audioRef"
      controls
      src="//m8.music.126.net/21180815163607/04976f67866d4b4d11575ab418904467/ymusic/515a/5508/520b/f0cf47930abbbb0562c9ea61707c4c0b.mp3?infoId=92001"
      crossOrigin="anonymous"
    ></audio>
  </div>
</template>

<style scoped>
.admin-container {
  width: 100%;
  position: relative;
  height: calc(100vh - 200px);
}

#canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

audio {
  display: none;
}
.btn-group {
  display: flex;
  align-items: center;
  background-color: hsl(170, 30%, 70%);
  padding: 20px;
}

.btn {
  color: pink;
  background: #007a99;
  width: 150px;
  height: 45px;

  font-size: 18px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 200px;
}
</style>
