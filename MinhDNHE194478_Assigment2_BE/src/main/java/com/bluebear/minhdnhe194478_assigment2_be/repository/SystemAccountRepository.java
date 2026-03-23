package com.bluebear.minhdnhe194478_assigment2_be.repository;

import com.bluebear.minhdnhe194478_assigment2_be.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemAccountRepository extends JpaRepository<SystemAccount, Integer> {

    Optional<SystemAccount> findByAccountEmail(String accountEmail);

    boolean existsByAccountEmail(String accountEmail);

    List<SystemAccount> findByAccountNameContainingIgnoreCase(String name);
}
