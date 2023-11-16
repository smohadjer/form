const $form = document.querySelector('#form');
const $profile = document.querySelector('#profile');
resetProfile($profile);
addListener($form);
const data = await fetchJson('/api/profile');
console.log(data);
renderForm(data, $form);
renderProfile(data, $profile);

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
      console.log(json);
      renderProfile(json, $profile);
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
  element.innerHTML = `<code>${JSON.stringify(data)}</code>`;
  element.classList.remove('loading');
}

async function renderForm(userData, formContainer) {
  const template = await fetchTemplate('form.hbs');
  const formJson = await fetchJson('form.json');

  // add value from database to form fields
  formJson.fields.map(field => {
    const dbField = userData.find((item) => item.name === field.name);
    return field.value = dbField.value;
  })

  const compiledTemplate = Handlebars.compile(template);
  const html = compiledTemplate(formJson);
  formContainer.innerHTML = html;
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
