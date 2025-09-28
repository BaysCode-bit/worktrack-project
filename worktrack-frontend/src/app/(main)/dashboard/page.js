"use client";
import { Card, Row, Col } from "react-bootstrap";
import { PeopleFill, BriefcaseFill, Activity } from "react-bootstrap-icons";

const DashboardPage = () => {
  const stats = [
    {
      title: "Total Users",
      value: 42,
      icon: <PeopleFill size={32} className="text-primary" />,
    },
    {
      title: "Total Employees",
      value: 156,
      icon: <BriefcaseFill size={32} className="text-success" />,
    },
    {
      title: "Total Sessions",
      value: 24,
      icon: <PeopleFill size={32} className="text-info" />,
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h1 className="h3">Dashboard</h1>
        <p className="text-muted">
          Overview of your organization&apos;s data and activity
        </p>
      </div>

      <Row>
        {stats.map((stat, index) => (
          <Col md={4} key={index} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="p-3 bg-light rounded-3 me-3">{stat.icon}</div>
                <div>
                  <Card.Text className="mb-0 text-muted">
                    {stat.title}
                  </Card.Text>
                  <Card.Title className="h4 mb-0">{stat.value}</Card.Title>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header as="h5">Recent Activity</Card.Header>
            <Card.Body>
              <p className="text-muted text-center">
                No recent activity found.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
