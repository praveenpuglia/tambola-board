<template>
  <div class="board-wrapper">
    <div class="board">
      <input
        ref="copyInput"
        v-model="currentNumber"
        type="text"
        class="number-copy"
      />
      <span
        v-for="number in numbers"
        :key="number"
        class="number ff-mono"
        :class="{
          checked: checked.includes(number),
          current: number === currentNumber
        }"
        >{{ number }}</span
      >
      <div v-if="isOver" class="game-over">
        <h1 class="game-over__message ff-mono">It's Over</h1>
      </div>
    </div>
    <div class="controls">
      <button
        ref="pickerButton"
        class="button button-pick"
        :disabled="isOver"
        @click="pick"
      >
        Pick
      </button>
      <div class="last-numbers">
        <h2>
          Previous {{ lastNumbers.length }}
          {{ lastNumbers.length > 1 ? 'Numbers' : 'Number' }}
        </h2>
        <div class="last-numbers__list">
          <span
            v-for="num in lastNumbers"
            :key="num"
            class="number checked ff-mono number-sm"
            >{{ num }}</span
          >
        </div>
      </div>
      <button class="button button-reset" @click="reset">Reset</button>
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
    },
    lastNumbers() {
      return this.checked.slice(-9, -1).reverse();
    },
    copyInput() {
      return this.$refs.copyInput;
    }
  },
  created() {
    if (!localStorage.TAMBOLA_BOARD_STATE) {
      localStorage.TAMBOLA_BOARD_STATE = JSON.stringify({
        currentNumber: 0,
        checked: []
      });
    } else {
      const state = this.getState();
      this.checked = state.checked;
      this.currentNumber = state.currentNumber;
    }
  },
  methods: {
    pick() {
      const diff = this.numbers.filter((num) => !this.checked.includes(num));
      const index = Math.floor(Math.random() * diff.length);
      this.currentNumber = shuffle(diff)[index];
      this.checked.push(this.currentNumber);
      this.setState({
        currentNumber: this.currentNumber,
        checked: this.checked
      });
      this.$nextTick(() => {
        this.copyToClipboard();
        this.$refs.pickerButton.focus();
      });
    },
    copyToClipboard() {
      this.copyInput.focus();
      this.copyInput.select();
      document.execCommand('copy');
    },
    reset() {
      const shouldReset = window.confirm('Are you sure you want to reset?');
      if (shouldReset) {
        this.currentNumber = 0;
        this.checked = [];
        delete localStorage.TAMBOLA_BOARD_STATE;
      }
    },
    getState() {
      return JSON.parse(localStorage.TAMBOLA_BOARD_STATE);
    },
    setState(data) {
      localStorage.TAMBOLA_BOARD_STATE = JSON.stringify(data);
    }
  }
};
</script>
<style lang="scss" scoped>
.board-wrapper {
  display: grid;
  grid-template-columns: 100vmin 1fr;
  height: 100vh;
  width: 100vw;
  @media (orientation: portrait) {
    & {
      grid-template-columns: 1fr;
      grid-template-rows: 100vmin 1fr;
    }
  }
  & {
    overflow: hidden;
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
  position: relative;
}
.number {
  border: 1px solid;
  font-size: 4vmin;
  border-radius: 50%;
  width: 8vmin;
  height: 8vmin;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #ccc;
  transition: 0.3s;
  will-change: transform;
  &.number-sm {
    font-size: 3vmin;
    width: 6vmin;
    height: 6vmin;
  }
  &.checked {
    background-color: #ff6666;
    color: white;
    text-shadow: 0 2px rgba(0, 0, 0, 0.2);
    background-image: radial-gradient(
      circle at 0.5vmin 0.5vmin,
      transparent 50%,
      #980e0e
    );
  }
  &.current {
    box-shadow: 0 0 0 0.75vmin gold;
    animation: zoom-out ease-in 0.3s;
    color: gold;
    background-color: rebeccapurple;
  }
}
@keyframes zoom-out {
  0% {
    transform: scale(5) rotate(180deg);
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
}
.controls {
  background: #333;
  padding: 2vmin;
  color: white;
  display: flex;
  flex-direction: column;
}
.button {
  display: block;
  padding: 2vmin 4vmin;
  font-size: 4vmin;
  width: 100%;
  font-weight: 900;
  color: white;
  border: none;
  background-color: gold;
  border-radius: 4vmin;
  background-image: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1));
  &:active {
    background-image: none;
  }
}
.last-numbers {
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  margin-top: 2vmin;
  padding: 4vmin;
  border-radius: 4vmin;
  box-shadow: inset 0 0 1vmin 0 rgba(0, 0, 0, 0.6);
  &__list {
    margin-top: 2vmin;
    display: flex;
    justify-content: space-between;
    .number {
      background-color: rebeccapurple;
    }
  }
}
.button-reset {
  margin-top: 2vmin;
  background-color: crimson;
}
.number-copy {
  position: absolute;
  opacity: 0;
}
</style>
