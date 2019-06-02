import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import Blocks from './components/Blocks';
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';
import './index.css';
import { Router, Switch, Route} from 'react-router-dom';
import history from './history';

// This markup is known as JSX, Javascript XML
// JSX is used to structure React components
render(
    <Router history={history}>
        <Switch>
            <Route exact path='/'component={App} />
            <Route path='/blocks'component={Blocks} />
            <Route path='/conduct-transaction' component={ConductTransaction}/>
            <Route path='/transaction-pool' component={TransactionPool}/>
        </Switch>
    </Router> ,
    document.getElementById('root')
); 