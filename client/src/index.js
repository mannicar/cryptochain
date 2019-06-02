import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import './index.css';

// This markup is known as JSX, Javascript XML
// JSX is used to structure React components
render(<App /> ,
    document.getElementById('root')
); 