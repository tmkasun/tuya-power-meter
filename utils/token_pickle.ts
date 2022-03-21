var fs = require("fs").promises;
var path = require("path");
import * as crypto from "crypto";

import { getConfigs } from "./config_manager";
import { httpClient } from "./http_client";
import logger from "./logger";

const TOKEN_FILE = path.join(__dirname, "..", "tmp", "token.json");

type TuyaTokenResponse = {
  access_token: string;
  expire_time: number;
  refresh_token: string;
  uid: string;
};
interface TokenStoreObject extends TuyaTokenResponse {
  storedAt: number;
}
export const tokenManager = (() => {
  let token: null | TokenStoreObject = null;
  return {
    getToken: () => token,
    setToken: (_token: TokenStoreObject) => (token = _token),
  };
})();

export async function storeToken(token: TuyaTokenResponse) {
  const tokenObject: TokenStoreObject = { ...token, storedAt: Date.now() };
  var json = JSON.stringify(tokenObject);
  await fs.writeFile(TOKEN_FILE, json, { flag: "w+" });
  tokenManager.setToken(tokenObject);
}

export async function getToken() {
  const inMemoryToken = tokenManager.getToken();
  if (inMemoryToken) {
    // could be expired
    return inMemoryToken;
  } else {
    const tokenObjectString = await fs.readFile(TOKEN_FILE, "utf8");
    const storedToken = JSON.parse(tokenObjectString); //now it an object
    tokenManager.setToken(storedToken);
    return storedToken;
  }
}

/**
 * HMAC-SHA256 crypto function
 */
export async function encryptStr(str: string, secret: string): Promise<string> {
  return crypto
    .createHmac("sha256", secret)
    .update(str, "utf8")
    .digest("hex")
    .toUpperCase();
}

/**
 * fetch highway login token
 */
export async function generateToken() {
  const config = getConfigs();
  const currentToken = await getToken();
  const timeNow = Date.now();
  // The OAuth token is currently valid for two hours for security concerns
  if (currentToken && (currentToken.storedAt + (currentToken.expire_time * 1000) < timeNow)) {
    logger.info('Generating new Access token from API')

    const method = "GET";
    const timestamp = Date.now().toString();
    const signUrl = "/v1.0/token?grant_type=1";
    const contentHash = crypto.createHash("sha256").update("").digest("hex");
    const stringToSign = [method, contentHash, "", signUrl].join("\n");
    const signStr = config.accessKey + timestamp + stringToSign;

    const headers = {
      t: timestamp,
      sign_method: "HMAC-SHA256",
      client_id: config.accessKey,
      sign: await encryptStr(signStr, config.secretKey),
    };
    const { data: login } = await httpClient.get("/v1.0/token?grant_type=1", {
      headers,
    });
    console.log("login success: ", JSON.stringify(login));
    if (!login || !login.success) {
      throw Error(`fetch failed: ${login.msg}`);
    }
    await storeToken(login.result);
    return login.result;
  } else {
    logger.info('Using cached Access token')
    return currentToken;
  }
}
