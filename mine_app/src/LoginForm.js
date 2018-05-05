import React, { Component } from 'react';
import { getGames, login } from './API';
import './App.css';


class LoginForm extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			username: '',
			password: ''
		}
	}

	doLogin(event) {
		let foo = login(this.state.username, this.state.password).then((foo) => {
      if (foo !== undefined) {
        this.props.goTo('/dash');
      }
    })
    event.preventDefault();
	}

	handleChangePassword(event) {
		this.setState({password: event.target.value})
	}

	handleChangeUsername(event) {
		this.setState({username: event.target.value})
	}

  render() {
    return (
			<div>
				<form className={"login-form"}>
					<input onChange={this.handleChangeUsername.bind(this)} value={this.state.username} placeholder={"username"} type="text" name="username" />
					<input onChange={this.handleChangePassword.bind(this)} value={this.state.password} placeholder={"password"} type="password" name="password" />
					<button onClick={this.doLogin.bind(this)} type="submit">Login</button>
				</form>
			</div>	
    )
  }
}

export default LoginForm
