"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, Button, Spinner, Alert, Image, Modal } from "react-bootstrap";
import {
  PersonPlusFill,
  PencilFill,
  TrashFill,
  EyeFill,
} from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/services/api";

const EmployeesPage = () => {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (err) {
      setError("Failed to fetch employees. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleShowDeleteModal = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    try {
      await api.delete(`/employees/${employeeToDelete.id}`);
      toast.success(
        `Employee '${employeeToDelete.name}' deleted successfully!`
      );
      fetchEmployees();
    } catch (err) {
      toast.error("Failed to delete employee.");
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
          <h1 className="h3">Employees</h1>
          <p className="text-muted">
            Manage your organization&apos;s employees
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push("/employees/form/new")}
        >
          <PersonPlusFill className="me-2" />
          Add Employee
        </Button>
      </div>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Position</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="text-center">
                {employee.photo ? (
                  <Image
                    src={`http://localhost:8000/public/${employee.photo}`}
                    roundedCircle
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                    alt={employee.name}
                  />
                ) : (
                  <div
                    style={{ width: "40px", height: "40px" }}
                    className="bg-secondary rounded-circle d-inline-block"
                  ></div>
                )}
              </td>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>{employee.address}</td>
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
                  onClick={() => router.push(`/employees/form/${employee.id}`)}
                >
                  <PencilFill />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleShowDeleteModal(employee)}
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
          Are you sure you want to delete the employee{" "}
          <strong>{employeeToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteEmployee}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeesPage;
