<template>
  <div id="app">
    <FilterSidebar @apply-filters="updateFilters" />
    <ClientTable :filters="filters" />
  </div>
</template>

<script>
import ClientTable from "@/components/ClientTable.vue";
import FilterSidebar from "@/components/FilterSidebar.vue";

export default {
  components: {
    ClientTable,
    FilterSidebar,
  },

  data() {
    return {
      filters: {
        advisors: [],
        unspecified: true,
        valueRange: [0, 300000000],
      },
    };
  },

  methods: {
    updateFilters(newFilters) {
      this.filters = newFilters;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
