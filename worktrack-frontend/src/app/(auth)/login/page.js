"use client";
import { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import api from "@/services/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", { email, password });

      if (response.data.token) {
        login(response.data.token);
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Invalid email or password. Please try again.");
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center bg-light"
      style={{ minHeight: "100vh" }}
    >
      <Row>
        <Col>
          <Card style={{ width: "24rem" }} className="p-4 shadow-sm">
            <Card.Body>
              <div className="text-center mb-4">
                <h1 className="fw-bold text-primary">WorkTrack</h1>
                <h2 className="h4 text-muted mt-3">Sign in to your account</h2>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group
                  className="d-flex justify-content-between align-items-center mb-3"
                  controlId="formBasicCheckbox"
                >
                  <Form.Check type="checkbox" label="Remember me" />
                  <a href="#" className="text-decoration-none">
                    Forgot your password?
                  </a>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
