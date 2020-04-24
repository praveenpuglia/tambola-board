<template>
  <div class="board-wrapper">
    <div class="board">
      <span
        class="number"
        :class="{ checked: checked.includes(number) }"
        v-for="number in numbers"
        :key="number"
        >{{ number }}</span
      >
      <div class="game-over" v-if="isOver">
        <h1 class="game-over__message">
          It's Over
        </h1>
      </div>
    </div>
    <div class="controls">
      <button :disabled="isOver" @click="pick">Pick</button>
    </div>
  </div>
</template>
<script>
import { shuffle } from 'lodash-es';
export default {
  data() {
    return {
      checked: [],
      currentNumber: 0
    };
  },
  computed: {
    numbers() {
      return new Array(90).fill(1).map((_, index) => index + 1);
    },
    isOver() {
      return this.checked.length === 90;
    }
  },
  methods: {
    pick() {
      const diff = this.numbers.filter(num => !this.checked.includes(num));
      const index = Math.floor(Math.random() * diff.length);
      this.pickedNumber = shuffle(diff)[index];
      this.checked.push(this.pickedNumber);
    }
  }
};
</script>
<style lang="scss" scoped>
.board-wrapper {
  display: grid;
  grid-template-columns: 100vmin 1fr;
  @media (orientation: portrait) {
    & {
      grid-template-columns: 1fr;
    }
  }
}
.board {
  width: calc(100vmin);
  height: calc(100vmin);
  display: grid;
  padding: 1rem;
  grid-gap: 1vmin;
  grid-template-columns: repeat(10, 1fr);
  align-items: center;
  justify-items: center;
  font-size: 4vmin;
  position: relative;
}
.number {
  border: 1px solid;
  font-family: 'Manrope', 'Courier New', Courier, monospace;
  border-radius: 50%;
  width: 8vmin;
  height: 8vmin;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #ccc;
  &.checked {
    background-color: #ff6666;
    color: white;
    background-image: radial-gradient(
      circle at 10px 10px,
      transparent 50%,
      rgba(0, 0, 0, 0.4)
    );
  }
}
.game-over {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(2px);
  display: grid;
  justify-content: center;
  align-items: center;
  &__message {
    font-family: 'Manrope', 'Courier New', Courier, monospace;
  }
}
.controls {
  background: #333;
}
</style>
