import validate from './validate.js';

export function addSubmitListener($form, $profile) {
  $form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const json = JSON.stringify(Object.fromEntries(data));
    const schema = await fetchJson('/json/schema.json');

    console.log(event.target.classList.contains('no-validation'));

    if (!event.target.classList.contains('no-validation')) {
      console.log('starting validation...');
      if (!validateData(event.target, Object.fromEntries(data), schema)) {
        return;
      }
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
        displayErrors($form, json.error);
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

function displayErrors($form, errors) {
  resetValidation($form.querySelectorAll('input'));
  console.log(errors.length);
  errors.forEach(error => {
    const inputName = error.instancePath.substring(1);
    const inputField = $form.querySelector(`input[name="${inputName}"`);
    inputField.classList.add('error');
    inputField.nextElementSibling.textContent = error.message;
    inputField.nextElementSibling.removeAttribute('hidden');
    console.log(inputName, error);
  });
}

function resetValidation(inputs) {
  inputs.forEach((input) => {
    input.classList.remove('error');
    input.nextElementSibling.setAttribute('hidden', 'hidden');
  });
}

function validateData($form, jsonData, schema) {
  const state = { isValid: true };
  const result = validate(jsonData, schema, window.ajv7);
  if (result && Array.isArray(result)) {
    state.isValid = false;
    displayErrors($form, result);
  }
  return state.isValid;
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

