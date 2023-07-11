<template>
  <div class="filter-sidebar">
    <h3>Filter by Advisor</h3>
    <div>
      <input type="checkbox" id="selectAll" v-model="selectAll" @change="toggleSelectAll" />
      <label for="selectAll">Check/Uncheck All</label>
    </div>
    <div v-for="(advisor, index) in advisors" :key="index">
      <input
        type="checkbox"
        :id="advisor"
        v-model="pendingFilters.advisors"
        :value="advisor"
      />
      <label :for="advisor">{{ advisor }}</label>
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
    });
    const pendingFilters = reactive({
      advisors: [],
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
        pendingFilters.advisors = [...advisors.value];
      } else {
        pendingFilters.advisors = [];
      }
    };

    onMounted(() => {
      const uniqueAdvisors = [...new Set(tableData.map((row) => row.advisor))];
      advisors.value = uniqueAdvisors;
      filters.advisors = uniqueAdvisors;
      pendingFilters.advisors = uniqueAdvisors;
      applyFilters(); // Apply filters on app load
    });

    const applyFilters = () => {
      filters.advisors = [...pendingFilters.advisors];

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
