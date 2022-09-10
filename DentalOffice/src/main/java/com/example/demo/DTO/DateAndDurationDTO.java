package com.example.demo.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class DateAndDurationDTO {
    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern = "dd.MM.yyyy.")
    private Date date;
    private int duration;

    public DateAndDurationDTO() {
    }

    public DateAndDurationDTO(Date date, int duration) {
        this.date = date;
        this.duration = duration;
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
}
