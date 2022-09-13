import React, { useEffect, useState } from 'react'
import "./newAppointment.css"
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import CancelIcon from '@mui/icons-material/Cancel';
import { Navigate, useNavigate } from 'react-router-dom';
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import api from './service';

const NewAppointment = () => {
  const navigate = useNavigate();
  const [selectedDate,setSelectedDate] = useState({
    date:(new Date().getDate()+1).toString().padStart(2,"0"),
    month:(new Date().getMonth()+1).toString().padStart(2,"0"),
    year:new Date().getFullYear()
  });
  const [formData, setFormData] = useState({
    firstName:'',
    lastName:'',
    JMBG:'',
    LBO:'',
    date:selectedDate.date+"."+ selectedDate.month+"."+selectedDate.year+".",
    duration:30,
    time:''
  });
  const [availableTimes, setAvailableTimes] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("Successfuly Created Appointment!");
  const [openDialog, setOpenDialog] = React.useState(false);
  const today = selectedDate.year+"-"+selectedDate.month+"-"+selectedDate.date;
  const tomorrow = new Date().getFullYear()+"-"+(new Date().getMonth()+1).toString().padStart(2,"0")+"-"+(new Date().getDate()+1).toString().padStart(2,"0");

  const handleClose = () => {
    setOpenDialog(false);
  };


  const setDataFromForm = (e)=>{
    let value = e.target.value;
    let name = e.target.name;
    if(e.target.name == "date"){
      console.log(e.target.value);
      let year = e.target.value.split("-")[0];
      let month = e.target.value.split("-")[1];
      let day = e.target.value.split("-")[2];
      value = day+"."+month+"."+year+".";
      getAvailableTimes(value, formData.duration);
      setSelectedDate({date:day, month:month, year:year});
    }
    if(name == "duration"){
      value = parseInt(value);
      getAvailableTimes(formData.date, value);
    }

    setFormData(prevState =>({
      ...prevState,
      [name]:value
    }))
  };

  const getAvailableTimes = (date, duration)=>{
    let data={
      date:date,
      duration:duration
    };
    console.log(data);
    api.post("dentalOffice/getFreeTime", data).then(res=>{
      console.log(res.data);
      setAvailableTimes(res.data);
      setFormData(prevState =>({
        ...prevState,
        time:res.data[0]
      }))
    })
  }

  const submitForm = (e)=>{
    e.preventDefault();
    console.log('USAOOO');
    console.log(formData);

    api.post("dentalOffice/createAppointment", formData).then(res=>{
      console.log(res.data);
      console.log("USPESNO");
      setOpenDialog(true);
    }).catch(res=>{
      setOpenAlert(true);
      setAlertSeverity("error");
      setAlertMessage("Can't Create Appointment. Please Try Again!");

    })

  }
  
  useEffect(()=>{
    getAvailableTimes(selectedDate.date+"."+ selectedDate.month+"."+selectedDate.year+".", 30);
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
            {"Success"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Appointment Successfuly Created
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={()=>navigate("/homepage")} autoFocus>
                Ok
            </Button>
            </DialogActions>
        </Dialog>
        <div className='containerDiv'>
            <CreateIcon style={{fontSize:'50'}}></CreateIcon>
            <h1>Create Appointment</h1>
            <div className='buttonDiv'>
                <form onSubmit={submitForm}>
                  <div className='formDiv'>
                    <div>
                      <label>First Name</label>
                    </div>
                    <div>
                      <input type="text" name='firstName' onChange={setDataFromForm} required placeholder='John'></input>
                    </div>
                    <div>
                      <label>Last Name</label>
                    </div>
                    <div>
                      <input type="text" name='lastName' onChange={setDataFromForm} required  placeholder='Johnson'></input>
                    </div>
                    <div>
                      <label>JMBG</label>
                    </div>
                    <div>
                      <input type="text" name='jmbg' onChange={setDataFromForm} required maxLength={13} minLength={13} pattern="[0-9]{13}" title='ID with 13 Digits' placeholder='13 Digit ID'></input>
                    </div>
                    <div>
                      <label>LBO</label>
                    </div>
                    <div>
                      <input type="text" name='lbo' onChange={setDataFromForm} required maxLength={11} minLength={11} pattern="[0-9]{11}" title='ID with 11 Digits' placeholder='11 Digit ID'></input>
                    </div>
                     <div>
                      <label>Phone number</label>
                    </div>
                    <div>
                      <input type="text" name='phoneNumber' onChange={setDataFromForm} required minLength={1} pattern="[0-9]*" title='060...' placeholder='e.g. 060...'></input>
                    </div>
                    <div>
                      <label>Date</label>
                    </div>
                    <div>
                      <input type="date" name='date' onChange={setDataFromForm} value={today} min={tomorrow} required ></input>
                    </div>
                    <div>
                      <label>Duration</label>
                    </div>
                    <div>
                      <input type="radio" id="30" name='duration' value={30} checked={formData.duration === 30}  onClick={setDataFromForm}></input>
                      <label for="30">30 min</label>
                      <input type="radio" id="60" name='duration' value={60} checked={formData.duration === 60}  onClick={setDataFromForm}></input>
                      <label for="60">60 min</label>
                    </div>
                    <div>
                      <labe>Time</labe>
                    </div>
                    <div>
                      <select id="time" name='time' onChange={setDataFromForm} required>
                        {availableTimes.map((time)=>(
                            <option value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <Button type={"submit"} variant='contained' startIcon={<CreateIcon/>} style={{fontFamily:'Verdana, Geneva, Tahoma, sans-serif', fontWeight:'600', height:'40px'}} fullWidth>Create appointment</Button>
                  <Button type={"button"} onClick={()=>{navigate(-1)}} variant='contained' startIcon={<CancelIcon/>} style={{fontFamily:'Verdana, Geneva, Tahoma, sans-serif', fontWeight:'600', height:'40px', marginTop:'15px', backgroundColor:'rgb(150, 40, 40)'}} fullWidth>Cancel</Button>
                </form>

            </div>
        </div>
    </div>
  )
}

export default NewAppointment