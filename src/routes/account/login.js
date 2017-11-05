import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import Container from '../../components/Container';
import Input from '../../components/Input';

export default class Login extends Component {
	state = {
		email: '',
		pass: '',
		error: null
	}

	signInWithEmailAndPassword = (e) => {
		e.preventDefault();
		let { AuthStore } = this.context.mobxStores,
			{ email, pass, error } = this.state;

		if (error) this.setState({ error: null });
		
		return AuthStore.signIn({ email, pass })
			.catch((error) => this.setState({ error }));
	}
	
	signInWithGoogle = (event) => {
		let { AuthStore } = this.context.mobxStores,
			{ error } = this.state;

		if (error) this.setState({ error: null });

		return AuthStore.signIn('google')
			.catch((error) => this.setState({ error }));
	}

	render = (props, { email, pass, error }) => (
		<Container slim>
			<h1>Login</h1>
			{ error && <p>{ error.message }</p> }
			<form onSubmit={this.signInWithEmailAndPassword}>
				<Input
					fullWidth
					type="email"
					label="Email"
					value={email}
					onInput={this.linkState('email', 'target.value')}
				/>
				<Input
					fullWidth
					type="password"
					label="Password"
					value={pass}
					onInput={this.linkState('pass', 'target.value')}
				/>
				<br />
				<button type="submit">Login</button>
			</form>
			<br />
			<br />
			<button onClick={this.signInWithGoogle}>Log in with Google</button>
			<br />
			<br />
			<p>No account yet? <Link to="/account/create">Sign up</Link></p>
		</Container>
	);
}