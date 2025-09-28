"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, Button, Spinner, Alert, Modal } from "react-bootstrap";
import {
  PersonPlusFill,
  PencilFill,
  TrashFill,
  EyeFill,
} from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/services/api";

const UsersPage = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleShowDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/users/${userToDelete.id}`);
      toast.success(`User '${userToDelete.username}' deleted successfully!`);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user.");
      console.error(err);
    } finally {
      handleCloseDeleteModal();
    }
  };

  if (loading)
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    );
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <ToastContainer position="top-right" autoClose={1500} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3">Users</h1>
          <p className="text-muted">Manage your system users</p>
        </div>

        <Button
          variant="primary"
          onClick={() => router.push("/users/form/new")}
        >
          <PersonPlusFill className="me-2" />
          Add User
        </Button>
      </div>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Button
                  variant="outline-info"
                  size="sm"
                  className="me-2"
                  disabled
                >
                  <EyeFill />
                </Button>

                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => router.push(`/users/form/${user.id}`)}
                >
                  <PencilFill />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleShowDeleteModal(user)}
                >
                  <TrashFill />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the user{" "}
          <strong>{userToDelete?.username}</strong>? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UsersPage;
