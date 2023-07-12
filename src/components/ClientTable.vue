<template>
  <div class="table-container">
    <div class="search-container">
      <label for="search" class="search-label">Search:</label>
      <input
        type="text"
        id="search"
        v-model="searchText"
        class="search-input"
      />
    </div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Household</th>
          <th>Advisor</th>
          <th>Number of Accounts</th>
          <th>Total Account Value</th>
          <th>Current Allocation</th>
          <th>Target Allocation</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in filteredData"
          :key="rowIndex"
          :class="{ 'highlighted-row': rowIndex === highlightedRowIndex }"
          @mouseover="highlightedRowIndex = rowIndex"
          @mouseout="highlightedRowIndex = -1"
          @click="onRowClick(rowIndex)"
        >
          <td>{{ row.id }}</td>
          <td>{{ row.household }}</td>
          <td>{{ row.advisor }}</td>
          <td>{{ row.numberOfAccounts }}</td>
          <td>{{ formatCurrency(row.totalAccountValue) }}</td>  <!-- Corrected here -->
          <td>{{ row.currentAllocation }}</td>
          <td>{{ row.targetAllocation }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import tableData from "@/utils/csvData";

export default {
  props: {
    filters: Object,
  },

  setup(props, { emit }) {
    const searchText = ref("");
    const highlightedRowIndex = ref(-1);

    const filteredData = computed(() => {
      if (!props.filters) return tableData;

      return tableData.filter((row) => {
        if (
          props.filters.advisors.length > 0 &&
          !props.filters.advisors.includes(row.advisor) &&
          (!props.filters.unspecified || row.advisor)
        ) {
          return false;
        }

        if (
          searchText.value !== "" &&
          !row.household.toLowerCase().includes(searchText.value.toLowerCase())
        ) {
          return false;
        }

        if (
          parseFloat(row.totalAccountValue) <
          parseFloat(props.filters.accountValue)
        ) {
          return false;
        }

        return true;
      });
    });

    watch(filteredData, (newData) => {
      emit("filtered-data", newData);
    });

    const onRowClick = (index) => {
      emit("row-click", index);
    };

    return {
      searchText,
      filteredData,
      highlightedRowIndex,
      onRowClick,
    };
  },

  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    },
  },
};
</script>

<style scoped>
.table-container {
  width: 60%;
  height: 500px; /* Adjust this value to your needs */
  overflow-x: auto;
  overflow-y: auto; /* This will make your table scrollable */
}

.search-container {
  margin-bottom: 20px;
}

.search-label {
  margin-right: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.highlighted-row {
  background-color: #e0e0e0;
}
</style>
