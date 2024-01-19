import {useEffect, useState} from "react";
import { useRecoilState } from 'recoil';
import {currentPcIDState} from './GlobalStates.js';
import {currentPcNameState} from './GlobalStates.js';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';

function Cpu(props) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [data, setData] = useState(null);

	const currentPcID = useRecoilState(currentPcIDState)[0];
	const currentPcName = useRecoilState(currentPcNameState)[0];

	const navigate = useNavigate();

	useEffect(function () {
		const getData = async function () {
			// console.log(process.env.REACT_APP_DOMAIN);
			// console.log(process.env.REACT_APP_PORT);
			const backendPort = parseInt(process.env.REACT_APP_PORT) + 1;
			// console.log(backendPort);
			const res = await fetch(`${process.env.REACT_APP_DOMAIN}:${backendPort}/api/parts?part=cpu`);
			const data = await res.json();
			data.map((element) => (element.compatible_chipsets = element.required_chipset.filter(chipset => {return !chipset.startsWith('*');})));
			data.map((element) => (element.update_chipsets = element.required_chipset.filter(chipset => {return chipset.startsWith('*');}).map(chipset => chipset.substring(1))));
			setData(data);
			setIsLoaded(true);
		}
		getData();
	}, []);

	function select(part_id) {
		const updatePc = async function () {
            const backendPort = parseInt(process.env.REACT_APP_PORT) + 1;
            const res = await fetch(`${process.env.REACT_APP_DOMAIN}:${backendPort}/api/pc`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
				headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({pc_id: currentPcID, part: 'CPU', part_id})
            });
            await res.json();
			navigate('/config');
		}
		updatePc();
	}

	const columns = [
		{field: 'brand', headerName: 'Brand', flex: 1, maxWidth: 100},
		{field: 'name', headerName: 'Name', flex: 1, maxWidth: 100},
		{field: 'cores', headerName: 'Cores', type: 'number', flex: 1, maxWidth: 60},
		{field: 'threads', headerName: 'Threads', type: 'number', flex: 1, maxWidth: 80},
		{field: 'boost_clock', headerName: 'Boost Clock', flex: 1},
		{field: 'release_year', headerName: 'Release Year', flex: 1},
		{field: 'compatible_chipsets', headerName: 'Compatible Chipsets', flex: 1, minWidth: 200},
		{field: 'update_chipsets', headerName: 'Compatible Chipsets with Update', flex: 1, minWidth: 250},
		{field: 'MSRP', headerName: 'Price', type: 'number', flex: 1},
		{
			field: 'Select',
			renderCell: (cellValues) => {
			  	return (
					<Button
						variant="contained"
						color="primary"
						onClick={(event) => {
							event.preventDefault();
							select(cellValues.id);
						}}
					>
						Select
					</Button>
			  	);
			},
			flex: 1
		}
	];

	if (!isLoaded) {
		return <div>Loading...</div>;
	} else {
		// console.log(isLoaded);
		// console.log(JSON.stringify(data));
		return <div className="Cpu Content" style={{width: props.width}}>
			<h1>Pick CPU for: {currentPcName}</h1>
			<DataGrid autoHeight
				rows={data}
				columns={columns}
				getRowId={(row) => row._id}
			/>
		</div>;
	}
}

export default Cpu;