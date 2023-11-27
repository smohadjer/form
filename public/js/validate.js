// validates a json with a schema using Ajv validator and returns errors if validation fails
import Ajv from 'https://cdn.jsdelivr.net/npm/ajv@8.12.0/+esm';
import ajvErrors from 'https://cdn.jsdelivr.net/npm/ajv-errors@3.0.0/+esm';

export default function validate(json, schema) {
  const ajv = new Ajv({
    coerceTypes: true,
    allErrors: true,
    strict: false
  });

  ajvErrors(ajv);

  const validator = ajv.compile(schema);
  const valid = validator(json);
  if (!valid) {
    return (validator.errors);
  }
}
