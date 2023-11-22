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
  }).then(function (response) {
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
export default function Form({
  data,
  formCallback,
  profileCallback
}) {
  console.log(data);
  return /*#__PURE__*/React.createElement("div", {
    className: "form"
  }, /*#__PURE__*/React.createElement("h2", null, "Edit Profile"), /*#__PURE__*/React.createElement("div", {
    id: "form"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      submitHandler(e, formCallback, profileCallback);
    },
    method: "POST",
    action: "api/profile"
  }, data.map((item, index) => /*#__PURE__*/React.createElement("div", {
    className: "row",
    key: index
  }, /*#__PURE__*/React.createElement("label", null, item.label, ":", item.required ? '*' : ''), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
    name: item.name,
    defaultValue: item.value
  }), /*#__PURE__*/React.createElement("p", {
    className: "error",
    hidden: true
  }, item.error)))), /*#__PURE__*/React.createElement("button", null, "Submit"))));
}