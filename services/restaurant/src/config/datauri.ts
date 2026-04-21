import DataUriParser from "datauri/parser.js";
import path from "node:path";

const getBuffer = (file: any) => {
  const parser = new DataUriParser();

  const exName = path.extname(file.originalname).toString();

  return parser.format(exName, file.buffer);
};

export default getBuffer;
