<template>
  <div class="summary-box">
    <h2>SummaryBox</h2>
    <p>Total Households: {{ totalHouseholds }}</p>
    <p>Total Accounts: {{ totalAccounts }}</p>
    <p>Total Value: {{ formatCurrency(totalValue) }}</p>
    <h3>Top Households by Value</h3>
    <ul>
      <li v-for="(household, index) in topHouseholds" :key="index">
        {{ household.name }}: {{ formatCurrency(household.value) }}
      </li>
    </ul>
    <h3>Top Accounts by Value</h3>
    <ul>
      <li v-for="(account, index) in topAccounts" :key="index">
        {{ account.accountName }} ({{ account.householdName }}):
        {{ formatCurrency(account.value) }}
      </li>
    </ul>
    <h3>Account Category Summary</h3>
    <p>
      Qualified: {{ totalQualifiedCount }} |
      {{ formatCurrency(totalQualifiedValue) }}
    </p>
    <p>
      Non-Qualified: {{ totalNonQualifiedCount }} |
      {{ formatCurrency(totalNonQualifiedValue) }}
    </p>
    <p>
      Tax-Free: {{ totalTaxFreeCount }} |
      {{ formatCurrency(totalTaxFreeValue) }}
    </p>
  </div>
</template>

<script>
export default {
  name: "SummaryBox",
  props: {
    totalHouseholds: Number,
    totalAccounts: Number,
    totalValue: Number,
    topHouseholds: Array,
    topAccounts: Array,
    totalQualifiedCount: Number,
    totalQualifiedValue: Number,
    totalNonQualifiedCount: Number,
    totalNonQualifiedValue: Number,
    totalTaxFreeCount: Number,
    totalTaxFreeValue: Number,
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
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
}

.summary-box h2 {
  margin-top: 0;
}

.summary-box ul {
  margin: 0;
  padding-left: 20px;
}

.summary-box li {
  list-style-type: none;
}

</style>
