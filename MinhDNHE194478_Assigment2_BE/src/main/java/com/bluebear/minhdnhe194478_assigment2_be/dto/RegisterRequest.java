package com.bluebear.minhdnhe194478_assigment2_be.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Account name is required")
    @Size(max = 100, message = "Account name must not exceed 100 characters")
    private String accountName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 70, message = "Email must not exceed 70 characters")
    private String accountEmail;

    @NotBlank(message = "Password is required")
    @Size(max = 70, message = "Password must not exceed 70 characters")
    private String accountPassword;
}