import validate from './validate.js';

const $form = document.querySelector('#form');
addSubmitListener($form);

const userData = await fetchJson('/api/profile');

// add form to the page
const formData = await getFormData(userData);
$form.innerHTML = await render('./template/form.hbs', formData);

// display user data in profile section
const $profile = document.querySelector('#profile');
renderProfile(userData, $profile);

function addSubmitListener(form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const json = JSON.stringify(Object.fromEntries(data));

    if (!validate(event.target)) {
      return
    }

    //resetProfile($profile);

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
        displayError(json.error);
      } else {
        renderProfile(json, $profile);
      }
    }).catch(function(err) {
      console.error(`Error: ${err}`);
    });
  });
}

function resetProfile(profileElement) {
  profileElement.innerHTML = '';
  profileElement.classList.add('loading');
}

async function renderProfile(dbData, profileElement) {
  profileElement.innerHTML = `<code>${JSON.stringify(dbData)}</code>`;
}

function displayError(error) {
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

async function getFormData(userData) {
  const formJson = await fetchJson('./json/form.json');
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
async function render(templatePath, data) {
  const template = await fetchTemplate(templatePath);
  const compiledTemplate = Handlebars.compile(template);
  const htmlString = compiledTemplate(data);
  return htmlString;
}

async function fetchTemplate(path) {
  const response = await fetch(path);
  const responseText = await response.text();
  return responseText;
}

async function fetchJson(path) {
  const response = await fetch(path);
  const responseJson = await response.json();
  return responseJson;
}
