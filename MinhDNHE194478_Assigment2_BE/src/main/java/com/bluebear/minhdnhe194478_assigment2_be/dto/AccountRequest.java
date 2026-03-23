package com.bluebear.minhdnhe194478_assigment2_be.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AccountRequest {

    @NotBlank(message = "Account name is required")
    @Size(max = 100, message = "Account name must not exceed 100 characters")
    private String accountName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 70, message = "Email must not exceed 70 characters")
    private String accountEmail;

    @NotNull(message = "Role is required")
    @Min(value = 1, message = "Role must be 1 (Admin) or 2 (Staff)")
    @Max(value = 2, message = "Role must be 1 (Admin) or 2 (Staff)")
    private Integer accountRole;

    @NotBlank(message = "Password is required")
    @Size(max = 70, message = "Password must not exceed 70 characters")
    private String accountPassword;
}
