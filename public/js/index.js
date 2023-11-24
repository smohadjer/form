import {
  addSubmitListener,
  fetchJson,
  getFormData,
  render,
  renderProfile
} from './lib.js';

// cache DOM elements
const $form = document.querySelector('#form');
const $profile = document.querySelector('#profile');

// generate form from json and display it on the page

addSubmitListener($form, $profile);
const userData = await fetchJson('/api/profile');
const formData = await getFormData(userData);
$form.innerHTML = await render('./template/form.hbs', formData);

// populate profile with data and display it on the page
renderProfile(userData, $profile);
