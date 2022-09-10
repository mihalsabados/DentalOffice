package com.example.demo.repository;

import com.example.demo.model.Appointment;
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
//        List<Appointment> appointments = objectMapper.readValue(loadFileWithSpring(), new TypeReference<List<Appointment>>(){});
        List<Appointment> appointments = objectMapper.readValue(new File("appointments.json"), new TypeReference<List<Appointment>>(){});
        return appointments;
    }

    public File loadFileWithSpring()
            throws FileNotFoundException {
        return ResourceUtils.getFile("classpath:static/appointments.json");
    }

    public void createAppointment(Appointment appointment) throws IOException {
        List<Appointment> appointments = readAllAppointments();
        appointments.add(appointment);
        ObjectWriter writer = objectMapper.writer(new DefaultPrettyPrinter());
        writer.writeValue(new File("appointments.json"),appointments);
    }

    public String getDentistKey() throws FileNotFoundException {
        File file = new File("dentistId.txt");
        Scanner reader = new Scanner(file);
        String Id = reader.nextLine();
        reader.close();
        return Id;
    }


    public void saveAppointments(List<Appointment> allAppointments) throws IOException {
        ObjectWriter writer = objectMapper.writer(new DefaultPrettyPrinter());
        writer.writeValue(new File("appointments.json"),allAppointments);
    }
}
