
function submitHandler(e, formCallback, profileCallback) {
  e.preventDefault();

  const formData = new FormData(e.target);
  for (const pair of formData.entries()) {
    //console.log(`${pair[0]}, ${pair[1]}`);
  }
  const jsonData = Object.fromEntries(formData);
  const dataJsonString = JSON.stringify(jsonData);

  fetch('api/profile', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: dataJsonString
  })
  .then(function (response) {
    // The API call was successful!
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
  }).then(function (json) {
    if (json.error) {
      formCallback(json.error);
    } else {
      profileCallback(json);
    }
  }).catch(function (err) {
    // There was an error
    console.warn('Something went wrong.', err);
  });
}

export default function Form({data, formCallback, profileCallback}) {
  console.log(data);
  return (
    <div className="form">
      <h2>Edit Profile</h2>
      <div id="form">
        <form onSubmit={(e) => {submitHandler(e, formCallback, profileCallback)}} method="POST" action="api/profile">
          {
            data.map((item, index) =>
              <div className="row" key={index}>
                <label>{item.label}:
                  {item.required ? '*' : ''}
                </label>
                <div>
                  <input name={item.name} defaultValue={item.value}/>
                  <p className="error" hidden>{item.error}</p>
                </div>
              </div>
            )
          }
          <button>Submit</button>
        </form>
      </div>
    </div>
  )
}
