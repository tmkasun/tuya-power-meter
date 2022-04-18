import { default as axios } from "axios";
import { getConfigs } from "./config_manager";

const config = getConfigs();
export const httpClient = axios.create({
  baseURL: config.host,
  timeout: 5 * 1e3,
});