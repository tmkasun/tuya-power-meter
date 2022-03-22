import * as qs from "qs";
import * as crypto from "crypto";

import { generateToken, getToken, encryptStr } from "./utils/token_pickle";
import { getConfigs } from "./utils/config_manager";
import { httpClient } from "./utils/http_client";
import logger from "./utils/logger";
import { createTable, insert, openDB } from "./utils/database";

const config = getConfigs();

async function main() {
  logger.info("Starting power meter tracker");
  await generateToken();
  await openDB();
  await createTable();
  let lastP, lastV, lastC, lastChange;
  lastChange = Date.now();
  while (true) {
    let data;
    try {
      data = await getPowerUsage(config.deviceId);
    } catch (error) {
      logger.error(error); // expect token error
      await generateToken();
      continue;
    }
    const { result, tid } = data;
    const parameters: { [key: string]: any } = {};
    for (const parameter of result) {
      parameters[parameter.code] = parameter.value;
    }
    const isOn = parameters.switch_1 ? 1 : 0;
    const power = parameters.cur_power / 10;
    const voltage = parameters.cur_voltage / 10;
    const current = parameters.cur_current / 1000;
    if (lastP !== power || lastV !== voltage || lastC !== current) {
      logger.warn(`Changed in ${(Date.now() - lastChange) / 1000}s`);

      lastChange = Date.now();
      lastC = current;
      lastP = power;
      lastV = voltage;
      try {
        await insert([tid, isOn, power, voltage, current]);
      } catch (error) {
        logger.error(error);
      }

      logger.info(`Switch On/Off: ${isOn} `);
      logger.info(`Current Power: ${power} `);
      logger.info(`Current Voltage: ${voltage} `);
      logger.info(`Current Current: ${current} `);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

/**
 * fetch highway business data
 */
async function getDeviceInfo(deviceId: string) {
  const query = {};
  const method = "POST";
  const url = `/v1.0/devices/${deviceId}/commands`;
  const reqHeaders: { [k: string]: string } = await getRequestSign(
    url,
    method,
    {},
    query
  );

  const { data } = await httpClient.request({
    method,
    data: {},
    params: {},
    headers: reqHeaders,
    url: reqHeaders.path,
  });
  if (!data || !data.success) {
    throw Error(`request api failed: ${data.msg}`);
  }
}

async function getPowerUsage(deviceId: string) {
  const query = {};
  const method = "GET";
  const url = `/v1.0/iot-03/devices/${deviceId}/status`;
  const reqHeaders: { [k: string]: string } = await getRequestSign(
    url,
    method,
    {},
    query
  );

  const { data } = await httpClient.request({
    method,
    data: {},
    params: {},
    headers: reqHeaders,
    url: reqHeaders.path,
  });
  if (!data || !data.success) {
    throw Error(`request api failed: ${data.msg}`);
  }
  return data;
}

/**
 * request sign, save headers
 * @param path
 * @param method
 * @param headers
 * @param query
 * @param body
 */
async function getRequestSign(
  path: string,
  method: string,
  headers: { [k: string]: string } = {},
  query: { [k: string]: any } = {},
  body: { [k: string]: any } = {}
) {
  const { access_token: token } = await getToken();
  const t = Date.now().toString();
  const [uri, pathQuery] = path.split("?");
  const queryMerged = Object.assign(query, qs.parse(pathQuery));
  const sortedQuery: { [k: string]: string } = {};
  Object.keys(queryMerged)
    .sort()
    .forEach((i) => (sortedQuery[i] = query[i]));

  const querystring = decodeURIComponent(qs.stringify(sortedQuery));
  const url = querystring ? `${uri}?${querystring}` : uri;
  const contentHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(body))
    .digest("hex");
  const stringToSign = [method, contentHash, "", url].join("\n");
  const signStr = config.accessKey + token + t + stringToSign;
  return {
    t,
    path: url,
    client_id: config.accessKey,
    sign: await encryptStr(signStr, config.secretKey),
    sign_method: "HMAC-SHA256",
    access_token: token,
  };
}

main().catch((err) => {
  throw Error(`error: ${err}`);
});
