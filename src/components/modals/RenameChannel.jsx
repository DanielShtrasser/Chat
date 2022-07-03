import React, { useState, useRef, useEffect } from 'react';
import {
  Modal, Form, Button, Spinner,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';

import { useSocket } from '../../hooks/index.js';
import { channelSchema } from '../../validationSchemas.js';

const RenameChannelForm = ({ onHide, toast }) => {
  const { channelId, name } = useSelector((state) => state.modal.extra);
  const { channels } = useSelector((state) => state.channelsInfo);
  const channelsNames = channels.map(({ name: channelName }) => channelName);
  const { t } = useTranslation();
  const socket = useSocket();

  const nameRef = useRef();

  useEffect(() => {
    nameRef.current.select();
  }, []);

  return (
    <Formik
      validationSchema={channelSchema(channelsNames)}
      initialValues={{
        name,
      }}
      onSubmit={({ name: newName }, { setSubmitting }) => {
        setSubmitting(true);

        const channel = { id: channelId, name: newName };

        socket.emit('renameChannel', channel, ({ status }) => {
          if (status === 'ok') {
            onHide();
          }
        });
        toast.success(t('texts.channelRenamed'));
      }}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        handleSubmit, handleChange, isSubmitting, values, errors,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control
              name="name"
              aria-label={t('labels.newChannelName')}
              data-testid="rename-channel"
              className="mb-2"
              onChange={handleChange}
              value={values.name}
              isInvalid={errors.name}
              readOnly={isSubmitting}
              ref={nameRef}
            />
            <Form.Control.Feedback type="invalid">
              {t(errors.name)}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end pt-2">
            <Button
              type="button"
              className="me-2"
              variant="secondary"
              onClick={onHide}
              disabled={isSubmitting}
            >
              {t('buttons.cancel')}
            </Button>
            <Button
              type="submit"
              data-testid="rename-button"
              disabled={isSubmitting}
            >
              {isSubmitting && (
              <Spinner className="mr-1" animation="border" size="sm" />
              )}
              {t('buttons.send')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const RenameChannel = ({ onExited, toast }) => {
  const [show, setShow] = useState(true);
  const { t } = useTranslation();

  const onHide = () => {
    setShow(false);
  };

  return (
    <Modal show={show} onHide={onHide} onExited={onExited} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('texts.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RenameChannelForm onHide={onHide} toast={toast} />
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
