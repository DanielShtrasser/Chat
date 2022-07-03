import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const FormContainer = ({ children }) => (
  <Container fluid className="h-100 p-0">
    <Row className="justify-content-center align-content-center h-100 m-0">
      <Col xs={12} md={8} xxl={6} className="p-0">
        {children}
      </Col>
    </Row>
  </Container>
);

export default FormContainer;
