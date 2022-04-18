import logger from "./logger";

var fs = require("fs");
var path = require("path");

export enum DataTypes {
  TEXT = "TEXT",
  REAL = "REAL",
  INTEGER = "INTEGER",
}

const DEFAULT_TABLE = "KNNECT_DATA";

const DB_FILE = path.join(__dirname, "..", "tmp", "knnectPower.db");

const sqlite3 = require("sqlite3").verbose();

const { getDB, setDB } = (() => {
  let db: any;
  return {
    getDB: () => db,
    setDB: (_db) => (db = _db),
  };
})();

export async function openDB() {
  const promisedDB = new Promise((resolve, reject) => {
    let db = new sqlite3.Database(DB_FILE, (err) => {
      if (err) {
        reject(err);
      }
      logger.info("Connected to the Knnect Tuya database.");
    });
    resolve(db);
  });
  setDB(promisedDB);
  return promisedDB;
}

export async function createTable(
  tableName: string = DEFAULT_TABLE,
  columns: { [key: string]: DataTypes }
) {
  const currentDB = await getDB();
  let columnsString = '(';
  for (const column of Object.entries(columns)) {
    columnsString += `${column[0]} ${column[1]}, `;
  }
  columnsString += 'time TEXT)';
  return new Promise((resolve, reject) => {
    currentDB.run(
      `CREATE TABLE IF NOT EXISTS ${tableName} ${columnsString}`,
      function (error) {
        if (error) {
          reject(error);
        } else {
          console.log(`Rows inserted ${this.changes}`);
          resolve(this);
        }
      }
    );
  });
}

export async function insert(
  tableName: string = DEFAULT_TABLE,
  values: [number | string, number | string]
  ) {
  const currentDB = await getDB();
  return new Promise((resolve, reject) => {
    currentDB.run(
      `INSERT INTO ${tableName} VALUES (?,?,datetime('now'))`,
      [...values],
      function (error) {
        if (error) {
          reject(error);
        } else {
          console.log(`Rows inserted ${this.changes}`);
          resolve(this);
        }
      }
    );
  });
}
