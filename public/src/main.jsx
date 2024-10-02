import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get the root element from the DOM
const container = document.getElementById('root');

// Create a root for React 18
const root = ReactDOM.createRoot(container);

// Render your app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
