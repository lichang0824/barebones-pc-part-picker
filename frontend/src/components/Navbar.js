import {Link} from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import {currentPcIDState, currentPcNameState, usernameState} from './GlobalStates.js';

function Navbar(props) {

	const [username, setUsername] = useRecoilState(usernameState);
	const [currentPcID, setCurrentPcID] = useRecoilState(currentPcIDState);
	const setCurrentPcName = useRecoilState(currentPcNameState)[1];

	const navigate = useNavigate();

	function logout() {
		setUsername('');
		setCurrentPcID(null);
		setCurrentPcName('');
		const removeSession = async function () {
			const backendPort = parseInt(process.env.REACT_APP_PORT) + 1;
            const res = await fetch(`${process.env.REACT_APP_DOMAIN}:${backendPort}/api/login`, {
                method: 'DELETE',
                mode: 'cors',
                credentials: 'include'
            });
            await res.json();
		}
		removeSession();
		navigate('/auth');
	}

	return (
		<div className='Navbar' style={{width: props.width}}>
			<button onClick={props.closeNav}>X</button>
			<br></br>
			<Link to='/'>Homepage</Link>
			<br></br>
			{!username &&
				<>
				<Link to='/auth'>Login/Register</Link>
				<br></br>
				</>
			}
			{username &&
				<>
				<Link to='/pcs'>Saved PCs</Link>
				<br></br>
				</>
			}
			{username && currentPcID &&
				<>
				<Link to='/config'>Config Page</Link>
				<br></br>
				Choose Parts: 
				<br></br>
				<br></br>
				<Link to='/cpu'>CPU</Link>
				<br></br>
				<Link to='/motherboard'>Motherboard</Link>
				<br></br>
				<Link to='/ram'>RAM</Link>
				<br></br>
				<Link to='/disk'>Disk</Link>
				<br></br>
				<Link to='/cooler'>Cooler</Link>
				<br></br>
				<Link to='/graphics'>Graphics</Link>
				<br></br>
				<Link to='/psu'>PSU</Link>
				<br></br>
				<Link to='/case'>Case</Link>
				<br></br>
				</>
			}
			{username &&
				<>
				Logged in: {username}
				<br></br>
				<br></br>
				<button onClick={logout} className='logout'>Logout</button>
				</>
			}
		</div>
	);
}

export default Navbar;
