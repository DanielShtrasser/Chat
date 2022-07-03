import React, { useState } from 'react';
import {
  Navbar, Container, Button, Dropdown, DropdownButton,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { toUpper } from 'lodash';
import { useAuth } from '../hooks/index.js';

const LngButton = () => {
  const { i18n } = useTranslation();
  const [title, setTitle] = useState('RU');

  return (
    <>
      <DropdownButton
        size="sm"
        title={title}
        onSelect={(evt) => {
          i18n.changeLanguage(evt);
          setTitle(toUpper(evt));
        }}
        className="ms-auto me-2"
        align="end"
      >
        <Dropdown.Item className="text-center bg-primary" style={{ '--bs-bg-opacity': '.3' }} eventKey="ru">RUSSIA</Dropdown.Item>
        <Dropdown.Item className="text-center bg-primary border-top border-primary" style={{ '--bs-bg-opacity': '.3' }} eventKey="en">ENGLISH</Dropdown.Item>
      </DropdownButton>
    </>
  );
};

const AuthButton = () => {
  const { t } = useTranslation();
  const auth = useAuth();

  return auth.loggedIn ? (
    <Button variant="primary" onClick={auth.logOut}>
      {t('buttons.logOut')}
    </Button>
  ) : null;
};

const AppNavbar = () => (
  <Navbar className="shadow-sm mb=2" bg="white">
    <Container>
      <Navbar.Brand as={Link} to="/">
        Chat
      </Navbar.Brand>
      <LngButton />
      <AuthButton />
    </Container>
  </Navbar>
);

export default AppNavbar;
