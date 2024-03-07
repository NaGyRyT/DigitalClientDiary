import React,  { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import './Loginform.css';
import API from '../../api';

export default function Loginform( { setToken, setLoggedInUserData }) {
	const [username, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	async function loginUser(credentials) {
		await axios.post(`${API.address}/login`, 
			{
				username : credentials.username.trim(), 
				password : credentials.password.trim()
			},
			{
				headers: 
					{
				  		'x-api-key': API.key
					}
			}
			)
		.then ((data) => {
			if (data.data.length !== 0) {
				setMessage('');
				setToken(true);
				setLoggedInUserData(data.data[0])
				sessionStorage.setItem("token", data.data[0].username + data.data[0].password);
			} else {
				setMessage('Rossz felhasználónév vagy jelszó');
			}
		})
	};

	const handleLoginSubmit = async (e) => {
		e.preventDefault();
		e.stopPropagation()
		loginUser({
			username,
			password
		});
	};

return (
    <div className='login-form'>
		<Container>
			<h1>Kérlek lépj be</h1>
			{(message === '') ? 
					'' :
					<Alert variant="danger">{message}</Alert>	
				}
			<Form noValidate onSubmit={handleLoginSubmit}>
				<Form.Group className="mb-3" controlId="formUsername">
					<Form.Label>Felhasználónév</Form.Label>
					<Form.Control 
						required
						type="text" 
						placeholder="Írd be a felhasználó nevedet!"
						autoComplete="username"
						onChange={e => setUserName(e.target.value)}/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formPassword">		
					<Form.Label>Jelszó</Form.Label>
					<Form.Control 
						required
						type="password" 
						placeholder="Írd be a jelszavadat!"
						autoComplete="new-password"
						onChange={e => setPassword(e.target.value)}/>
				</Form.Group>
				<Button variant="primary" type="submit">
					Belépés
				</Button>
			</Form>
		</Container>
    </div>
  )
}