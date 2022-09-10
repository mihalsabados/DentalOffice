package com.example.demo.service;

import com.example.demo.DTO.DateAndDurationDTO;
import com.example.demo.model.Appointment;
import com.example.demo.repository.DentalOfficeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DentalOfficeService {
    private DentalOfficeRepo dentalOfficeRepo;

    public DentalOfficeService() {
    }

    @Autowired
    public DentalOfficeService(DentalOfficeRepo dentalOfficeRepo) {
        this.dentalOfficeRepo = dentalOfficeRepo;
    }

    public List<Appointment> getAllAppointments(){
        List<Appointment> appointments = null;
        try {
            appointments = dentalOfficeRepo.readAllAppointments();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return appointments;
    }

    public List<String> getAllFreeTimes(DateAndDurationDTO dateAndDurationDTO) {
        List<LocalTime> freeTimes = fillAllTimes(dateAndDurationDTO.getDuration());
        List<LocalTime> unavailableTimes = new ArrayList<>();
        List<Appointment> allAppointments = getAllAppointments();
        findUnavailableTimes(dateAndDurationDTO, freeTimes, unavailableTimes, allAppointments);
        freeTimes.removeAll(unavailableTimes);
        List<String> stringTimes = convertTimeToString(freeTimes);
        return stringTimes;
    }

    private void findUnavailableTimes(DateAndDurationDTO dateAndDurationDTO, List<LocalTime> freeTimes, List<LocalTime> unavailableTimes, List<Appointment> allAppointments) {
        Date date = dateAndDurationDTO.getDate();
        setTimeToDefault(date);
        for (Appointment ap: allAppointments) {
            Date dateWithoutTime = ap.getDate();
            setTimeToDefault(dateWithoutTime);
            if(dateWithoutTime.equals(date)){
                LocalTime startTime = LocalTime.of(Integer.parseInt(ap.getTime().split(":")[0]), Integer.parseInt(ap.getTime().split(":")[1]), 0);
                LocalTime endTime = startTime.plusMinutes(ap.getDuration());
                for (LocalTime time: freeTimes) {
                    if((time.isAfter(startTime) && time.isBefore(endTime)) || time.equals(startTime))
                        unavailableTimes.add(time);
                }
            }
        }
    }

    private void setTimeToDefault(Date date){
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
    }

    private List<LocalTime> fillAllTimes(int duration){
        List<LocalTime> times = new ArrayList<>();
        LocalTime time = LocalTime.of(9,0,0);
        for(;time.isBefore(LocalTime.of(17,0,0));time = time.plusMinutes(duration)){
            times.add(time);
        }
        return times;
    }

    private List<String> convertTimeToString(List<LocalTime> times){
        List<String> stringTimes = new ArrayList<>();
        for (LocalTime time : times) {
            stringTimes.add(time.getHour()+":"+time.getMinute()+(time.getMinute()==0?"0":""));
        }
        return stringTimes;
    }

    public boolean createAppointment(Appointment appointment) {
        try {
            if(isTimeAvailability(appointment)){
                Date date = appointment.getDate();
                date.setHours(date.getHours()+5);
                dentalOfficeRepo.createAppointment(appointment);
                return true;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }

    private boolean isTimeAvailability(Appointment appointment) {
        DateAndDurationDTO dateAndDurationDTO = new DateAndDurationDTO();
        dateAndDurationDTO.setDate(appointment.getDate());
        dateAndDurationDTO.setDuration(appointment.getDuration());
        List<String> freeTimes = getAllFreeTimes(dateAndDurationDTO);
        freeTimes = freeTimes.stream().filter(x->Integer.parseInt(x.split(":")[0]) == Integer.parseInt(appointment.getTime().split(":")[0]) &&
                Integer.parseInt(x.split(":")[1]) == Integer.parseInt(appointment.getTime().split(":")[1])).collect(Collectors.toList());
        return freeTimes.size() > 0;
    }

    public boolean checkDentistId(String id) {
        String dentistId = null;
        try {
            dentistId = dentalOfficeRepo.getDentistKey();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        assert dentistId != null;
        return dentistId.equals(id);
    }

    public List<Appointment> checkPatientsJmbg(String jmbg) {
        List<Appointment> allAppointments = getAllAppointments();
        List<Appointment> patientAppointments = allAppointments.stream().filter(e->e.getJmbg().equals(jmbg)).collect(Collectors.toList());

        if(patientAppointments.size() == 0)
            return null;

        Collections.sort(patientAppointments, new Comparator<Appointment>(){
            public int compare(Appointment o1, Appointment o2){
                return o2.getDate().compareTo(o1.getDate());
            }
        });

        return patientAppointments;
    }

    public boolean cancelAppointment(Appointment appointment) {
        List<Appointment> allAppointments = getAllAppointments();
        allAppointments.removeIf(x->(x.getJmbg().equals(appointment.getJmbg()) && x.getDate().equals(appointment.getDate()) && x.getTime().equals(appointment.getTime())));
        try {
            dentalOfficeRepo.saveAppointments(allAppointments);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }

    }
}
