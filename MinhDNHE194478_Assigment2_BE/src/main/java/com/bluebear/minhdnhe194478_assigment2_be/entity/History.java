package com.bluebear.minhdnhe194478_assigment2_be.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "History")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HistoryID")
    private Integer historyId;

    @NotBlank(message = "Action type is required")
    @Size(max = 50, message = "Action type must not exceed 50 characters")
    @Column(name = "ActionType", length = 50, nullable = false)
    private String actionType; // CREATE, UPDATE, DELETE

    @NotBlank(message = "Entity type is required")
    @Size(max = 50, message = "Entity type must not exceed 50 characters")
    @Column(name = "EntityType", length = 50, nullable = false)
    private String entityType; // NEWS, CATEGORY, TAG, etc.

    @Column(name = "EntityID")
    private Integer entityId;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Column(name = "Description", length = 500)
    private String description;

    @Column(name = "OldValue", columnDefinition = "TEXT")
    private String oldValue;

    @Column(name = "NewValue", columnDefinition = "TEXT")
    private String newValue;

    @NotNull(message = "Action date is required")
    @Column(name = "ActionDate", nullable = false)
    private LocalDateTime actionDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PerformedByAccountID")
    private SystemAccount performedBy;

    @Size(max = 100, message = "IP address must not exceed 100 characters")
    @Column(name = "IPAddress", length = 100)
    private String ipAddress;

    @Size(max = 200, message = "User agent must not exceed 200 characters")
    @Column(name = "UserAgent", length = 200)
    private String userAgent;
}