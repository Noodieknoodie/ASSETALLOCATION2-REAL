<template>
  <div class="home">
    <div class="content">
      <SummaryBox
        :totalHouseholds="totalHouseholds"
        :totalAccounts="totalAccounts"
        :totalValue="totalValue"
        :topHouseholds="topHouseholds"
        :topAccounts="topAccounts"
        :totalQualifiedCount="accountCategorySummary.qualifiedCount"
        :totalQualifiedValue="accountCategorySummary.qualifiedValue"
        :totalNonQualifiedCount="accountCategorySummary.nonQualifiedCount"
        :totalNonQualifiedValue="accountCategorySummary.nonQualifiedValue"
        :totalTaxFreeCount="accountCategorySummary.taxFreeCount"
        :totalTaxFreeValue="accountCategorySummary.taxFreeValue"
      />
      <div class="home-content">
        <ClientTable
          :filters="filters"
          :key="filterKey"
          @filtered-data="handleFilteredData"
          @row-click="handleRowClick"
        />
        <DetailsPane :household="selectedHousehold" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import ClientTable from "@/components/ClientTable.vue";
import SummaryBox from "@/components/SummaryBox.vue";
import DetailsPane from "@/components/DetailsPane.vue";

export default {
  name: "HomeView",
  components: {
    ClientTable,
    SummaryBox,
    DetailsPane,
  },

  props: {
    filters: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    const filteredData = ref([]);
    const filterKey = ref(0);
    const selectedHousehold = ref(null);

    watch(
      () => props.filters,
      () => {
        filterKey.value++;
      },
      { deep: true }
    );

    const handleFilteredData = (data) => {
      filteredData.value = data;
    };

    const handleRowClick = (index) => {
      selectedHousehold.value = filteredData.value[index];
    };

    const totalHouseholds = computed(() => filteredData.value.length);

    const totalAccounts = computed(() =>
      filteredData.value.reduce(
        (sum, household) => sum + household.numberOfAccounts,
        0
      )
    );

    const totalValue = computed(() =>
      filteredData.value.reduce(
        (sum, household) => sum + parseFloat(household.totalAccountValue),
        0
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

    const accountCategorySummary = computed(() => {
      let qualifiedCount = 0;
      let qualifiedValue = 0;
      let nonQualifiedCount = 0;
      let nonQualifiedValue = 0;
      let taxFreeCount = 0;
      let taxFreeValue = 0;

      filteredData.value.forEach((household) => {
        qualifiedCount += household.qualifiedCount;
        qualifiedValue += parseFloat(household.qualifiedValue);
        nonQualifiedCount += household.nonQualifiedCount;
        nonQualifiedValue += parseFloat(household.nonQualifiedValue);
        taxFreeCount += household.taxFreeCount;
        taxFreeValue += parseFloat(household.taxFreeValue);
      });

      return {
        qualifiedCount,
        qualifiedValue: qualifiedValue.toFixed(2),
        nonQualifiedCount,
        nonQualifiedValue: nonQualifiedValue.toFixed(2),
        taxFreeCount,
        taxFreeValue: taxFreeValue.toFixed(2),
      };
    });

    return {
      filterKey,
      handleFilteredData,
      totalHouseholds,
      totalAccounts,
      totalValue,
      topHouseholds,
      topAccounts,
      accountCategorySummary,
      selectedHousehold,
      handleRowClick,
    };
  },
};
</script>
