import * as qs from "qs";
import * as crypto from "crypto";

import { generateToken, getToken, encryptStr } from "./utils/token_pickle";
import { getConfigs } from "./utils/config_manager";
import { httpClient } from "./utils/http_client";
import logger from "./utils/logger";

const config = getConfigs();

async function main() {
  logger.info("Starting power meter tracker");
  await generateToken();
  while (true) {
    const data = await getPowerUsage(config.deviceId);
    const parameters: { [key: string]: any } = {};
    for (const parameter of data.result) {
      parameters[parameter.code] = parameter.value;
    }
    logger.info(`Switch On/Off: ${parameters.switch_1 ? "on" : "off"} `);
    logger.info(`Current Power: ${parameters.cur_power / 10} `);
    logger.info(`Current Voltage: ${parameters.cur_voltage / 10} `);
    logger.info(`Current Current: ${parameters.cur_current / 1000} `);
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