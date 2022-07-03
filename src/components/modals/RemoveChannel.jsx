import React, { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { useSocket } from '../../hooks/index.js';

const RemoveChannel = ({ onExited, toast }) => {
  const [show, setShow] = useState(true);
  const [pending, setPending] = useState(false);
  const { t } = useTranslation();
  const { channelId } = useSelector((state) => state.modal.extra);
  const socket = useSocket();

  const onHide = () => {
    setShow(false);
  };

  const handleRemoveChannel = () => {
    setPending(true);

    const channel = { id: channelId };

    socket.emit('removeChannel', channel, ({ status }) => {
      if (status === 'ok') {
        onHide();
      }
    });
    toast.success(t('texts.channelRemoved'));
  };

  return (
    <Modal show={show} onHide={onHide} onExited={onExited} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('texts.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('texts.areYouSure')}</p>
        <div className="d-flex justify-content-end">
          <Button
            type="button"
            variant="secondary"
            className="me-2"
            onClick={onHide}
            disabled={pending}
          >
            {t('buttons.cancel')}
          </Button>
          <Button
            type="button"
            variant="danger"
            data-testid="remove-button"
            disabled={pending}
            onClick={handleRemoveChannel}
          >
            {pending && (
              <Spinner className="me-1" animation="border" size="sm" />
            )}
            {t('buttons.remove')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveChannel;
