import {
  addSubmitListener,
  fetchJson,
  getFormData,
  renderForm,
  renderProfile
} from './lib.js';

// cache DOM elements
const $form = document.querySelector('#form');
const $profile = document.querySelector('#profile');

// add submit handler to the form
addSubmitListener($form, $profile);

// get user's data from database
const userData = await fetchJson('/api/profile');

// ged form data from static json
const formData = await getFormData('./json/form.json', userData);

// add form and profile sections to the page
renderForm(formData, $form);
renderProfile(userData, $profile);
