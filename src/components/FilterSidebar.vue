<template>
    <div class="filter-sidebar">
      <h3>Filter by Advisor</h3>
      <div>
        <input type="checkbox" id="selectAll" v-model="selectAll" @change="toggleSelectAll" />
        <label for="selectAll">Select All</label>
      </div>
      <div v-for="(advisor, index) in advisors" :key="index">
        <input
          type="checkbox"
          :id="advisor"
          v-model="pendingFilters.advisors"
          :value="advisor"
          :disabled="selectAll"
        />
        <label :for="advisor">{{ advisor }}</label>
      </div>
      <h3>Filter by Total Account Value</h3>
      <div class="range-slider">
        <input type="range" min="0" max="30000000" step="100000" v-model="pendingFilters.valueRange[0]" />
        <input type="range" min="0" max="30000000" step="100000" v-model="pendingFilters.valueRange[1]" />
      </div>
      <div>
        <input type="number" v-model="pendingFilters.valueRange[0]" min="0" max="300000000" />
        <input type="number" v-model="pendingFilters.valueRange[1]" min="0" max="300000000" />
      </div>
      <button @click="applyFilters">Apply Filters</button>
    </div>
  </template>
  
  <style>
  .range-slider {
    display: flex;
  }
  </style>
  
  <script>
  import { ref, reactive, onMounted } from "vue";
  import tableData from "@/utils/csvData";
  
  export default {
    emits: ['apply-filters'],
  
    setup(_, { emit }) {
      const advisors = ref([]);
      const selectAll = ref(true);
      const filters = reactive({
        advisors: [],
        valueRange: [0, 300000000],
      });
      const pendingFilters = reactive({
        advisors: [],
        valueRange: [0, 300000000],
      });
  
      // Extract unique advisors from the data
      onMounted(() => {
        const uniqueAdvisors = [...new Set(tableData.map((row) => row.advisor))];
        advisors.value = uniqueAdvisors;
        // Initialize filters and pendingFilters
        filters.advisors = uniqueAdvisors;
        pendingFilters.advisors = uniqueAdvisors;
      });
  
      const toggleSelectAll = () => {
        if (selectAll.value) {
          pendingFilters.advisors = advisors.value;
        } else {
          pendingFilters.advisors = [];
        }
      };
  
      const applyFilters = () => {
        filters.advisors = [...pendingFilters.advisors];
        filters.valueRange = [...pendingFilters.valueRange];
  
        emit('apply-filters', filters);
      };
  
      return {
        advisors,
        selectAll,
        filters,
        pendingFilters,
        toggleSelectAll,
        applyFilters,
      };
    },
  };
  </script>

<style scoped>
.filter-sidebar {
  width: 25%;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.filter-title {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section-title {
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: bold;
}

.advisor-filter {
  display: flex;
  flex-direction: column;
}

.advisor-filter-item {
  margin-bottom: 5px;
  cursor: pointer;
}

.advisor-filter-item.active {
  color: blue;
}

.value-filter {
  display: flex;
  align-items: center;
}

.value-filter-input {
  width: 50px;
  margin: 0 10px;
}
</style>
