import validate from './validate.js';

const $form = document.querySelector('#form');

// set submit listener on form so form data is sent by js to server
addListener($form);

const userData = await fetchJson('/api/profile');
console.log(userData);

// add form to the page
$form.innerHTML = await renderForm(userData);

// display user data in profile
const $profile = document.querySelector('#profile');
renderProfile(userData, $profile);

function addListener(form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.target);

    if (!validate(event.target)) {
      return
    }

    resetProfile($profile);

    fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(data))
    })
    .then((response) => response.json())
    .then(async (json) => {
      console.log(json);
      renderProfile(json, $profile);
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
  profileElement.classList.remove('loading');
}

async function renderForm(userData) {
  const template = await fetchTemplate('./template/form.hbs');
  const formJson = await fetchJson('./json/form.json');

  // add value from database to form fields
  formJson.fields.map(field => {
    const dbField = userData.find((item) => item.name === field.name);
    return field.value = dbField.value;
  })

  // compiles static handlebars template to a function
  const compiledTemplate = Handlebars.compile(template);


  // return form markup
  const markup = compiledTemplate(formJson);
  return markup;
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
