import { parse } from "papaparse";

let qualifiedKeywords = ['401', '403', 'ira', 'sep', 'simple', 'defined benefit', 'rollover', 'profit sharing', 'roth', 'cust', 'inherited'];
let taxFreeKeywords = ['529', 'charitable', 'education'];
let nonQualifiedKeywords = ['annuity', 'trust', 'comm', 'corporate', 'cp', 'crut', 'estate', 'grat', 'gst', 'individual', 'joint', 'jt', 'living', 'llc', 'marital', 'partnership', 'pen', 'rev', 'separate property', 'special needs', 'supplemental needs', 'survivors', 'ten', 'utma', 'outside billing'];

function getAccountType(accountName) {
  const lowerCaseName = accountName.toLowerCase();
  
  for (let keyword of qualifiedKeywords) {
    if (lowerCaseName.includes(keyword)) {
      return 'Qualified';
    }
  }
  
  for (let keyword of taxFreeKeywords) {
    if (lowerCaseName.includes(keyword)) {
      return 'Tax-Free';
    }
  }
  
  for (let keyword of nonQualifiedKeywords) {
    if (lowerCaseName.includes(keyword)) {
      return 'Non-Qualified';
    }
  }
  
  return 'Unknown'; // or you can return 'Non-Qualified' if you prefer to default to this type
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

    // If household name is blank, create a new one based on other fields
    if (!householdName) {
      if (accountName === `${lastName}, ${firstName}`) {
        householdName = accountName;
      } else {
        householdName = `${lastName}, ${firstName}`; // or any other logic you prefer
      }
    }

    const household = acc[id] || {
      id,
      householdName,
      primaryAdvisor: row["Primary Advisor"],
      accounts: new Set(),
      totalAccountValue: 0,
      accountTypes: {Qualified: 0, NonQualified: 0, TaxFree: 0}
    };

    if (!household.accounts.has(accountId)) {
      household.accounts.add(accountId);
      household.totalAccountValue += parseFloat(row["Account Current Value"]);
      household.accountTypes[accountType] += 1;
    }

    acc[id] = household;
    return acc;
  }, {});

  const formattedData = Object.values(summaryData).map((household) => ({
    id: household.id,
    household: household.householdName,
    advisor: household.primaryAdvisor,
    numberOfAccounts: household.accounts.size,
    totalAccountValue: household.totalAccountValue.toFixed(2),
    accountTypes: household.accountTypes,
    currentAllocation: "TBD",
    targetAllocation: "TBD",
  }));

  return formattedData;
}
