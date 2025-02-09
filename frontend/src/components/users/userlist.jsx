import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './userlist.css';


function Userlist() {
    const [users, setUsers] = useState([]);
    const [editedUser, setEditedUser] = useState({});
    const [deletedUserId, setDeletedUserId] = useState(null);
    
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get("http://localhost:3001/users")
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleDeleteUser = (idusers) => {
        setDeletedUserId(idusers);
    };

    const handleEditUser = (user) => {
        setEditedUser(user);
    };

    const handleSaveUser = () => {
        const { idusers, email, username } = editedUser;

        axios.put(`http://localhost:3001/updateUser/${idusers}`, { email, username })
            .then(() => {
                setUsers(users.map((user) => (user.idusers === editedUser.idusers ? editedUser : user)));
                setEditedUser({});
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleConfirmDeleteUser = () => {
        if (deletedUserId) {
            axios.delete(`http://localhost:3001/delete/${deletedUserId}`)
                .then(() => {
                    setUsers(users.filter((user) => user.idusers !== deletedUserId));
                    setDeletedUserId(null);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    return (
        <div className="app__bg">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.idusers}>
                            <td>{user.idusers}</td>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>
                                <div className="btn-group" role="group" aria-label="User Actions">
                                    <button type="button" className="btn btn-primary" onClick={() => handleEditUser(user)}>Edit</button>
                                    <button type="button" className="btn btn-danger" onClick={() => handleDeleteUser(user.idusers)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editedUser.idusers && (
                <div>
                    <input type="text" value={editedUser.email} onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })} />
                    <input type="text" value={editedUser.username} onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })} />
                    <button className="btn btn-success" onClick={handleSaveUser}>Save</button>
                </div>
            )}

            {deletedUserId && (
                <div className="delete-confirmation">
                    <p>Are you sure you want to delete this user?</p>
                    <div className="buttons">
                        <button className="btn btn-danger" onClick={handleConfirmDeleteUser}>Yes</button>
                        <button className="btn btn-secondary" onClick={() => setDeletedUserId(null)}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Userlist;
