const app = document.getElementById('app');

function App() {
  return (
    <>
      <div className="form">
        <h2>Edit Profile</h2>
        <div id="form"></div>
      </div>
      <div className="profile">
        <h2>My Profile</h2>
        <p>Here we simply log users data from database:</p>
        <div id="profile"></div>
      </div>
    </>
  )
}


ReactDOM.render(<App />, app);
