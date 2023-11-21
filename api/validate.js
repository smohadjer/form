export default (body) => {
  const validation = {
    isValid: true,
    errors: []
  };
  const allowedProperties = ['firstname', 'lastname', 'age'];

  for (const property in body) {
    const propertyIsAllowed = allowedProperties.includes(property)

    if (!propertyIsAllowed) {
      validation.isValid = false;
      break;
    }

    if (property === 'age' && body[property] > 100) {
      validation.isValid = false;
      validation.errors.push({
          name: "age",
          error: "You are too old to be online!"
      });
    }
  }

  return validation;
};
