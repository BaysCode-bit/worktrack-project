"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/services/api";

const UserFormPage = () => {
  const router = useRouter();
  const params = useParams();
  const { userId: id } = params;
  const isEditing = id !== "new";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "Staff",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      api
        .get(`/users/${id}`)
        .then((response) => {
          const { username, email, role } = response.data;
          setFormData({ username, email, role, password: "" });
        })
        .catch((err) => {
          setError("Failed to fetch user data.");
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const userData = { ...formData };
    if (isEditing && !userData.password) {
      delete userData.password;
    }

    try {
      if (isEditing) {
        await api.put(`/users/${id}`, userData);
        toast.success("User updated successfully!");
      } else {
        await api.post("/users", userData);
        toast.success("User created successfully!");
      }
      setTimeout(() => router.push("/users"), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
      />
      <div className="mb-4">
        <h1 className="h3">{isEditing ? "Edit User" : "Create User"}</h1>
        <p className="text-muted">
          {isEditing
            ? "Update user information"
            : "Add a new user to the system"}
        </p>
      </div>
      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>
                Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>
                Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="role">
              <Form.Label>
                Role <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>
                {isEditing ? "New Password" : "Password"}{" "}
                {isEditing ? "" : <span className="text-danger">*</span>}
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditing}
                disabled={loading}
              />
              {isEditing && (
                <Form.Text className="text-muted">
                  Leave blank to keep the current password.
                </Form.Text>
              )}
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                type="button"
                className="me-2"
                onClick={() => router.push("/users")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : isEditing ? (
                  "Update User"
                ) : (
                  "Create User"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserFormPage;
