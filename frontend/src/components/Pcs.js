import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import {currentPcIDState} from './GlobalStates.js';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';

function Pcs (props) {

    const [isLoaded, setIsLoaded] = useState(false);
	const [data, setData] = useState(null);
    
    const [newPcName, setNewPcName] = useState('')
    const [message, setMessage] = useState('');

    const [renderFlag, setRenderFlag] = useState(false);

    const [currentPcID, setCurrentPcID] = useRecoilState(currentPcIDState);

    const navigate = useNavigate();

    useEffect(function () {
        const getPcs = async function () {
            setIsLoaded(false);
            const backendPort = parseInt(process.env.REACT_APP_PORT) + 1;
            const res = await fetch(`${process.env.REACT_APP_DOMAIN}:${backendPort}/api/pcs`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include'
            });
            const pcs = await res.json();
            if (pcs.message === 'Error: No Login') {
                setMessage(pcs.message);
            } else {
                // console.log(pcs);
                setData(pcs);
                setIsLoaded(true);
            }
        }
        getPcs();
    }, [renderFlag]);

    function config(id) {
        setCurrentPcID(id);
        navigate('/config');
    }

    function handleInputChange(evt) {
        evt.preventDefault();
        setNewPcName(evt.target.value);
    }

    function onCreate(evt) {
        evt.preventDefault();
        async function create() {
            const backendPort = parseInt(process.env.REACT_APP_PORT) + 1;
			const res = await fetch(`${process.env.REACT_APP_DOMAIN}:${backendPort}/api/pcs`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({newPcName})
            });
            const message = await res.json();
            if (message.message === 'success') {
                setRenderFlag(!renderFlag);
                setNewPcName('');
                setMessage('');
            } else {
                setMessage(message.message);
            }
        }
        create();
    }

    function onDelete(id) {
        async function deletePc() {
            const backendPort = parseInt(process.env.REACT_APP_PORT) + 1;
			const res = await fetch(`${process.env.REACT_APP_DOMAIN}:${backendPort}/api/pcs`, {
                method: 'DELETE',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({_id: id})
            });
            const message = await res.json();
            if (message.message === 'Error: No Login') {
                setMessage(message.message);
            }
            if (id === currentPcID) {
                setCurrentPcID(null);
                // don't allow the user to configure a deleted PC
            }
            setRenderFlag(!renderFlag);
        }
        deletePc();
    }

    const columns = [
		{field: 'name', headerName: 'Name', flex: 1},
		{
			field: 'Config',
			renderCell: (cellValues) => {
			  	return (
					<Button
						variant="contained"
						color="primary"
						onClick={(event) => {
							event.preventDefault();
                            config(cellValues.id)
						}}
					>
						Config
					</Button>
			  	);
			},
			flex: 1
		},
        {
			field: 'Delete',
			renderCell: (cellValues) => {
			  	return (
					<Button
						variant="contained"
						color="primary"
						onClick={(event) => {
							event.preventDefault();
							onDelete(cellValues.id);
						}}
					>
						Delete
					</Button>
			  	);
			},
			flex: 1
		}
	];

    if (!isLoaded) {
		return (
            <div>
                Loading...
                <br></br>
                {message}
            </div>
        );
	} else {
        return (
            <div className='Pcs Content' style={{width: props.width}}>
                {data.length === 0 &&
                    <h1>There're no saved PCs.</h1>
                }
                {data.length !== 0 && 
                <>
                    <h1>Your Saved PCs</h1>
                    <DataGrid autoHeight
                        rows={data}
                        columns={columns}
                        getRowId={(row) => row._id}
	        		/>
                </>
                }
                <br></br>
                <>
                    <form onSubmit={onCreate}>
                    <label>
                        Name: 
                        <input name='newPcName' type='text' value={newPcName} onChange={handleInputChange}/>
                    </label>
                    <br></br>
                    <input type='submit' value='Create A New PC'/>
                    </form>
                </>
                <div>{message}</div>
            </div>
        );
    }
}

export default Pcs;