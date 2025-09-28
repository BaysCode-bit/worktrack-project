"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Form, Button, Card, Spinner, Alert, Image } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/services/api";

const EmployeeFormPage = () => {
  const router = useRouter();
  const params = useParams();
  const { employeeId: id } = params;
  const isEditing = id !== "new";

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    address: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      api
        .get(`/employees/${id}`)
        .then((response) => {
          const { name, position, address, photo } = response.data;
          setFormData({ name, position, address });
          if (photo) {
            setPhotoPreview(`http://localhost:8000/public/${photo}`);
          }
        })
        .catch((err) => {
          setError("Failed to fetch employee data.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("position", formData.position);
    data.append("address", formData.address);
    if (photoFile) {
      data.append("photo", photoFile);
    }

    try {
      if (isEditing) {
        await api.put(`/employees/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Employee updated successfully!");
      } else {
        await api.post("/employees", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Employee created successfully!");
      }
      setTimeout(() => router.push("/employees"), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={1500} />
      <div className="mb-4">
        <h1 className="h3">{isEditing ? "Edit Employee" : "Add Employee"}</h1>
        <p className="text-muted">
          {isEditing
            ? "Update employee information"
            : "Add a new employee to the system"}
        </p>
      </div>
      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Photo</Form.Label>
              <div className="d-flex align-items-center">
                <Image
                  src={photoPreview || "https://via.placeholder.com/100"}
                  alt={
                    formData.name
                      ? `${formData.name}'s photo`
                      : "Employee photo"
                  }
                  roundedCircle
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                  className="me-3"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => fileInputRef.current.click()}
                >
                  Upload Photo
                </Button>
                <Form.Control
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  className="d-none"
                  accept="image/jpeg,image/png"
                />
              </div>
              <Form.Text className="text-muted">
                Max 300KB. JPG, JPEG, PNG.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>
                Full Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="position">
              <Form.Label>
                Position <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                type="button"
                className="me-2"
                onClick={() => router.push("/employees")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : isEditing ? (
                  "Update Employee"
                ) : (
                  "Add Employee"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EmployeeFormPage;
