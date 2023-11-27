// validates a json with a schema using Ajv validator and returns errors if validation fails
export default function validate(json, schema, Ajv) {
  const validator = new Ajv({
    coerceTypes: true,
    allErrors: true
  });

  const v = validator.compile(schema);
  const valid = v(json);
  if (!valid) {
    return (v.errors);
  }
}
