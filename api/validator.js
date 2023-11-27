import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import * as fs from 'fs';

const schema = JSON.parse(fs.readFileSync(process.cwd() + '/public/json/schema.json', 'utf8'));

const ajv = new Ajv({
  coerceTypes: true,
  allErrors: true,
  strict: false,
});

// adds support for using custom error messages in schema
ajvErrors(ajv);

export default ajv.compile(schema);
