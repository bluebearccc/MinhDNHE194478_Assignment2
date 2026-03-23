package com.bluebear.minhdnhe194478_assigment2_be.security;

import com.bluebear.minhdnhe194478_assigment2_be.entity.SystemAccount;
import com.bluebear.minhdnhe194478_assigment2_be.repository.SystemAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final SystemAccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        SystemAccount account = accountRepository.findByAccountEmail(email.trim())
                .orElseThrow(() -> new UsernameNotFoundException("Account not found with email: " + email));

        String role = account.getAccountRole() == 1 ? "ROLE_ADMIN" : "ROLE_STAFF";

        return User.builder()
                .username(account.getAccountEmail().trim())
                .password(account.getAccountPassword() != null ? account.getAccountPassword().trim() : "")
                .authorities(List.of(new SimpleGrantedAuthority(role)))
                .build();
    }
}
