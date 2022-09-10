package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

public class Appointment {
    private String firstName;
    private String lastName;
    private String jmbg;
    private String lbo;
    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern = "dd.MM.yyyy.")
    private Date date;
    private int duration;
    private String time;
    private String phoneNumber;

    public Appointment() {
    }

    public Appointment(String firstName, String lastName, String jmbg, String lbo, Date date, int duration, String time, String phoneNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.jmbg = jmbg;
        this.lbo = lbo;
        this.date = date;
        this.duration = duration;
        this.time = time;
        this.phoneNumber = phoneNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }



    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getJmbg() {
        return jmbg;
    }

    public void setJmbg(String jmbg) {
        this.jmbg = jmbg;
    }

    public String getLbo() {
        return lbo;
    }

    public void setLbo(String lbo) {
        this.lbo = lbo;
    }
}
