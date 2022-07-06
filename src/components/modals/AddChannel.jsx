import React, { useRef, useEffect, useState } from 'react';
import {
  Modal, Form, Button, Spinner,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import { useSocket } from '../../hooks/index.js';
import { channelSchema } from '../../validationSchemas.js';

const AddChannelForm = ({ onHide, toast }) => {
  const { channels } = useSelector((state) => state.channelsInfo);
  const channelsNames = channels.map(({ name }) => name);
  const { t } = useTranslation();
  const socket = useSocket();

  const nameRef = useRef();

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  return (
    <Formik
      validationSchema={channelSchema(channelsNames)}
      initialValues={{
        name: '',
      }}
      onSubmit={({ name }, { setSubmitting }) => {
        const channel = { name };

        socket.emit('newChannel', channel, ({ status }) => {
          if (status === 'ok') {
            onHide();
            setSubmitting(false);
          }
        });
        toast.success(t('texts.channelСreated'));
      }}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        handleSubmit, handleChange, isSubmitting, values, errors,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label className="visually-hidden" htmlFor="name">
              {t('modals.common.channelName')}
            </Form.Label>
            <Form.Control
              name="name"
              aria-label={t('labels.channelName')}
              className="mb-2"
              onChange={handleChange}
              value={values.name}
              isInvalid={errors.name}
              readOnly={isSubmitting}
              ref={nameRef}
            />
            <Form.Control.Feedback type="invalid">
              {t(`${errors.name}`)}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button
                type="button"
                className="me-2"
                variant="secondary"
                onClick={onHide}
                disabled={isSubmitting}
              >
                {t('buttons.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                <Spinner className="mr-1" animation="border" size="sm" />
                )}
                {t('buttons.add')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
};

const AddChannel = ({ onExited, toast }) => {
  const [show, setShow] = useState(true);

  const onHide = () => {
    setShow(false);
  };

  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={onHide} onExited={onExited} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('texts.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddChannelForm onHide={onHide} toast={toast} />
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;
