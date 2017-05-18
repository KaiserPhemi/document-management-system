import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './Routes';

render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById('main-app')
);