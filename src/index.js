import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.scss';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { DataProvider } from './context/DataContext'

ReactDOM.render(
    <DataProvider>
      <App />
    </DataProvider>,
  document.getElementById('root')
);

