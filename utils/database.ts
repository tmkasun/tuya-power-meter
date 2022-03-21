import logger from "./logger";

var fs = require("fs");
var path = require("path");

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
    let db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        reject(err);
      }
      logger.info("Connected to the chinook database.");
    });
    resolve(db);
  });
  setDB(promisedDB);
  return promisedDB;
}

export async function createTable(tableName: string) {
  const currentDB = await getDB()
  currentDB.run(`CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)`);
}