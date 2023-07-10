<template>
  <div class="summary-box">
    <h3>Filters Activated</h3>
    <ul>
      <li v-for="(filter, index) in filters" :key="index">
        {{ filter.name }}: {{ filter.value }}
      </li>
    </ul>
    <h3>Households and Accounts Summary</h3>
    <p>Total Households: {{ totalHouseholds }}</p>
    <p>Total Accounts: {{ totalAccounts }}</p>
    <p>
      Qualified: {{ accountTypes.Qualified }} | Non-Qualified: {{
        accountTypes.NonQualified
      }} | Tax-Free: {{ accountTypes.TaxFree }}
    </p>
    <h3>Accounts Value Summary</h3>
    <p>Total Value: {{ formatCurrency(totalValue) }}</p>
    <p>
      Qualified: {{ formatCurrency(accountValues.Qualified) }} | Non-Qualified: {{
        formatCurrency(accountValues.NonQualified)
      }} | Tax-Free: {{ formatCurrency(accountValues.TaxFree) }}
    </p>
    <h3>Top 5 Households by AUM Value</h3>
    <ul>
      <li v-for="(household, index) in topHouseholds" :key="index">
        {{ household.name }} - {{ formatCurrency(household.value) }}
      </li>
    </ul>
    <h3>Top 5 Accounts by Value</h3>
    <ul>
      <li v-for="(account, index) in topAccounts" :key="index">
        {{ account.number }} - {{ formatCurrency(account.value) }} - {{
          account.householdName
        }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    filters: Array,
    totalHouseholds: Number,
    totalAccounts: Number,
    accountTypes: Object,
    totalValue: Number,
    accountValues: Object,
    topHouseholds: Array,
    topAccounts: Array,
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
  .summary-box {
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  h3 {
    margin-top: 0;
  }
</style>