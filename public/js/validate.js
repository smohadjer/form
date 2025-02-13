import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';

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
    return validator.errors;
  }
}
