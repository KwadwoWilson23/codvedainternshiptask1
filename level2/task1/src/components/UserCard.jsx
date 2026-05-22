export default function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p className="email">{user.email}</p>
      <p className="age">{user.age != null ? `Age: ${user.age}` : 'Age: —'}</p>
      <div className="card-actions">
        <button className="btn small ghost" onClick={() => onEdit(user)}>Edit</button>
        <button className="btn small danger" onClick={() => onDelete(user._id)}>Delete</button>
      </div>
    </div>
  );
}
