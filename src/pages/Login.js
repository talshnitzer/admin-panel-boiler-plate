import React, {Component} from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from "primereact/button";
import {$RtcModel} from "../shared/dirctives";
import {authService} from "../service";
import { withRouter } from "react-router-dom";

class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
		}
	}

	onLogin = (username, password ) => {
		// {window.location = "/#"};
		authService.login(username,password)
			.then((isLoggedIn) => {
				console.log(isLoggedIn);
				const { history } = this.props;

				//if (process.env.REACT_APP_STAGE === 'dev') {
				//	isLoggedIn = true;
				//}

				if (isLoggedIn) {
					history.push('/');
				} else {
				//	login failed
				}
			}).catch(err => console.log(err));
	}

	render() {
		const {username , password} = this.state;
		return <div className="login-body">
			<div className="body-container">
				<div className="p-grid p-nogutter">
					<div className="p-col-12 p-lg-6 left-side">
						<img src="assets/layout/images/logo_login.png"  alt="logo" className="logo"/>
						<h1>Welcome</h1>
						<p>
							Sign in to start your session
						</p>
					</div>
					<div className="p-col-12 p-lg-6 right-side">
						<div className="login-wrapper">
							<div className="login-container">
								<span className="title">Login</span>

								<div className="p-grid p-fluid">
									<div className="p-col-12">
										<InputText value={username} onInput={$RtcModel(this, 'username')}  placeholder="Username"/>
									</div>
									<div className="p-col-12">
										<InputText value={password} onInput={$RtcModel(this, 'password')} type="password" placeholder="Password"/>
									</div>
									<div className="p-col-6">
										<Button
											disabled={(!username || !password)}
											label="Sign In"
											icon="pi pi-check"
											onClick={() => this.onLogin(username,password)} />
									</div>
									<div className="p-col-6 password-container">
										<a href="/#">Forgot Password?</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	}
}

export default withRouter(Login);
