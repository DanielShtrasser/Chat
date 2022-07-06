import React from 'react';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';

import App from './components/App.jsx';
import store from './store.js';
import resources from './locales/index.js';
import {
  addChannel,
  removeChannel,
  renameChannel,
} from './slices/channelsInfoSlice.js';
import { addMessage } from './slices/messagesInfoSlice.js';

export default async (socket = io()) => {
  const i18nInstance = i18n.createInstance();

  await i18nInstance.use(LanguageDetector).use(initReactI18next).init({
    resources,
  });

  socket.on('newMessage', (message) => {
    store.dispatch(addMessage({ message }));
  });

  socket.on('newChannel', (channel) => {
    store.dispatch(addChannel({ channel }));
  });

  socket.on('removeChannel', ({ id }) => {
    store.dispatch(removeChannel({ id }));
  });

  socket.on('renameChannel', ({ id, name }) => {
    store.dispatch(renameChannel({ id, name }));
  });

  return (
    <Provider store={store}>
      <App socket={socket} />
    </Provider>
  );
};
