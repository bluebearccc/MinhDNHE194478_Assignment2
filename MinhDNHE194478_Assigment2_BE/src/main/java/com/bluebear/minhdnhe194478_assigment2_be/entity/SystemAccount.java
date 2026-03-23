package com.bluebear.minhdnhe194478_assigment2_be.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "SystemAccount")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AccountID")
    private Integer accountId;

    @NotBlank(message = "Account name is required")
    @Size(max = 100, message = "Account name must not exceed 100 characters")
    @Column(name = "AccountName", length = 100)
    private String accountName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 70, message = "Email must not exceed 70 characters")
    @Column(name = "AccountEmail", length = 70, unique = true)
    private String accountEmail;

    @NotNull(message = "Role is required")
    @Min(value = 1, message = "Role must be 1 (Admin) or 2 (Staff)")
    @Max(value = 2, message = "Role must be 1 (Admin) or 2 (Staff)")
    @Column(name = "AccountRole")
    private Integer accountRole;

    @NotBlank(message = "Password is required")
    @Size(max = 70, message = "Password must not exceed 70 characters")
    @Column(name = "AccountPassword", length = 70)
    private String accountPassword;
}
