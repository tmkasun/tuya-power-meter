const ENV_PREFIX = "ENERGY_API_";
export const Configs = (() => {
  const tempConfigs: { [key: string]: string } = {};
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith(ENV_PREFIX)) {
      const configKey = key.replace(ENV_PREFIX, "");
      const configValue = process.env[key];
      if (configKey && configValue) {
        tempConfigs[configKey] = configValue;
      }
    }
  });
  return tempConfigs;
})();

export default Configs;
