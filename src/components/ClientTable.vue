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
      <!--
      <th>Account Details</th>
    -->
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
      <td>{{ formatCurrency(row.totalAccountValue) }}</td>
      <td>{{ row.currentAllocation }}</td>
      <td>{{ row.targetAllocation }}</td>
      <!--
      <td>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Qualified</td>
              <td>
                {{ row.qualifiedCount }} | {{ formatCurrency(row.qualifiedValue) }}
              </td>
            </tr>
            <tr>
              <td>Non-Qualified</td>
              <td>
                {{ row.nonQualifiedCount }} | {{ formatCurrency(row.nonQualifiedValue) }}
              </td>
            </tr>
            <tr>
              <td>Tax-Free</td>
              <td>
                {{ row.taxFreeCount }} | {{ formatCurrency(row.taxFreeValue) }}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
      -->
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
        // Include only rows where advisor is selected in the filters or unspecified if selected
        if (
          props.filters.advisors.length > 0 &&
          !props.filters.advisors.includes(row.advisor) &&
          (!props.filters.unspecified || row.advisor)
        ) {
          return false;
        }

        // Include only rows where Total Account Value is within selected range
        if (
          parseFloat(row.totalAccountValue) < props.filters.valueRange[0] ||
          parseFloat(row.totalAccountValue) > props.filters.valueRange[1]
        ) {
          return false;
        }

        // Include only rows that contain the search text
        if (
          searchText.value !== "" &&
          !row.household.toLowerCase().includes(searchText.value.toLowerCase())
        ) {
          return false;
        }

        return true;
      });
    });

    // Add a watcher to emit the filtered-data event
    watch(filteredData, (newData) => {
      // Emit the filtered-data event with the new data
      emit("filtered-data", newData);
    });

    const onRowClick = (index) => {
      console.log(`Row ${index} clicked`);
      // Add your logic here
    };

    return {
      searchText,
      filteredData,
      highlightedRowIndex,
      onRowClick, // Return the function
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
  width: 100%;
  overflow-x: auto;
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
