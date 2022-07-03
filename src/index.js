import '../assets/application.scss';
import ReactDOM from 'react-dom';

import init from './init.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const render = async () => {
  const vdom = await init();

  ReactDOM.render(vdom, document.getElementById('chat'));
};

render();
