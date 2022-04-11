import * as pinoms from 'pino-multi-stream';
import * as path from 'path';
import * as fs from 'fs';

const LOG_FILE = process.env.E_APP_ROOT ? path.join(process.env.E_APP_ROOT, "tmp", "knnect.log") : path.join(__dirname, '..', '..', 'tmp', 'knnect.log');

const prettyStream = pinoms.prettyStream();
const streams = [
  { stream: fs.createWriteStream(LOG_FILE, { flags: 'a' }) },
  { stream: prettyStream },
];

const logger = pinoms(pinoms.multistream(streams));

export default logger;
