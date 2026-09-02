package com.beebank.access;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "access_password")
public class AccessPassword {

    @Id
    private Long id;

    @Column(nullable = false, length = 100)
    private String password;

    protected AccessPassword() {
    }

    public String getPassword() {
        return password;
    }
}
