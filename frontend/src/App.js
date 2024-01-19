import './App.css';
import Homepage from './components/Homepage.js';
import Auth from './components/Auth.js';
import Pcs from './components/Pcs.js';
import Config from './components/Config.js';

import CPU from './components/Cpu.js';
import Motherboard from './components/Motherboard.js';
import RAM from './components/Ram.js';
import Disk from './components/Disk.js';
import Cooler from './components/Cooler.js';
import Graphics from './components/Graphics.js';
import PSU from './components/Psu.js';
import Case from './components/Case.js';

import Navbar from './components/Navbar.js';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {RecoilRoot} from 'recoil';

function App() {

	const [contentWidth, setContentWidth] = useState('85%');
	const [navWidth, setNavWidth] = useState('15%');
	const openNav = function () {
		setContentWidth('85%');
		setNavWidth('15%');
	}
	const closeNav = function () {
		setContentWidth('100%');
		setNavWidth('0%');
	}

	useEffect(() => {
		document.title = 'PC Part Picker';
	}, []);

	return (
		<RecoilRoot>
		<div className="App">
			<button onClick={openNav} className='openNav'>Navbar</button>
			<Router>
				<Navbar width={navWidth} closeNav={closeNav}/>
					<Routes>
						<Route path='/' element={<Homepage width={contentWidth}/>} />
						<Route path='/auth' element={<Auth width={contentWidth}/>} />
						<Route path='/pcs' element={<Pcs width={contentWidth}/>} />
						<Route path='/config' element={<Config width={contentWidth}/>} />
						<Route path='/cpu' element={<CPU width={contentWidth}/>} />
						<Route path='/motherboard' element={<Motherboard width={contentWidth}/>} />
						<Route path='/ram' element={<RAM width={contentWidth}/>} />
						<Route path='/disk' element={<Disk width={contentWidth}/>} />
						<Route path='/cooler' element={<Cooler width={contentWidth}/>} />
						<Route path='/graphics' element={<Graphics width={contentWidth}/>} />
						<Route path='/psu' element={<PSU width={contentWidth}/>} />
						<Route path='/case' element={<Case width={contentWidth}/>} />
					</Routes>
			</Router>
		</div>
		</RecoilRoot>
	);
}

export default App;
