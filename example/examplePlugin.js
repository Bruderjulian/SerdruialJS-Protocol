const { PluginBase } = require("../src/config/Plugins")

module.exports = PluginBase.from({
  name: "test",
  version: "1.0.0",
  description: "A Test Plugin",
  author: "BruderJulian",
  dependencies: [],
  optionalDependencies: [],

  load: () => {

  },
  unload: () => {

  }
});
