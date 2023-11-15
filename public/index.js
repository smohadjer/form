import {fetchTemplate, fetchJson, sort} from './lib.js';

const $form = document.querySelector('#form');
const $profile = document.querySelector('#profile');
resetProfile($profile);
addListener($form);
const data = await fetchJson('/api/profile');
const sortedData = sort([...data]);
console.log(sortedData);
renderForm(data, $form);
renderProfile(sortedData, $profile);

function addListener(form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    resetProfile($profile);
    const data = new FormData(event.target);

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
      const sortedData = sort([...json]);
      renderProfile(sortedData, $profile);
    }).catch(function(err) {
      console.error(`Error: ${err}`);
    });
  });
}

function resetProfile(element) {
  element.innerHTML = '';
  element.classList.add('loading');
}

async function renderProfile(data, element) {
  const templateProfile = await fetchTemplate('templates/profile.hbs');
  const compiledProfile = Handlebars.compile(templateProfile);
  const htmlProfile = compiledProfile(data);
  element.innerHTML = htmlProfile;
  element.classList.remove('loading');
}

async function renderForm(data, element) {
  const template = await fetchTemplate('templates/form.hbs');
  const json = await fetchJson('form.json');

  // add value from database to form fields
  json.fields.map(field => {
    const dbField = data.find((item) => item.name === field.name);
    return field.value = dbField.value;
  })

  const compiledTemplate = Handlebars.compile(template);
  const html = compiledTemplate(json);
  element.innerHTML = html;
}
