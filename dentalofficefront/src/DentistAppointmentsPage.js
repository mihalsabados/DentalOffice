import React, { useEffect, useState } from 'react'
import "./dentistAppointments.css"
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import MoreIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {FaTeeth} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Paper, Snackbar, TextField } from '@mui/material';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, DayView, Appointments, WeekView, Toolbar, ViewSwitcher, DateNavigator, TodayButton, AppointmentTooltip} from '@devexpress/dx-react-scheduler-material-ui';

import { Cancel, Close } from '@mui/icons-material';
import api from './service';
import { getCurrentUser } from './authService';

const DentistAppointmentPage = ({props}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [appointmentsList, setAppointmentsList] = useState([]);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState("success");
    const [alertMessage, setAlertMessage] = useState("Successfuly Canceled Appointment!");
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [inputPassword, setInputPassword] = useState(null);
    const [badPassword, setBadPassword] = useState(false);

    const [schedulerData, setSchedulerData] = useState(null);
    const [appointTooltipVisible, setAppointTooltipVisible] = useState(false);

    const now = new Date();

    const goToMyHomepage = ()=>{
        navigate('/');
    }

    const handleClose = () => {
        setOpenDialog(false);
      };

    useEffect(()=>{
        console.log("USAO U DENTIST");
        // console.log(location.state);
        // setAppointmentsList(location.state.appointments);
        // console.log(currentDate);
        // resetSchedulerData(location.state.appointments);
        api.get("dentalOffice/getAllAppointments").then(res=>{
            console.log(res.data);
            setAppointmentsList(res.data);
            resetSchedulerData(res.data);
        })

    },[])

    const resetSchedulerData=(appointments)=>{
        setSchedulerData( 
            appointments.map(appoint => (
                {
                    startDate:getStartTime(appoint),
                    endDate: getEndTime(appoint),
                    title:"Appointment",
                    details:appoint
                }
            ))
        );

    }

    useEffect(()=>{
        console.log(schedulerData);
    },[schedulerData])


    const getStartTime = (appoint) =>{
        return appoint.date.split(".")[2]+"-"+appoint.date.split(".")[1]+"-"+appoint.date.split(".")[0]+"T"+appoint.time.split(":")[0].padStart(2,"0")+":"+appoint.time.split(":")[1].padStart(2,"0");
    }

    const getEndTime = (appoint) =>{
        let time = new Date();
        time.setHours(parseInt(appoint.time.split(":")[0]));
        time.setMinutes(parseInt(appoint.time.split(":")[1]));
        time = new Date(time.getTime()+ appoint.duration*60000);
        return appoint.date.split(".")[2]+"-"+appoint.date.split(".")[1]+"-"+appoint.date.split(".")[0]+"T"+time.getHours().toString().padStart(2,"0")+":"+time.getMinutes().toString().padStart(2,"0");
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
        return true;
    }

    const checkId = () =>{
        let user = getCurrentUser();
        user.password = inputPassword;
        console.log(user);
        api.post("auth/checkDentistPassword", user).then(res=>{
            cancelAppointment();
        }).catch(res=>{
            setOpenAlert(true);
            setAlertSeverity("warning");
            setAlertMessage("Bad Password!");
            setBadPassword(true);
        })
    }

    const cancelAppointment = () =>{
        handleClose();
        console.log(selectedAppointment);
        api.delete("dentalOffice/cancelAppointment", {data:selectedAppointment}).then(res=>{
            console.log("USPESNO OBRISAN");
            let appointments = appointmentsList.filter(item => item.date !== selectedAppointment.date || item.time !== selectedAppointment.time);
            setAppointmentsList(appointments);
            resetSchedulerData(appointments);
            setAppointTooltipVisible(false);
            setAlertSeverity("success");
            setAlertMessage("Successfuly Canceled Appointment!");
            setOpenAlert(true);
        }).catch(res=>{
            console.log("LOSEEE");
            setOpenAlert(true);
            setAlertSeverity("error");
            setAlertMessage("Error canceling");

        })
    }

    const currentDate = now.getFullYear().toString()+"-"+(now.getMonth()+1).toString().padStart(2,"0")+"-"+now.getDate().toString().padStart(2,"0");


    const Header = (({
        children, appointmentData, ...restProps
      }) => (
            <div style={{marginLeft:canCancel(appointmentData.details)?'75%':'85%', display:'flex'}}>
            {canCancel(appointmentData.details) && <IconButton
                onClick={() => {setOpenDialog(true); setSelectedAppointment(appointmentData.details);}}
                size="large"
                title="Cancel this appointment"
            >
                <DeleteIcon />
            </IconButton>}
            <IconButton
                onClick={() => {setAppointTooltipVisible(false);}}
                size="large"
                title="Close"
            >
                <Close />
            </IconButton>
          </div>
      ));

    const Content = (({
        children, appointmentData, ...restProps
      }) => (
        <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
          <Grid container alignItems="center" style={{marginLeft:'20px'}}>
            <InfoOutlinedIcon></InfoOutlinedIcon>
            <Grid item xs={10} style={{paddingLeft:'20px', fontSize:'16px'}}>
              <span>{"Name: "}<b>{appointmentData.details.firstName+" "+appointmentData.details.lastName}</b></span>
            </Grid>
            <Grid item xs={10} style={{paddingLeft:'45px', fontSize:'16px'}}>
              <span>{"JMBG: "}<b>{appointmentData.details.jmbg}</b></span>
            </Grid>
            <Grid item xs={10} style={{paddingLeft:'45px', fontSize:'16px'}}>
              <span>{"LBO: "}<b>{appointmentData.details.lbo}</b></span>
            </Grid>
            <Grid item xs={10} style={{paddingLeft:'45px', fontSize:'16px'}}>
              <span>{"Phone Number: "}<b>{appointmentData.details.phoneNumber}</b></span>
            </Grid>
          </Grid>
        </AppointmentTooltip.Content>
      ));


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
                    To cancel this appointment, please enter your password.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Password"
                    type="password"
                    fullWidth
                    error={badPassword}
                    variant="standard"
                    onChange={(e)=>{setInputPassword(e.target.value); setBadPassword(false);}}
                />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Exit</Button>
            <Button onClick={checkId} autoFocus>
                Cancel
            </Button>
            </DialogActions>
        </Dialog>
        <div className='containerDiv containerDentistDiv'>
            <FaTeeth style={{fontSize:'50'}}></FaTeeth>
            <h1>My Appointments</h1>
            <div className='calendarDiv'>
            {schedulerData!== null && <Paper style={{maxHeight:'500px', overflow:'auto', width:'100%'/*, minWidth:'800px'*/}}>
                <Scheduler
                data={schedulerData}
                >
                <ViewState
                    defaultCurrentDate={currentDate}
                    defaultCurrentViewName="Week"
                />
                <DayView
                    startDayHour={9}
                    endDayHour={17}
                />
                <WeekView
                    startDayHour={9}
                    endDayHour={17}
                />
                <Toolbar />
                <ViewSwitcher />
                <DateNavigator />
                <TodayButton />
                <Appointments />
                <AppointmentTooltip
                    showCloseButton
                    headerComponent={Header}
                    contentComponent={Content}
                    visible={appointTooltipVisible}
                    onVisibilityChange={()=>{setAppointTooltipVisible(!appointTooltipVisible)}}
                />
                </Scheduler>
            </Paper>}
            </div>
            <div className='buttonDiv'>
                <Button variant='contained' onClick={goToMyHomepage} startIcon={<HomeIcon/>} style={{fontFamily:'Verdana, Geneva, Tahoma, sans-serif', fontWeight:'600', height:'40px'}} fullWidth>Go Back</Button>
            </div>
        </div>
    </div>
  )
}

export default DentistAppointmentPage