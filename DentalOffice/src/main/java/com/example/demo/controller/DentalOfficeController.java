package com.example.demo.controller;

import com.example.demo.DTO.DateAndDurationDTO;
import com.example.demo.model.Appointment;
import com.example.demo.service.DentalOfficeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin("http://localhost:3000")
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

    @GetMapping("/getAllAppointments")
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

    @PostMapping("/checkPatientsJmbg")
    public ResponseEntity<List<Appointment>> checkPatientsJmbg(@RequestBody String jmbg){
        List<Appointment> patientAppointments = dentalOfficeService.checkPatientsJmbg(jmbg);
        if(patientAppointments == null)
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        return new ResponseEntity<>(patientAppointments, HttpStatus.OK);
    }

    @CrossOrigin
    @DeleteMapping("/cancelAppointment")
    public HttpStatus cancelAppointment(@RequestBody Appointment appointment){
        boolean successfull = dentalOfficeService.cancelAppointment(appointment);
        if(successfull)
            return HttpStatus.OK;
        return HttpStatus.CONFLICT;
    }

}
