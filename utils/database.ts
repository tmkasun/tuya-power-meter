import logger from "./logger";

var fs = require("fs");
var path = require("path");

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

export async function createTable(tableName: string = DEFAULT_TABLE) {
  const currentDB = await getDB();
  return new Promise((resolve, reject) => {
    currentDB.run(
      `CREATE TABLE IF NOT EXISTS ${tableName} (id TEXT PRIMARY KEY, isOn INTEGER, power REAL, voltage REAL, current REAL, time TEXT)`,
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
  values: Array<number | string>,
  tableName: string = DEFAULT_TABLE
) {
  const currentDB = await getDB();
  return new Promise((resolve, reject) => {
    currentDB.run(
      `INSERT INTO ${tableName}(id,isOn,power,voltage,current,time) VALUES (?,?,?,?,?,datetime('now'))`,
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
