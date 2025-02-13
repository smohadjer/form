import validate from './validate.js';
import Handlebars from 'handlebars';

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

export function addEventListeners($form, $profile) {
  $form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = new FormData(event.target);
    // remove empty fields
    for (const [key, value] of Array.from(data.entries())) {
      if (value.length === 0) {
        data.delete(key)
      }
    }

    for (const [key, value] of data.entries()) {
      console.log(key, value);
    }
    const json = JSON.stringify(Object.fromEntries(data));
    const schema = await fetchJson('/json/schema.json');

    if (!event.target.classList.contains('no-validation')) {
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
        resetValidation($form.querySelectorAll('.row'));
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
  console.log('display errors:', errors);
  resetValidation($form.querySelectorAll('.row'));
  errors.forEach(error => {
    let fieldName;
    if (error.instancePath.length > 0) {
      fieldName = error.instancePath.substring(1);
    } else {
      if (error.keyword === 'required') {
        fieldName = error.params.missingProperty
      }
    }

    if (fieldName) {
      const formField = $form.querySelector(`[name="${fieldName}"`);
      if (formField) {
        const row = formField.closest('.row');
        row.classList.add('row--error');
        row.querySelector('.error').textContent = error.message;
        row.querySelector('.error').removeAttribute('hidden');
      }
    }
  });
}

function resetValidation(rows) {
  rows.forEach(row => {
    row.classList.remove('row--error');
    const error = row.querySelector('.error');
    if (error) {
      error.setAttribute('hidden', 'hidden');
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

