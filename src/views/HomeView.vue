<template>
  <div class="home">
    <FilterSidebar @apply-filters="handleApplyFilters" />
    <ClientTable :filters="filters" />
  </div>
</template>

<script>
import ClientTable from "@/components/ClientTable.vue";
import FilterSidebar from "@/components/FilterSidebar.vue";
import { ref } from "vue";

export default {
  name: "HomeView",
  components: {
    ClientTable,
    FilterSidebar,
  },
  setup() {
    const filters = ref(null);

    const handleApplyFilters = (newFilters) => {
      filters.value = newFilters;
    };

    return {
      filters,
      handleApplyFilters,
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
</style>