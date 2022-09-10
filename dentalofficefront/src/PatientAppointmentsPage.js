import React, { useEffect, useState } from 'react'
import "./patientAppointments.css"
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import HomeIcon from '@mui/icons-material/Home';
import TableRowsIcon from '@mui/icons-material/TableRows';
import CancelIcon from '@mui/icons-material/Cancel';
import {FaTeeth} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Snackbar } from '@mui/material';
import { api } from './service';

const PatientAppointmentPage = ({props}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [appointments, setAppointments] = useState([]);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState("success");
    const [alertMessage, setAlertMessage] = useState("Successfuly Canceled Appointment!");
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const handleClickOpen = () => {
      setOpenDialog(true);
    };
  
    const handleClose = () => {
      setOpenDialog(false);
    };


    const goToMyHomepage = ()=>{
        navigate('/');
    }

    const canCancel = (appointment) =>{
        let dateTime = new Date();
        dateTime.setDate(parseInt(appointment.date.split(".")[0]));
        dateTime.setMonth(parseInt(appointment.date.split(".")[1])-1);
        dateTime.setFullYear(parseInt(appointment.date.split(".")[2]));
        dateTime.setHours(parseInt(appointment.time.split(":")[0]));
        dateTime.setMinutes(parseInt(appointment.time.split(":")[1]));
        dateTime.setSeconds(0);

        let now = new Date();

        if(dateTime.getTime() < now.getTime())
            return false;

        let hoursBetween = Math.abs(now - dateTime)/36e5;

        return hoursBetween > 24;
    }

    const getEndTime = (appointment) =>{
        let time = new Date();
        time.setHours(parseInt(appointment.time.split(":")[0]));
        time.setMinutes(parseInt(appointment.time.split(":")[1]));
        time = new Date(time.getTime()+ appointment.duration*60000);
        return time.getHours().toString()+":"+time.getMinutes().toString().padStart(2,"0");
    }

    const cancelAppointment = () =>{
        handleClose();
        console.log(selectedAppointment);
        api.delete("cancelAppointment", {data:selectedAppointment}).then(res=>{
            console.log("USPESNO OBRISAN");
            let appointmentsList = appointments.filter(item => item.date !== selectedAppointment.date || item.time !== selectedAppointment.time);
            setAppointments(appointmentsList);
            setOpenAlert(true);
            setAlertSeverity("success");
            setAlertMessage("Successfuly Canceled Appointment!");
        }).catch(res=>{
            setOpenAlert(true);
            setAlertSeverity("error");
            setAlertMessage("Error canceling");

        })

    }

    useEffect(()=>{
        console.log("USAO U Patients");
        console.log(location.state);
        setAppointments(location.state.appointments);
    },[])

  return (
    <div>
        <Snackbar open={openAlert} autoHideDuration={6000} onClose={()=>{setOpenAlert(false);}}>
            <Alert onClose={()=>{setOpenAlert(false);}} severity={alertSeverity} sx={{ width: '100%' }}>
            {alertMessage}
            </Alert>
        </Snackbar>
        <Dialog
            open={openDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"Cancel confirmation?"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure you want to cancel this appointment?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={cancelAppointment} autoFocus>
                Yes
            </Button>
            </DialogActions>
        </Dialog>
        <div className='containerDiv'>
            <FaTeeth style={{fontSize:'50'}}></FaTeeth>
            <h1>My Appointments</h1>
            {appointments.length>0 && <h2>{appointments[0].firstName+" "+appointments[0].lastName}</h2>}
            <div className='listDiv'>
            <List sx={{ width: '100%', maxWidth: 400, maxHeight:400, overflow:'auto', bgcolor: 'background.paper' }}>
               { appointments.map((appoint)=>(
                    <ListItem
                        secondaryAction={
                            canCancel(appoint) &&
                            <IconButton edge="start" aria-label="delete" title={"Cancel this appointment"} onClick={()=>{handleClickOpen(); setSelectedAppointment(appoint)}}>
                                <CancelIcon />
                            </IconButton>
                        }
                    >
                        <ListItemAvatar>
                        <Avatar>
                            <CreateIcon />
                        </Avatar>
                        </ListItemAvatar>
                        <ListItemText secondary={appoint.time+"-"+getEndTime(appoint)} primary={appoint.date} />
                    </ListItem>
               ))
                }
            </List>

            </div>
            <div className='buttonDiv'>
                <Button variant='contained' onClick={goToMyHomepage} startIcon={<HomeIcon/>} style={{fontFamily:'Verdana, Geneva, Tahoma, sans-serif', fontWeight:'600', height:'40px', backgroundColor:'gray'}} fullWidth>Go Back</Button>
            </div>
        </div>
    </div>
  )
}

export default PatientAppointmentPage