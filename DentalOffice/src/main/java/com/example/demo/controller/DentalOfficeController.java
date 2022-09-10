package com.example.demo.controller;

import com.example.demo.DTO.DateAndDurationDTO;
import com.example.demo.model.Appointment;
import com.example.demo.service.DentalOfficeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/dentalOffice")
public class DentalOfficeController {

    private DentalOfficeService dentalOfficeService;

    @Autowired
    public DentalOfficeController(DentalOfficeService dentalOfficeService) {
        this.dentalOfficeService = dentalOfficeService;
    }

    public DentalOfficeController() {
    }

    @GetMapping("/getAppointments")
    public ResponseEntity<List<Appointment>> getAppointments(){
        List<Appointment> appointments = dentalOfficeService.getAllAppointments();
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @PostMapping("/getFreeTime")
    public ResponseEntity<List<String>> getFreeTime(@RequestBody DateAndDurationDTO dateAndDurationDTO){
        List<String> stringTimes = dentalOfficeService.getAllFreeTimes(dateAndDurationDTO);
        return new ResponseEntity<>(stringTimes, HttpStatus.OK);
    }

    @PostMapping("/createAppointment")
    public HttpStatus createAppointment(@RequestBody Appointment appointment){
        if(dentalOfficeService.createAppointment(appointment))
            return HttpStatus.OK;
        return HttpStatus.CONFLICT;
    }

    @PostMapping("/checkDentistId")
    public ResponseEntity<List<Appointment>> checkDentistId(@RequestBody String id){
        boolean goodId = dentalOfficeService.checkDentistId(id);
        if(goodId){
            List<Appointment> dentistAppointments = dentalOfficeService.getAllAppointments();
            return new ResponseEntity<>(dentistAppointments, HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/checkPatientsJmbg")
    public ResponseEntity<List<Appointment>> checkPatientsJmbg(@RequestBody String jmbg){
        List<Appointment> patientAppointments = dentalOfficeService.checkPatientsJmbg(jmbg);
        if(patientAppointments == null)
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        return new ResponseEntity<>(patientAppointments, HttpStatus.OK);
    }

    @DeleteMapping("/cancelAppointment")
    public HttpStatus cancelAppointment(@RequestBody Appointment appointment){
        boolean successfull = dentalOfficeService.cancelAppointment(appointment);
        if(successfull)
            return HttpStatus.OK;
        return HttpStatus.CONFLICT;
    }

}
