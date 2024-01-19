import {useEffect, useState} from "react";
import { useRecoilState } from 'recoil';
import {currentPcIDState} from './GlobalStates.js';
import {currentPcNameState} from './GlobalStates.js';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';

function Graphics(props) {
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
			const res = await fetch(`${process.env.REACT_APP_DOMAIN}:${backendPort}/api/parts?part=graphics`);
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
                body: JSON.stringify({pc_id: currentPcID, part: 'GraphicsCard', part_id})
            });
            await res.json();
			navigate('/config');
		}
		updatePc();
	}

	const columns = [
		{field: 'brand', headerName: 'Brand', flex: 1},
		{field: 'name', headerName: 'Name', flex: 1},
		{field: 'core_count', headerName: 'Core Count', type: 'number', flex: 1},
		{field: 'memory_size', headerName: 'Memory Size', flex: 1},
		{field: 'TDP', headerName: 'TDP', type: 'number', flex: 1},
		{field: 'release_year', headerName: 'Release Year', flex: 1},
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
		return <div className="Graphics Content" style={{width: props.width}}>
			<h1>Pick Graphics Card for: {currentPcName}</h1>
			<DataGrid autoHeight
				rows={data}
				columns={columns}
				getRowId={(row) => row._id}
			/>
		</div>;
	}
}

export default Graphics;