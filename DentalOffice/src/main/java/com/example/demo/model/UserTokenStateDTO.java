package com.example.demo.model;

public class UserTokenStateDTO {
    private String accessToken;
    private Long expiresIn;
    private User user;

    public UserTokenStateDTO() {
        this.accessToken = null;
        this.expiresIn = null;
        this.user = null;
    }

    public UserTokenStateDTO(String accessToken, long expiresIn, User user) {
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public Long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }
}
