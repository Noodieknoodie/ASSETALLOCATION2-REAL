<template>
  <div class="range-slider">
    <input
      id="range-slider"
      type="range"
      min="0"
      max="3"
      step="1"
      v-model="sliderValue"
    />
    <span>{{ selectedRange }}</span>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";

export default {
  props: ["modelValue"],
  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const sliderValue = ref(0);
    const accountValueRanges = ["0", "1000000", "2000000", "3000000"];

    const selectedRange = computed(() => {
      let rangeText = "More than 3M";
      switch (sliderValue.value) {
        case "0":
          rangeText = "Less than 1M";
          break;
        case "1":
          rangeText = "1M to 2M";
          break;
        case "2":
          rangeText = "2M to 3M";
          break;
      }
      return rangeText;
    });

    watch(sliderValue, () => {
      emit("update:modelValue", accountValueRanges[sliderValue.value]);
    });

    return {
      sliderValue,
      selectedRange,
    };
  },
};
</script>

<style>
.range-slider {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
