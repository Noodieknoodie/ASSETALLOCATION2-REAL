```
import { parse } from "papaparse";

let qualifiedKeywords = ['401(k)', '403(b)', 'IRA', 'IRA Intelligent', 'IRA Rollover', 'IRA Rollover 2', 'Roth Conversion', 'Roth Conversion IRA', 'Roth IRA', 'Roth IRA Intelligent', 'SEP IRA', 'Simple IRA', 'Inherited IRA', 'Inherited Roth IRA'];
let taxFreeKeywords = ['529', 'Charitable', 'Education Savings', 'Utah 529', 'UTMA'];
let nonQualifiedKeywords = ['Annuity', 'By-Pass Trust', 'Credit Shelter Trust', 'Family Trust', 'Grantor Trust', 'GRAT', 'GST', 'GST (Margin)', 'Irrevocable Trust', 'Living Trust', 'Living Trust (Bonds)', 'Living Trust (Dividend)', 'Living Trust (Equity)', 'Living Trust (Margin)', 'Living Trust (Yield)', 'Marital Trust', 'Pen Trust', 'Rev Trust 1', 'Rev Trust 2', 'Revocable Trust', 'Revocable Trust (Equity)', 'Revocable Trust (Yield)', 'Special Needs Trust', 'Supplemental Needs Trust', 'Survivors Trust', 'Testamentary Trust', 'Trust', 'Individual', 'Comm Prop WROS', 'Community Property', 'Community Property (Margin)', 'Community Property 2', 'Dsg Bene JT (Margin)', 'JT TEN', 'JT TEN - LINK', 'JT TEN - Travel', 'JT TEN (Fool Acct)', 'JT TEN (Income)', 'JT TEN (Investment)', 'JT TEN (Margin)', 'JT TEN (Tax)', 'JT TEN (Tech)', 'JT TEN (Trading)', 'JT TEN | Pledged', 'JT Ten 2', 'JT Ten Comp', 'JTWROS', 'JTWROS 4', 'JTWROS COMP', 'Ten Com', 'Ten Com (Margin)', 'Corporate', 'LLC', 'Partnership', 'Partnership (Margin)', 'Profit Sharing Plan', 'CRUT', 'Schwab Charitable', 'Annuity', 'Estate', 'OUTSIDE BILLING', 'Separate Property'];

function getAccountType(accountName) {
  const lowerCaseAccountName = accountName.toLowerCase();

  if (qualifiedKeywords.some(keyword => lowerCaseAccountName.includes(keyword.toLowerCase()))) {
    return 'Qualified';
  }

  if (taxFreeKeywords.some(keyword => lowerCaseAccountName.includes(keyword.toLowerCase()))) {
    return 'Tax-Free';
  }

  if (nonQualifiedKeywords.some(keyword => lowerCaseAccountName.includes(keyword.toLowerCase()))) {
    return 'Non-Qualified';
  }

  return 'Unknown'; 
}


export function parseCSVData(csvData) {
  const parsedData = parse(csvData.trim(), {
    header: true,
    skipEmptyLines: "greedy",
  });

  const summaryData = parsedData.data.reduce((acc, row) => {
    const id = row["Primary Household ID"];
    const accountId = row["Account Number"];
    let householdName = row["AUM Household Name"];
    const firstName = row["First Name"];
    const lastName = row["Last Name"];
    const accountName = row["Account Name"];
    const accountType = getAccountType(accountName);
    const accountValue = parseFloat(row["Account Current Value"]);

    if (!householdName) {
      if (accountName === `${lastName}, ${firstName}`) {
        householdName = accountName;
      } else {
        householdName = `${lastName}, ${firstName}`;
      }
    }

    const household = acc[id] || {
      id,
      householdName,
      primaryAdvisor: row["Primary Advisor"],
      accounts: new Map(),  // changed from Set to Map
      totalAccountValue: 0,
      accountTypes: { 'Qualified': 0, 'Non-Qualified': 0, 'Tax-Free': 0 },
    };

    if (!household.accounts.has(accountId)) {
      household.accounts.set(accountId, {
        id: accountId,
        name: accountName,
        value: accountValue,
      });
      household.accountTypes[accountType] += 1;
      household.totalAccountValue += accountValue;
    }

    acc[id] = household;
    return acc;
  }, {});

  const formattedData = Object.values(summaryData).map((household) => {
    const topAccounts = Array.from(household.accounts.values())
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      id: household.id,
      household: household.householdName,
      advisor: household.primaryAdvisor,
      numberOfAccounts: household.accounts.size,
      totalAccountValue: household.totalAccountValue.toFixed(2),
      accountTypes: household.accountTypes,
      currentAllocation: "TBD",
      targetAllocation: "TBD",
      topAccounts,
    };
  });

  return formattedData;
}
```