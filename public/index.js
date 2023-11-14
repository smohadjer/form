const form = document.querySelector('form');
const addListener = (form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    fetch(form.action, {
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
        fetchData();
    }).catch(function(err) {
        console.error(`Error: ${err}`);
    });
  });
}
const fetchData = () => {
  fetch('/api/profile', {
    method: 'GET',
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    }
  })
  .then((response) => response.json())
  .then(async (json) => {
      console.log(json);
      const name = document.querySelector('#name');
      if (name && json.length > 0) {
        name.innerHTML = json[0].name
      }
  }).catch(function(err) {
      console.error(`Error: ${err}`);
  });
};

addListener(form);
fetchData();
