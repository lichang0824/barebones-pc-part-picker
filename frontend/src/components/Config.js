import {useEffect, useState} from "react";
import { useRecoilState } from 'recoil';
import {currentPcIDState} from './GlobalStates.js';
import {currentPcNameState} from './GlobalStates.js';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';

function Config(props) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [data, setData] = useState(null);

	const currentPcID = useRecoilState(currentPcIDState)[0];
	const [currentPcName, setCurrentPcName] = useRecoilState(currentPcNameState);

	const navigate = useNavigate();

	useEffect(function () {
        const getPc = async function () {
            const backendPort = parseInt(process.env.REACT_APP_PORT) + 1;
            const res = await fetch(`${process.env.REACT_APP_DOMAIN}:${backendPort}/api/pc?_id=${currentPcID}`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include'
            });
            const pc = await res.json();
            console.log(pc);
			setData(pc);
			setCurrentPcName(pc.name);
			setIsLoaded(true);
        }
        getPc();
    }, [currentPcID, setCurrentPcName]);

	function calculateTotal(data) {
		return (data.CPU?.MSRP || 0) + 
		(data.motherboard?.MSRP || 0) + 
		(data.RAM?.MSRP || 0) + 
		(data.disk?.MSRP || 0) + 
		(data.cooler?.MSRP || 0) + 
		(data.GraphicsCard?.MSRP || 0) + 
		(data.PSU?.MSRP || 0) + 
		(data.case?.MSRP || 0);
	}

	function getWarning(data) {
		let warning = '';
		if (data.CPU && data.motherboard) {
			if (data.CPU.required_chipset.includes(data.motherboard.chipset)) {
				// OK
			} else if (data.CPU.required_chipset.includes('*' + data.motherboard.chipset)) {
				warning += 'Motherboard BIOS update might be required for your CPU\n';
			} else {
				warning += 'CPU and Motherboard not compatible!\n';
			}
		}
		if (data.motherboard && data.RAM) {
			if (data.motherboard.memory_type !== data.RAM.type) {
				warning += `Motherboard requires ${data.motherboard.memory_type}, but selected memory is ${data.RAM.type}!\n`;
			}
		}
		if (warning === '') {
			return 'None';
		} else {
			return warning;
		}
	}

	const columns = [
		{field: 'part', headerName: 'Part', flex: 1},
		{field: 'choice', headerName: 'Choice', flex: 1},
		{field: 'price', headerName: 'Price', type: 'number', flex: 1},
		{
			field: 'Change',
			renderCell: (cellValues) => {
			  	return (
					<Button
						variant="contained"
						color="primary"
						onClick={(event) => {
							event.preventDefault();
							navigate('/' + cellValues.id);
						}}
					>
						Change
					</Button>
			  	);
			},
			flex: 1
		}
	];

    if (!isLoaded) {
		return <div>Loading...</div>;
	} else {
		const rows = [
			{id: 'cpu', part: 'CPU', choice: data.CPU?.name || 'None', price: data.CPU?.MSRP || 0},
			{id: 'motherboard', part: 'Motherboard', choice: data.motherboard?.name || 'None', price: data.motherboard?.MSRP || 0},
			{id: 'ram', part: 'RAM', choice: data.RAM?.name || 'None', price: data.RAM?.MSRP || 0},
			{id: 'disk', part: 'Disk', choice: data.disk?.name || 'None', price: data.disk?.MSRP || 0},
			{id: 'cooler', part: 'Cooler', choice: data.cooler?.name || 'None', price: data.cooler?.MSRP || 0},
			{id: 'graphics', part: 'Graphics Card', choice: data.GraphicsCard?.name || 'None', price: data.GraphicsCard?.MSRP || 0},
			{id: 'psu', part: 'PSU', choice: data.PSU?.name || 'None', price: data.PSU?.MSRP || 0},
			{id: 'case', part: 'Case', choice: data.case?.name || 'None', price: data.case?.MSRP || 0},
		];
		return (
			<div className='Config Content' style={{width: props.width}}>
				<h1>Configuring PC: {currentPcName}</h1>
				<DataGrid autoHeight
					rows={rows}
					columns={columns}
					hideFooter
				/>
				<h1>Total Cost: {calculateTotal(data)}</h1>
				<div style={{whiteSpace: "pre-line"}}>
					Compatibility Warnings: 
					<br></br>
					{getWarning(data)}
				</div>
			</div>
		);
	}
}

export default Config;
