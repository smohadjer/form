import validate from './validate.js';

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
  resetValidation($form.querySelectorAll('input'));
  errors.forEach(error => {
    const inputName = error.instancePath.substring(1);
    const inputField = $form.querySelector(`input[name="${inputName}"`);
    inputField.classList.add('error');
    inputField.nextElementSibling.textContent = error.message;
    inputField.nextElementSibling.removeAttribute('hidden');
  });
}

function resetValidation(inputs) {
  inputs.forEach((input) => {
    input.classList.remove('error');
    input.nextElementSibling.setAttribute('hidden', 'hidden');
  });
}

// client-side validation
function validateData($form, jsonData, schema) {
  let isValid = true;
  const result = validate(jsonData, schema);
  if (result && Array.isArray(result)) {
    isValid = false;
    displayErrors($form, errors);
  }
  return isValid;
}

export async function populateForm(userData, $form) {
  // add value from database to form fields
  if (userData.length) {
    userData.forEach(item => {
      const $input = $form.querySelector(`input[name=${item.name}]`);
      if ($input) {
        $input.value = item.value;
      }
    });
  }
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

