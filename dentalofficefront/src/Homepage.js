import React from 'react'
import "./homepage.css"
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import TableRowsIcon from '@mui/icons-material/TableRows';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import {FaTeeth} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from './authService';

const Homepage = () => {
    const navigate = useNavigate();

    const goToCreatingAppointment = ()=>{
        navigate('/newAppointment');
    }

    const goToMyAppointments = ()=>{
        if(getCurrentUser() != null)
            navigate("/dentistAppointments");
        else
            navigate('/identityCheck');
    }

    const logOut=()=>{
        logout();
        navigate("/");
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
            {getCurrentUser() != null && <div className='buttonDiv'>
                <Button variant='contained' onClick={logOut} startIcon={<LogoutIcon/>} style={{fontFamily:'Verdana, Geneva, Tahoma, sans-serif', fontWeight:'600', height:'40px'}} fullWidth>Log Out</Button>
            </div>}
            {getCurrentUser() == null && <div className='buttonDiv'>
                <Button variant='contained' onClick={()=>navigate("/")} startIcon={<LoginIcon/>} style={{fontFamily:'Verdana, Geneva, Tahoma, sans-serif', fontWeight:'600', height:'40px'}} fullWidth>Log In</Button>
            </div>}
        </div>
    </div>
  )
}

export default Homepage