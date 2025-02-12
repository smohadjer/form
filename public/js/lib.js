import validate from './validate.js';
import Handlebars from 'handlebars';

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

export function addSubmitListener($form, $profile) {
  $form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const json = JSON.stringify(Object.fromEntries(data));
    const schema = await fetchJson('/json/schema.json');

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
      // if server returns errors, show erros in form
      if (json.error) {
        displayErrors($form, json.error);
      } else {
        resetValidation($form.querySelectorAll('input'));
        $profile.classList.add('loading');

        // using a delay so user notices profile update
        setTimeout(() => {
          renderProfile(json, $profile);
        }, 250)
      }
    }).catch(function(err) {
      console.error(`Error: ${err}`);
    });
  });
}

export async function renderProfile(dbData, profileElement) {
  profileElement.classList.remove('loading');
  profileElement.innerHTML = `<code>${JSON.stringify(dbData)}</code>`;
}

function displayErrors($form, errors) {
  resetValidation($form.querySelectorAll('.formfield'));
  errors.forEach(error => {
    const fieldName = error.instancePath.substring(1);
    const formField = $form.querySelector(`[name="${fieldName}"`);
    if (formField) {
      formField.classList.add('error');
      formField.nextElementSibling.textContent = error.message;
      formField.nextElementSibling.removeAttribute('hidden');
    }
  });
}

function resetValidation(fields) {
  fields.forEach((field) => {
    if (field) {
      field.classList.remove('error');
      field.nextElementSibling.setAttribute('hidden', 'hidden');
    }
  });
}

// client-side validation
function validateData($form, jsonData, schema) {
  let isValid = true;
  const result = validate(jsonData, schema);
  if (result && Array.isArray(result)) {
    isValid = false;
    displayErrors($form, result);
  }
  return isValid;
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

