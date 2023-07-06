import rawData from "!!raw-loader!@/assets/data/clientdata2.csv";
import { parseCSVData } from "./csvParser";

const tableData = parseCSVData(rawData);

export default tableData;
