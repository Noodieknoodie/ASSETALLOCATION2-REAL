import rawData from "!!raw-loader!@/assets/data/clientdata2.csv";
import { parseCSVData } from "./csvParser";

const tableData = parseCSVData(rawData);

console.log(tableData);  // Add this line

export default tableData;