


import fs from "fs";
import csv from "csv-parser";

export function parseCSV(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const rows: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row: any) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}
