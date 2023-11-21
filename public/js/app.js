const app = document.getElementById('app');
function App() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "form"
  }, /*#__PURE__*/React.createElement("h2", null, "Edit Profile"), /*#__PURE__*/React.createElement("div", {
    id: "form"
  })), /*#__PURE__*/React.createElement("div", {
    className: "profile"
  }, /*#__PURE__*/React.createElement("h2", null, "My Profile"), /*#__PURE__*/React.createElement("p", null, "Here we simply log users data from database:"), /*#__PURE__*/React.createElement("div", {
    id: "profile"
  })));
}
ReactDOM.render( /*#__PURE__*/React.createElement(App, null), app);