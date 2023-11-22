export default function Profile({
  data
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "profile"
  }, /*#__PURE__*/React.createElement("h2", null, "My Profile"), /*#__PURE__*/React.createElement("p", null, "Here we simply log users data from database:"), /*#__PURE__*/React.createElement("div", {
    id: "profile"
  }, /*#__PURE__*/React.createElement("code", null, JSON.stringify(data))));
}