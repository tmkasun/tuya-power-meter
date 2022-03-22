var pinoms = require("pino-multi-stream");
var path = require("path");
var fs = require("fs");

const LOG_FILE = path.join(__dirname, "..", "tmp", "knnect.log");

var prettyStream = pinoms.prettyStream();
var streams = [
  { stream: fs.createWriteStream(LOG_FILE, { flags: "a" }) },
  { stream: prettyStream },
];

var logger = pinoms(pinoms.multistream(streams));

export default logger;
