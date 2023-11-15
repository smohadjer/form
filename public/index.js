const app = document.querySelector('#app');
const profileElm = document.querySelector('#profile');
const formElm = document.querySelector('#form');

const setSubmitListener = (app) => {
  app.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.target;

    // empty target and show a loading animation there
    profileElm.innerHTML = '';
    profileElm.classList.add('loading');

    const data = new FormData(form);
    console.log(JSON.stringify(Object.fromEntries(data)));

    // calling fetch async
    fetch('/api/profile', {
      method: 'POST',
      headers: fetchOptions.headers,
      body: JSON.stringify(Object.fromEntries(data))
    })
    .then((response) => response.json())
    .then(async (json) => {
      console.log(json);
      renderProfile(json);
    }).catch(function(err) {
      console.error(`Error: ${err}`);
    });
  });
}

const fetchOptions = {
  endpoint: '/api/profile',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  target: document.querySelector('#name')
};

const fetchData = async (options) => {
  const response = await fetch(options.endpoint, {
    method: options.method,
    headers: options.headers
  });
  const data = await response.json();
  return data;
};

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

async function renderProfile(data) {
  console.log({data});
  const templateProfile = await fetchTemplate('templates/profile.hbs');
  const compiledProfile = Handlebars.compile(templateProfile);
  const htmlProfile = compiledProfile(data);
  profileElm.innerHTML = htmlProfile;
  profileElm.classList.remove('loading');
}

async function renderForm() {
  const template = await fetchTemplate('templates/form.hbs');
  const json = await fetchJson('form.json');
  const compiledTemplate = Handlebars.compile(template);
  const html = compiledTemplate(json);
  formElm.innerHTML = html;
}

profileElm.classList.add('loading');

// sends data to server once form submits
setSubmitListener(app);

// fetches data from server
const data = await fetchData(fetchOptions);

renderForm();
renderProfile(data)
