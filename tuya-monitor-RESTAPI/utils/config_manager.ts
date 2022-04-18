var fs = require("fs");
var path = require("path");

const CONFIGS_FILE = path.join(__dirname, "..", "configs.json");

type TuyaConfigs = {
  /* openapi host */
  host: string;
  /* fetch from openapi platform */
  accessKey: string;
  /* fetch from openapi platform */
  secretKey: string;
  /* Interface example device_ID */
  deviceId: string;
};
export const configsManager = (() => {
  let configs: null | TuyaConfigs = null;
  return {
    getConfigs: () => configs,
    setToken: (_configs: TuyaConfigs) => (configs = _configs),
  };
})();

export function getConfigs(): TuyaConfigs {
  const inMemoryConfigs = configsManager.getConfigs();
  if (inMemoryConfigs) {
    // could be expired
    return inMemoryConfigs;
  } else {
    const configsObjectString = fs.readFileSync(CONFIGS_FILE);
    const configs = JSON.parse(configsObjectString); //now it an object
    configsManager.setToken(configs);
    return configs;
  }
}
