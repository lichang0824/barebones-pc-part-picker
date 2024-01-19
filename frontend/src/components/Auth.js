import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import {usernameState} from './GlobalStates.js';

function Auth(props) {

    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [message, setMessage] = useState('');

    const setUsername = useRecoilState(usernameState)[1];

    const navigate = useNavigate();

    function onLogin(evt) {
        evt.preventDefault();
        async function login() {
            const backendPort = parseInt(process.env.REACT_APP_PORT) + 1;
			const res = await fetch(`${process.env.REACT_APP_DOMAIN}:${backendPort}/api/login`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: loginUsername, password: loginPassword})
            });
            const message = await res.json();
            if (message.message === 'success') {
                setUsername(loginUsername);
                navigate('/pcs');
            } else {
                setMessage(message.message);
            }
        }
        login();
        setLoginUsername('');
        setLoginPassword('');
    }

    function onRegister(evt) {
        evt.preventDefault();
        async function register() {
            const backendPort = parseInt(process.env.REACT_APP_PORT) + 1;
			const res = await fetch(`${process.env.REACT_APP_DOMAIN}:${backendPort}/api/register`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: registerUsername, password: registerPassword})
            });
            const message = await res.json()
            if (message.message === 'success') {
                setUsername(registerUsername);
                navigate('/pcs');
            } else {
                setMessage(message.message);
            }
        }
        register();
        setRegisterUsername('');
        setRegisterPassword('');
    }

    function handleInputChange(evt) {
        evt.preventDefault();
        switch (evt.target.name) {
            case 'loginUsername':
                setLoginUsername(evt.target.value);
                break;
            case 'loginPassword':
                setLoginPassword(evt.target.value);
                break;
            case 'registerUsername':
                setRegisterUsername(evt.target.value);
                break;
            case 'registerPassword':
                setRegisterPassword(evt.target.value);
                break;
            default: 
        }
    }

    return (
        <div className="Auth Content" style={{width: props.width}}>
            <form onSubmit={onLogin}>
                <label>
                    Username: 
                    <input name='loginUsername' type='text' value={loginUsername} onChange={handleInputChange}/>
                </label>
                <br></br>
                <label>
                    Password: 
                    <input name='loginPassword' type='password' value={loginPassword} onChange={handleInputChange}/>
                </label>
                <br></br>
                <input type='submit' value='Login'/>
            </form>
            <br></br>
            <form>
                <label>
                    Username: 
                    <input name='registerUsername' type='text' value={registerUsername} onChange={handleInputChange}/>
                </label>
                <br></br>
                <label>
                    Password: 
                    <input name='registerPassword' type='password' value={registerPassword} onChange={handleInputChange}/>
                </label>
                <br></br>
                <button name='Register' onClick={onRegister}>Register</button>
            </form>
            <h1>{message}</h1>
        </div>
    )
}

export default Auth;