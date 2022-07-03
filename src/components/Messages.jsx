import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Col, Form, InputGroup, Button, Spinner,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import filter from 'leo-profanity';

import { useSocket } from '../hooks/index.js';

const getUsername = () => localStorage.getItem('username');

const MessagesBoxHeader = () => {
  const { currentChannelId } = useSelector((state) => state.channelsInfo);
  const { channels } = useSelector((state) => state.channelsInfo);
  const { messages } = useSelector((state) => state.messagesInfo);
  const currentChannelMessages = messages.filter(
    ({ channelId }) => Number(channelId) === currentChannelId,
  );
  const [{ name: channelName }] = channels.filter(
    ({ id }) => Number(id) === currentChannelId,
  );

  const amountOfMassages = currentChannelMessages.length;

  const { t } = useTranslation();

  return (
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <p className="m-0">
        <b>
          #
          {' '.concat(channelName)}
        </b>
      </p>
      <span className="text-muted">
        {t('texts.amountOfMassages', { count: amountOfMassages })}
      </span>
    </div>
  );
};

const MessagesBox = () => {
  const { currentChannelId } = useSelector((state) => state.channelsInfo);
  const { messages } = useSelector((state) => state.messagesInfo);

  return (
    <div id="messages-box" className="overflow-auto px-md-4 px-sm-1">
      {messages
        .filter(({ channelId }) => Number(channelId) === currentChannelId)
        .map(({ id, body, username }) => (
          <div key={id} className="text-break mb-2">
            <b>{username}</b>
            {': '}
            {body}
          </div>
        ))}
    </div>
  );
};

const NewMessageForm = () => {
  const { currentChannelId } = useSelector((state) => state.channelsInfo);
  const inputRef = useRef();
  const socket = useSocket();

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: ({ body }, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      const censured = filter.clean(body);
      const message = {
        body: censured,
        channelId: currentChannelId,
        username: getUsername(),
      };
      socket.emit('newMessage', message, ({ status }) => {
        if (status === 'ok') {
          setSubmitting(false);

          resetForm();
          inputRef.current.focus();
        }
      });
    },
  });

  useEffect(() => {
    inputRef.current.focus();
  });

  return (
    <div className="mt-auto px-5 py-3">
      <Form
        noValidate
        onSubmit={formik.handleSubmit}
        className="py-1 border rounded-2"
      >
        <InputGroup className="has-validation">
          <Form.Control
            name="body"
            aria-label={t('labels.newMassage')}
            data-testid="new-message"
            onChange={formik.handleChange}
            value={formik.values.body}
            ref={inputRef}
            readOnly={formik.isSubmitting}
            className="border-0 p-0 ps-2"
            placeholder={t('placeholders.enterYouMassage')}
          />
          <Button
            variant="outline-light"
            type="submit"
            disabled={formik.isSubmitting || !formik.values.body}
            className="text-secondary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
              />
            </svg>
            {formik.isSubmitting && (
              <Spinner className="mr-1" animation="border" size="sm" />
            )}
            <span className="visually-hidden">{t('buttons.send')}</span>
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

const Messages = () => (
  <Col className="h-100 p-0">
    <div className="d-flex flex-column h-100">
      <MessagesBoxHeader />
      <MessagesBox />
      <NewMessageForm />
    </div>
  </Col>
);

export default Messages;
