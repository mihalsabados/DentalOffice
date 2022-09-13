import React, { useEffect, useState } from 'react'
import "./Login.css"
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import TableRowsIcon from '@mui/icons-material/TableRows';
import {FaTeeth} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { makeStyles } from '@mui/styles';
import api from './service';
import { getCurrentUser } from './authService';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username:'',
        password:''
    });
    const [badInput, setBadInput] = useState(false);

    const makeChange = (event) => {
        setBadInput(false);
        setFormData(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    }

    const submit = (event) => {
        event.preventDefault();
        console.log(formData);
        api.post("/auth/login", formData).then(res=>{
            console.log('Login success');
            localStorage.setItem("jwt", res.data.accessToken);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/homepage");
        }).catch(res=>{
            console.log("Neuspesno!!!");
            setBadInput(true);
        })
    };

    useEffect(()=>{
        if(getCurrentUser() != null)
            navigate("/homepage");
    },[])


  return (
    <div>
        <div className='containerDivLogIn'>
            <FaTeeth style={{fontSize:'50'}}></FaTeeth>
            <h1>Log In</h1>
            <form onSubmit={submit}>
                <TextField label='Username' error={badInput} style={{ marginBottom: '10px' }} name="username" onChange={makeChange} fullWidth required />
                <TextField label='Password' error={badInput} placeholder='Enter password' type='password' name="password" onChange={makeChange} fullWidth required />
                {badInput?<Typography padding='5px' color='red'> The username or password you entered is incorrect.</Typography>:<></>}
                <Button type='submit' color='primary' variant="contained" style={{marginTop:'20px', fontWeight:'600'}} fullWidth>Log in</Button>
                <Button type='button' color='primary' onClick={()=>navigate("/homepage")} startIcon={<HomeIcon/>} variant="contained" style={{marginTop:'20px', fontWeight:'600'}} fullWidth>homepage</Button>
            </form>
        </div>
    </div>
  )
}

export default Login