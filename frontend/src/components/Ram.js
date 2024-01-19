import {useEffect, useState} from "react";
import { useRecoilState } from 'recoil';
import {currentPcIDState} from './GlobalStates.js';
import {currentPcNameState} from './GlobalStates.js';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';

function Ram(props) {
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
			const res = await fetch(`${process.env.REACT_APP_DOMAIN}:${backendPort}/api/parts?part=ram`);
			const data = await res.json();
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
                body: JSON.stringify({pc_id: currentPcID, part: 'RAM', part_id})
            });
            await res.json();
			navigate('/config');
		}
		updatePc();
	}

	const columns = [
		{field: 'brand', headerName: 'Brand', flex: 1},
		{field: 'name', headerName: 'Name', flex: 1, minWidth: 200},
		{field: 'type', headerName: 'Type', flex: 1},
		{field: 'size', headerName: 'Size', flex: 1},
		{field: 'speed', headerName: 'Speed', flex: 1},
		{field: 'latency', headerName: 'Latency', flex: 1},
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
		return <div className="Ram Content" style={{width: props.width}}>
			<h1>Pick RAM for: {currentPcName}</h1>
			<DataGrid autoHeight
				rows={data}
				columns={columns}
				getRowId={(row) => row._id}
			/>
		</div>;
	}
}

export default Ram;