<template>
  <div class="details-pane">
    <h2>Account Details</h2>
    <div v-if="household">
      <h3>{{ household.household }}</h3>
      <div
        v-for="account in household.topAccounts"
        :key="account.id"
        class="account-details"
      >
        <h4>{{ account.name }}</h4>
        <p><strong>Account Number:</strong> {{ account.id }}</p>
        <p><strong>Account Type:</strong> {{ account.accountType }}</p>
        <p><strong>Open Date:</strong> {{ account.openDate }}</p>
        <p><strong>Account Current Value:</strong> {{ account.value }}</p>
      </div>
    </div>
    <div v-else>
      <p>Select a household to view account details.</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    household: Object,
  },
};
</script>

<style scoped>
.details-pane {
  width: 50%;
  padding: 20px;
  border-left: 1px solid #ccc;
}

.account-details {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
}
</style>
