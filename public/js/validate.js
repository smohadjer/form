export default function validate($form) {
  const inputs = $form.querySelectorAll('input');
  const state = { isValid: true };
  const resetValidation = (inputs) => {
    inputs.forEach((input) => {
      input.classList.remove('error');
      input.nextElementSibling.setAttribute('hidden', 'hidden');
    });
  };
  const setError = (input) => {
    state.isValid = false;
    input.classList.add('error');
    input.nextElementSibling.removeAttribute('hidden');
  };
  const formData = new FormData($form);
  const validate = () => {
    for (const item of formData.entries()) {
      console.log(`${item[0]}, ${item[1]}`);
      const inputField = $form.querySelector(`input[name="${item[0]}"`);
      if (item[0] === 'age' && isNaN(item[1])) {
        setError(inputField);
      }

      // to find out if a string contains number we use regix /\d/
      if (item[0] !== 'age' && /\d/.test(item[1])) {
        setError(inputField);
      }
    }
  };

  resetValidation(inputs);
  validate();

  return state.isValid;
}
