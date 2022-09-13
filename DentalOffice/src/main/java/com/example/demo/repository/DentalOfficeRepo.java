package com.example.demo.repository;

import com.example.demo.model.Appointment;
import com.example.demo.model.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.springframework.stereotype.Repository;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Scanner;

@Repository
public class DentalOfficeRepo {
    ObjectMapper objectMapper = new ObjectMapper();

    public List<Appointment> readAllAppointments() throws IOException {
        List<Appointment> appointments = objectMapper.readValue(new File("appointments.json"), new TypeReference<List<Appointment>>(){});
        return appointments;
    }

    public void createAppointment(Appointment appointment) throws IOException {
        List<Appointment> appointments = readAllAppointments();
        appointments.add(appointment);
        ObjectWriter writer = objectMapper.writer(new DefaultPrettyPrinter());
        writer.writeValue(new File("appointments.json"),appointments);
    }

    public String getDentistKey() throws FileNotFoundException {
        File file = new File("dentistCredentials.json");
        Scanner reader = new Scanner(file);
        String Id = reader.nextLine();
        reader.close();
        return Id;
    }


    public void saveAppointments(List<Appointment> allAppointments) throws IOException {
        ObjectWriter writer = objectMapper.writer(new DefaultPrettyPrinter());
        writer.writeValue(new File("appointments.json"),allAppointments);
    }

    public User findByUsername(String username) throws IOException {
        User dentist = objectMapper.readValue(new File("dentistCredentials.json"), new TypeReference<User>() {});
        if(dentist.getUsername().equals(username))
            return dentist;
        return null;
    }
}
