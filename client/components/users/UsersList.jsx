import React from 'react';
import ListRow from './ListRow';
/**
 * Functional stateless component.
 */
const UsersList = ({ users, deleteUser, auth }) => {
  const usersRow = users.map((user) => {
    <ListRow
      user={user}
      key={user.id}
      deleteUser={deleteUser}
      auth={auth}
    />;
  });
  return (
    <table className="responsive-table bordered striped">
      <thead>
        <th>UserName</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Date Joined</th>
        <th>Delete</th>
      </thead>
      <tbody>
        {usersRow}
      </tbody>
    </table>
  );
};

UsersList.propTypes = {
  users: React.PropTypes.array.isRequired,
  deleteUser: React.PropTypes.func.isRequired,
  auth: React.PropTypes.object.isRequired,
};

export default UsersList;
