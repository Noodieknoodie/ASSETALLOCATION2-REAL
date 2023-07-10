import { parse } from "papaparse";

export function parseCSVData(csvData) {
  const parsedData = parse(csvData.trim(), {
    header: true,
    skipEmptyLines: "greedy",
  });

  function getAccountCategory(accountType) {
    const qualifiedKeywords = [
      "401(k)",
      "403(b)",
      "IRA",
      "IRA Intelligent",
      "IRA Rollover",
      "IRA Rollover 2",
      "Roth Conversion",
      "Roth Conversion IRA",
      "Roth IRA",
      "Roth IRA Intelligent",
      "SEP IRA",
      "Simple IRA",
      "Inherited IRA",
      "Inherited Roth IRA",
    ];

    const taxFreeKeywords = [
      "529",
      "Charitable",
      "Education Savings",
      "Utah 529",
      "UTMA",
    ];

    if (qualifiedKeywords.includes(accountType)) {
      return "Qualified";
    } else if (taxFreeKeywords.includes(accountType)) {
      return "Tax-Free";
    } else {
      return "Non-Qualified";
    }
  }

  const summaryData = parsedData.data.reduce((acc, row) => {
    const id = row["Primary Household ID"];
    const accountId = row["Account Number"];
    let householdName = row["AUM Household Name"];
    const firstName = row["First Name"];
    const lastName = row["Last Name"];
    const accountName = row["Account Name"];
    const accountType = row["Account Type"];
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
      accounts: new Map(),
      totalAccountValue: 0,
      accountCategoryCounts: {
        "Qualified": { count: 0, value: 0 },
        "Non-Qualified": { count: 0, value: 0 },
        "Tax-Free": { count: 0, value: 0 },
      },
    };

    if (!household.accounts.has(accountId)) {
      household.accounts.set(accountId, {
        id: accountId,
        name: accountName,
        value: accountValue,
      });

      // Determine the account category and update the count and value
      const accountCategory = getAccountCategory(accountType);
      household.accountCategoryCounts[accountCategory].count += 1;
      household.accountCategoryCounts[accountCategory].value += accountValue;

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
      currentAllocation: "TBD",
      targetAllocation: "TBD",
      topAccounts,
      qualifiedCount: household.accountCategoryCounts["Qualified"].count,
      qualifiedValue: household.accountCategoryCounts["Qualified"].value.toFixed(2),
      nonQualifiedCount: household.accountCategoryCounts["Non-Qualified"].count,
      nonQualifiedValue: household.accountCategoryCounts["Non-Qualified"].value.toFixed(2),
      taxFreeCount: household.accountCategoryCounts["Tax-Free"].count,
      taxFreeValue: household.accountCategoryCounts["Tax-Free"].value.toFixed(2),
    };
  });

  return formattedData;
}