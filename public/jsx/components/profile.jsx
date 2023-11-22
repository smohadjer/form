
export default function Profile({data}) {
  return (
    <div className="profile">
      <h2>My Profile</h2>
      <p>Here we simply log users data from database:</p>
      <div id="profile">
        <code>{JSON.stringify(data)}</code>
      </div>
    </div>
  )
}
