
<template>
    <div>
      <h3>Filter by Total Account Value</h3>
      <vue-slider v-model="value" :marks="marks" @change="onChange"></vue-slider>
    </div>
  </template>
  
  <script>
  import VueSlider from 'vue-slider-component';
  import 'vue-slider-component/theme/default.css';
  
  export default {
    components: {
      VueSlider
    },
    data() {
      return {
        value: [0, 3], // Default value
        marks: {
          0: 'Under 1M',
          1: '1M to 2M',
          2: '2M to 3M',
          3: '3M and above'
        },
      };
    },
    methods: {
      onChange(val) {
        this.$emit('value-range-change', val);
      },
    },
  };
  </script>
  