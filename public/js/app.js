import Form from './components/form.js';
import Profile from './components/profile.js';
const app = document.getElementById('app');
async function fetchJson(path) {
  const response = await fetch(path);
  const json = await response.json();
  return json;
}
async function getFormData(userData) {
  const formJson = await fetchJson('json/form.json');
  // add value from database to form fields
  if (userData.length > 0) {
    formJson.fields.map(field => {
      const dbField = userData.find(item => item.name === field.name);
      return field.value = dbField.value;
    });
  }
  return formJson;
}
function App() {
  const [formData, setFormData] = React.useState([]);
  const [userData, setUserData] = React.useState([]);
  React.useEffect(() => {
    fetchJson('/api/profile').then(result => {
      setUserData(result);
      getFormData(result).then(json => {
        setFormData(json.fields);
      });
    });
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Form, {
    data: formData,
    formCallback: setFormData,
    profileCallback: setUserData
  }), /*#__PURE__*/React.createElement(Profile, {
    data: userData
  }));
}
ReactDOM.render( /*#__PURE__*/React.createElement(App, null), app);