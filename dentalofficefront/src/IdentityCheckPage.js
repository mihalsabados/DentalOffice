import React, { useState } from 'react'
import "./IdentityCheck.css"
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import HomeIcon from '@mui/icons-material/Home';
import CheckIcon from '@mui/icons-material/Check';
import {FaTeeth} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Alert, Snackbar } from '@mui/material';
import api from './service';

const IdentityCheckPage = () => {
    const navigate = useNavigate();
    const [id, setId] = useState(null);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState("error");
    const [alertMessage, setAlertMessage] = useState("There is no matching JMBG or ID!");

    const checkIfIdExist=()=>{
        console.log("Checking patients");
        api.post("dentalOffice/checkPatientsJmbg", id).then(results=>{
            console.log(results.data);
            navigate("/patientAppointments", {state:{appointments:results.data}});
        }).catch(res=>{
            setOpenAlert(true);
        })
    }

    const goToMyHomepage=()=>{
        navigate(-1);
    }

  return (
    <div>
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={()=>{setOpenAlert(false);}}>
            <Alert onClose={()=>{setOpenAlert(false);}} severity={alertSeverity} sx={{ width: '100%' }}>
            {alertMessage}
            </Alert>
        </Snackbar>
        <div className='containerDiv'>
            <FaTeeth style={{fontSize:'50'}}></FaTeeth>
            <h1>My Appointments</h1>
            <div>
                <label>Enter your JMBG or ID</label>
            </div>
            <div>
                <input type="text" name='id' onChange={(e)=>{setId(e.target.value);}} required></input>
            </div>
            <div className='buttonDiv'>
                <Button variant='contained' onClick={checkIfIdExist} startIcon={<CheckIcon/>} style={{fontFamily:'Verdana, Geneva, Tahoma, sans-serif', fontWeight:'600', height:'40px'}} fullWidth>Check</Button>
                <Button variant='contained' onClick={goToMyHomepage} startIcon={<HomeIcon/>} style={{fontFamily:'Verdana, Geneva, Tahoma, sans-serif', fontWeight:'600', height:'40px', marginTop:'15px', backgroundColor:'gray'}} fullWidth>Go Back</Button>
            </div>
        </div>
    </div>
  )
}

export default IdentityCheckPage