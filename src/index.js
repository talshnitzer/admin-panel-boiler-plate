import React from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from './AppWrapper';
import {HashRouter} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'prismjs/themes/prism-coy.css';
import {Growl} from "primereact/growl";
import { Provider } from 'react-redux';
import Store from "./redux/store";
import socketIOClient from "socket.io-client";
import environment from "./shared/env";


export const globals = {
	growlRef: null,
	//socket: socketIOClient(environment.baseUrl),
}

//michael added
//--new add

ReactDOM.render(
	<HashRouter>
		<Growl ref={(el) => globals.growlRef = el} />
		<Provider store={Store}>
			<AppWrapper></AppWrapper>
		</Provider>
	</HashRouter>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
