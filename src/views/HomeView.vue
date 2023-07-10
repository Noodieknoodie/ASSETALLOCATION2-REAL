<template>
  <div class="home">
    <div class="content">
      <SummaryBox
        :totalHouseholds="totalHouseholds"
        :totalAccounts="totalAccounts"
        :accountTypes="accountTypes"
        :totalValue="totalValue"
        :accountValues="accountValues"
        :topHouseholds="topHouseholds"
        :topAccounts="topAccounts"
      />
      <!-- Pass the key prop to force the component to re-render when filters change -->
      <ClientTable
        :filters="filters"
        :key="filterKey"
        @filtered-data="handleFilteredData"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import ClientTable from "@/components/ClientTable.vue";
import SummaryBox from "@/components/SummaryBox.vue";

export default {
  name: "HomeView",
  components: {
    ClientTable,
    SummaryBox,
  },

  props: {
    filters: {
      //change initialFilters to filters
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    const filteredData = ref([]);
    // Add a ref to hold the filter key
    const filterKey = ref(0);

    // Watch the filters prop for changes
    watch(
      () => props.initialFilters,
      () => {
        // Update filterKey to force ClientTable to re-render
        filterKey.value++;
      },
      { deep: true }
    );

    const handleFilteredData = (data) => {
      filteredData.value = data;
    };

    const totalHouseholds = computed(() => filteredData.value.length);
    const totalAccounts = computed(() =>
      filteredData.value.reduce(
        (sum, household) => sum + household.numberOfAccounts,
        0
      )
    );

    const accountTypes = computed(() =>
      filteredData.value.reduce(
        (types, household) => {
          types.Qualified += household.accountTypes.Qualified;
          types.NonQualified += household.accountTypes.NonQualified;
          types.TaxFree += household.accountTypes.TaxFree;
          return types;
        },
        { Qualified: 0, NonQualified: 0, TaxFree: 0 }
      )
    );

    const totalValue = computed(() =>
      filteredData.value.reduce(
        (sum, household) => sum + parseFloat(household.totalAccountValue),
        0
      )
    );

    const accountValues = computed(() =>
      filteredData.value.reduce(
        (values, household) => {
          values.Qualified += isNaN(
            parseFloat(household.accountTypeSums.Qualified)
          )
            ? 0
            : parseFloat(household.accountTypeSums.Qualified);
          values.NonQualified += isNaN(
            parseFloat(household.accountTypeSums.NonQualified)
          )
            ? 0
            : parseFloat(household.accountTypeSums.NonQualified);
          values.TaxFree += isNaN(parseFloat(household.accountTypeSums.TaxFree))
            ? 0
            : parseFloat(household.accountTypeSums.TaxFree);
          return values;
        },
        { Qualified: 0, NonQualified: 0, TaxFree: 0 }
      )
    );

    const topHouseholds = computed(() => {
      const sortedData = [...filteredData.value].sort(
        (a, b) =>
          parseFloat(b.totalAccountValue) - parseFloat(a.totalAccountValue)
      );
      return sortedData.slice(0, 5).map((household) => ({
        name: household.household,
        value: parseFloat(household.totalAccountValue),
      }));
    });

    const topAccounts = computed(() => {
      const accounts = filteredData.value.flatMap((household) =>
        household.topAccounts.map((account) => ({
          ...account,
          householdName: household.household,
        }))
      );
      const sortedAccounts = accounts.sort((a, b) => b.value - a.value);
      return sortedAccounts.slice(0, 5);
    });

    return {
      filterKey, // Return the filterKey ref from setup
      handleFilteredData,
      totalHouseholds,
      totalAccounts,
      accountTypes,
      totalValue,
      accountValues,
      topHouseholds,
      topAccounts,
    };
  },
};
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

.content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
