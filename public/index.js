const form = document.querySelector('form');
const setSubmitListener = (form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // empty target and show a loading animation there
    const target = fetchOptions.target;
    target.innerHTML = '';
    target.classList.add('loading');

    const data = new FormData(event.target);

    // calling fetch async
    fetch('/api/profile', {
      method: 'POST',
      headers: fetchOptions.headers,
      body: JSON.stringify(Object.fromEntries(data))
    })
    .then((response) => response.json())
    .then(async (json) => {
      // data was posted successfully to server so we can now update the page
      // since we already have access to data, we don't need to fetch it from server again
      updateDOM(target, data.get('name'));
    }).catch(function(err) {
      console.error(`Error: ${err}`);
    });
  });
}

// updates DOM with data returned from server
const updateDOM = (element, name) => {
  element.innerHTML = name;
  element.classList.remove('loading');
};

const fetchOptions = {
  endpoint: '/api/profile',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  target: document.querySelector('#name')
};

// calling fetch sync
const fetchData = async (options) => {
  const response = await fetch(options.endpoint, {
    method: options.method,
    headers: options.headers
  });
  const data = await response.json();
  return data;
};

// sends data to server once form submits
setSubmitListener(form);

// fetches data from server
const data = await fetchData(fetchOptions);

// update page
updateDOM(fetchOptions.target, data[0].name);

