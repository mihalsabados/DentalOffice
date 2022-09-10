import './App.css';
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Homepage from './Homepage';
import NewAppointment from './NewAppointment';
import IdentityCheckPage from './IdentityCheckPage';
import DentistAppointmentPage from './DentistAppointmentsPage';
import PatientAppointmentPage from './PatientAppointmentsPage';

function App() {
  return (
    <Router> 
      <div className="App">
        <Routes>
          <Route path='/' index element={<Homepage/>} ></Route>
          <Route path='/newAppointment' index element={<NewAppointment/>} ></Route>
          <Route path='/identityCheck' index element={<IdentityCheckPage/>} ></Route>
          <Route path='/dentistAppointments' index element={<DentistAppointmentPage appointments={null}/>} ></Route>
          <Route path='/patientAppointments' index element={<PatientAppointmentPage appointments={null}/>} ></Route>
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
