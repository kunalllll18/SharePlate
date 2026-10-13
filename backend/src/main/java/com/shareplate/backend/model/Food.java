package com.shareplate.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "foods")
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Food name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Donor name is required")
    @Column(nullable = false)
    private String donor;

    @NotBlank(message = "Quantity is required")
    @Column(nullable = false)
    private String quantity;

    @NotBlank(message = "Pickup location is required")
    @Column(nullable = false)
    private String location;

    @NotNull(message = "Pickup deadline is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm[:ss]")
    @Column(nullable = false)
    private LocalDateTime deadline;

    @Column(nullable = false)
    private String status = "Available";

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm[:ss]")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm[:ss]")
    private LocalDateTime claimedAt;

    private String claimedBy;

    private String claimedByRole;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null || status.isBlank()) {
            status = "Available";
        }
    }

    public Food() {
    }

    public Food(String name, String donor, String quantity, String location, LocalDateTime deadline, String status) {
        this.name = name;
        this.donor = donor;
        this.quantity = quantity;
        this.location = location;
        this.deadline = deadline;
        this.status = status != null ? status : "Available";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDonor() {
        return donor;
    }

    public void setDonor(String donor) {
        this.donor = donor;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getClaimedAt() {
        return claimedAt;
    }

    public void setClaimedAt(LocalDateTime claimedAt) {
        this.claimedAt = claimedAt;
    }

    public String getClaimedBy() {
        return claimedBy;
    }

    public void setClaimedBy(String claimedBy) {
        this.claimedBy = claimedBy;
    }

    public String getClaimedByRole() {
        return claimedByRole;
    }

    public void setClaimedByRole(String claimedByRole) {
        this.claimedByRole = claimedByRole;
    }
}
