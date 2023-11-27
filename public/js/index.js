import {
  addSubmitListener,
  fetchJson,
  populateForm,
  renderForm,
  renderProfile
} from './lib.js';

// cache DOM elements
const $form = document.querySelector('#form');
const $profile = document.querySelector('#profile');

// add submit handler to the form
addSubmitListener($form, $profile);

const formData = await fetchJson('./json/form.json');
// add form to the page
renderForm(formData, $form);

// get user's data from database and display it on page
const userData = await fetchJson('/api/profile');
renderProfile(userData, $profile);

// populate form with user data
populateForm(userData, $form);
