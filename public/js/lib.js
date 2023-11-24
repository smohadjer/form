function validateData($form) {
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

export function addSubmitListener($form, $profile) {
  $form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const json = JSON.stringify(Object.fromEntries(data));

    if (!validateData(event.target)) {
      return
    }

    fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: json
    })
    .then((response) => response.json())
    .then(async (json) => {
      if (json.error) {
        displayError($form, json.error);
      } else {
        renderProfile(json, $profile);
      }
    }).catch(function(err) {
      console.error(`Error: ${err}`);
    });
  });
}

export async function renderProfile(dbData, profileElement) {
  profileElement.innerHTML = `<code>${JSON.stringify(dbData)}</code>`;
}

export function displayError($form, error) {
  const errors = error.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    errors.forEach((errorObject) => {
      const field = $form.querySelector(`input[name=${ errorObject.name}`);
      if (field) {
        field.classList.add('error');
        field.nextElementSibling.textContent = errorObject.error;
        field.nextElementSibling.removeAttribute('hidden');
      }
    });
  }
}

export async function getFormData(jsonPath, userData) {
  const formJson = await fetchJson(jsonPath);
  // add value from database to form fields
  if (userData.length) {
    formJson.fields.map(field => {
      const dbField = userData.find((item) => item.name === field.name);
      return field.value = dbField.value;
    });
  }
  return formJson;
}

// render function uses Handlebars library to populate a template with data and
// return the result as a HTML string
export async function renderForm(data, $form) {
  const template = await fetchTemplate('./template/form.hbs');
  const compiledTemplate = Handlebars.compile(template);
  const htmlString = compiledTemplate(data);
  $form.innerHTML = htmlString
}

export async function fetchTemplate(path) {
  const response = await fetch(path);
  const responseText = await response.text();
  return responseText;
}

export async function fetchJson(path) {
  const response = await fetch(path);
  const responseJson = await response.json();
  return responseJson;
}

