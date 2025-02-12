import {
  addSubmitListener,
  fetchJson,
  renderForm,
  renderProfile
} from './lib.js';

async function init() {
  // cache DOM elements
  const $form = document.querySelector('#form');
  const $profile = document.querySelector('#profile');

  // add submit handler to the form
  addSubmitListener($form, $profile);

  const formData = await fetchJson('./json/form.json');
  console.log({formData})

  // adding empty form to the page
  renderForm(formData, $form);

  // get user's data from database and display it on page
  const userData = await fetchJson('/api/profile');
  console.log('userdata:', userData[0]);
  renderProfile(userData, $profile);

  // populate form with user data
  const fields = formData.fields.map((item) => {
    const valueFromDB = userData[0][item.name];
    item.value = valueFromDB;
    return item;
  });
  const serverData = {
    form: {...formData.form},
    fields: fields
  };
  console.log(serverData);
  renderForm(serverData, $form);
}

init();


