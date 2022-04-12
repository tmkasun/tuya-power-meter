import logger from "./logger";

// import * as fs from "fs";
import * as path from "path";
import Configs from "./configs";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sqlite3 = require("sqlite3").verbose();

const DEFAULT_TABLE = "KNNECT_DATA";

const DB_FILE = Configs.APP_ROOT
  ? path.join(Configs.APP_ROOT, "tmp", "knnectPower.db")
  : path.join(__dirname, "..", "..", "tmp", "knnectPower.db");
logger.info(`Using database file (if "APP_ROOT"): ${DB_FILE}`);
const { getDB, setDB } = (() => {
  let db: any;
  return {
    getDB: () => db,
    setDB: (_db) => (db = _db),
  };
})();

export async function openDB() {
  const promisedDB = new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_FILE, (err) => {
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

export async function search(
  offset = 0,
  limit = 50,
  orderBy = "time",
  tableName: string = DEFAULT_TABLE,
  order = "DESC"
) {
  const currentDB = await getDB();
  return new Promise((resolve, reject) => {
    const sql = `SELECT *
                 FROM
                  ${tableName}
                 ORDER BY ${orderBy} ${order}
                 LIMIT ${limit} OFFSET ${offset}`;
    currentDB.all(sql, [], function (error, rows) {
      if (error) {
        reject(error);
      } else {
        logger.info(`Fetched ${rows.length} rows from ${tableName}`);
        resolve(rows);
      }
    });
  });
}

export async function searchByMonthRange(
  offset = 0,
  limit = 50,
  orderBy = "time",
  order = "DESC",
  start,
  end
) {
  if (!end) {
    end = new Date().toISOString().split("T")[0];
  }
  // https://www.sqlite.org/lang_datefunc.html
  const currentDB = await getDB();
  return new Promise((resolve, reject) => {
    const sql = `SELECT datetime(time, 'localtime') as time, power
                 FROM
                  ${DEFAULT_TABLE}
                  WHERE time BETWEEN "${start}" AND "${end}"
                 ORDER BY ${orderBy} ${order}
                 LIMIT ${limit} OFFSET ${offset}`;
    currentDB.all(sql, [], function (error, rows) {
      if (error) {
        reject(error);
      } else {
        logger.debug(`Fetched ${rows.length} rows from ${DEFAULT_TABLE}`);
        resolve(rows);
      }
    });
  });
}
