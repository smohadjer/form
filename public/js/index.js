import {
  addEventListeners,
  fetchJson,
  renderForm,
  renderProfile
} from './lib.js';

async function init() {
  // cache DOM elements
  const $form = document.querySelector('#form');
  const $profile = document.querySelector('#profile');

  // add submit handler to the form
  addEventListeners($form, $profile);

  const formData = await fetchJson('./json/form.json');
  // adding empty form to the page
  renderForm(formData, $form);

  $form.addEventListener('click', (event) => {
    // reset form
    if (event.target.getAttribute('id') === 'reset') {
      renderForm(formData, $form);
    }

    // populate form
    if (event.target.getAttribute('id') === 'populate') {
      const serverData = structuredClone(formData);
      serverData.fields.map((item) => {
        const valueFromDB = userData[0][item.name];
        item.value = valueFromDB;
        return item;
      });
      renderForm(serverData, $form);
    }
  });

  // get user's data from database and display it on page
  const userData = await fetchJson('/api/profile');
  renderProfile(userData, $profile);
}

init();


