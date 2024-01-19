import {useEffect, useState} from "react";
import { useRecoilState } from 'recoil';
import {currentPcIDState} from './GlobalStates.js';
import {currentPcNameState} from './GlobalStates.js';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';

function Disk(props) {
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
			const res = await fetch(`${process.env.REACT_APP_DOMAIN}:${backendPort}/api/parts?part=disk`);
			const data = await res.json();
			data.map((element) => (element.type = element.solid_state ? 'SSD' : 'Mechanical'));
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
                body: JSON.stringify({pc_id: currentPcID, part: 'disk', part_id})
            });
            await res.json();
			navigate('/config');
		}
		updatePc();
	}

	const columns = [
		{field: 'brand', headerName: 'Brand', flex: 1},
		{field: 'name', headerName: 'Name', flex: 1},
		{field: 'type', headerName: 'Type', flex: 1},
		{field: 'form_factor', headerName: 'Form Factor', flex: 1},
		{field: 'capacity', headerName: 'Capacity', flex: 1},
		{field: 'protocol', headerName: 'Protocol', flex: 1},
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
		return <div className="Disk Content" style={{width: props.width}}>
			<h1>Pick Disk for: {currentPcName}</h1>
			<DataGrid autoHeight
				rows={data}
				columns={columns}
				getRowId={(row) => row._id}
			/>
		</div>;
	}
}

export default Disk;