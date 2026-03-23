package com.bluebear.minhdnhe194478_assigment2_be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {
    private Integer accountId;
    private String accountName;
    private String accountEmail;
    private Integer accountRole;
}
