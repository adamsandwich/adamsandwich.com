<template>
  <div class="container">
    <div class="text-magic" data-word="404 Not Found">
      <div class="white"></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="less">
@import "~static/init.less";
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.text-magic {
  position: relative;
  display: inline-block;
  font-size: 10vw;
  color: transparent;
}
.white {
  position: absolute;
  left: -10px;
  width: 100%;
  height: 1px;
  @media (prefers-color-scheme: dark) {
    background: @darkBackgroundColor;
  }

  @media (prefers-color-scheme: light), (prefers-color-scheme: no-preference) {
    background: @lightBackgroundColor;
  }
  z-index: 4;
  animation: whiteMove 10s ease-out infinite;
}

.text-magic::before {
  content: attr(data-word);
  position: absolute;
  white-space: nowrap;
  left: -1px;
  display: inline-block;
  color: red;
  overflow: hidden;
  z-index: 2;
  filter: contrast(200%);
  text-shadow: 1px 0 0 red;
  animation: move 0.95s infinite;
}

.text-magic::after {
  content: attr(data-word);
  position: relative;
  display: inline-block;
  color: rgba(255, 255, 255, 0.8);
  overflow: hidden;
  z-index: 3;
  color: cyan;
  filter: contrast(200%);
  text-shadow: -1px 0 0 cyan;
  mix-blend-mode: lighten;
  animation: move 1.1s infinite 0.2s;
}

@keyframes whiteMove {
  9% {
    top: 38px;
  }
  14% {
    top: 8px;
  }
  18% {
    top: 42px;
  }
  22% {
    top: 1px;
  }
  32% {
    top: 32px;
  }
  34% {
    top: 12px;
  }
  40% {
    top: 26px;
  }
  43% {
    top: 7px;
  }
  99% {
    top: 30px;
  }
}

@keyframes move {
  10% {
    top: -0.4px;
    left: -1.1px;
  }
  20% {
    top: 0.4px;
    left: -0.2px;
  }
  30% {
    left: 0.5px;
  }
  40% {
    top: -0.3px;
    left: -0.7px;
  }
  50% {
    left: 0.2px;
  }
  60% {
    top: 1.8px;
    left: -1.2px;
  }
  70% {
    top: -1px;
    left: 0.1px;
  }
  80% {
    top: -0.4px;
    left: -0.9px;
  }
  90% {
    left: 1.2px;
  }
  100% {
    left: -1.2px;
  }
}
</style>
