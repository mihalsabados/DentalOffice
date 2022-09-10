import React from 'react'
import "./homepage.css"
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import TableRowsIcon from '@mui/icons-material/TableRows';
import {FaTeeth} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate = useNavigate();

    const goToCreatingAppointment = ()=>{
        navigate('/newAppointment');
    }

    const goToMyAppointments = ()=>{
        navigate('/identityCheck');
    }



  return (
    <div>
        <div className='containerDiv'>
            <FaTeeth style={{fontSize:'50'}}></FaTeeth>
            <h1>Dental Office</h1>
            <div className='buttonDiv'>
                <Button variant='contained' onClick={goToCreatingAppointment} startIcon={<CreateIcon/>} style={{fontFamily:'Verdana, Geneva, Tahoma, sans-serif', fontWeight:'600', height:'40px'}} fullWidth>Create appointment</Button>
            </div>
            <div className='buttonDiv'>
                <Button variant='contained' onClick={goToMyAppointments} startIcon={<TableRowsIcon/>} style={{fontFamily:'Verdana, Geneva, Tahoma, sans-serif', fontWeight:'600', height:'40px'}} fullWidth>My appointments</Button>
            </div>
        </div>
    </div>
  )
}

export default Homepage