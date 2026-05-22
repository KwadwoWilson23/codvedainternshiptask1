import UserCard from './UserCard.jsx';

export default function UserList({ users, loading, error, onEdit, onDelete, onRefresh }) {
  return (
    <section className="panel list-panel">
      <div className="list-header">
        <h2>All Users</h2>
        <button className="btn ghost" onClick={onRefresh} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      {error && <p className="msg error">Error: {error}</p>}
      {!error && loading && <p className="msg loading">Loading users...</p>}
      {!error && !loading && users.length === 0 && (
        <div className="empty">No users yet. Add one with the form on the left.</div>
      )}
      {!error && users.length > 0 && (
        <div className="user-grid">
          {users.map((u) => (
            <UserCard key={u._id} user={u} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
