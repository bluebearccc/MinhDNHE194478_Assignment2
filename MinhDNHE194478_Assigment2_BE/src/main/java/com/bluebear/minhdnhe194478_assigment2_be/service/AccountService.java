package com.bluebear.minhdnhe194478_assigment2_be.service;

import com.bluebear.minhdnhe194478_assigment2_be.dto.AccountDTO;
import com.bluebear.minhdnhe194478_assigment2_be.dto.AccountRequest;
import com.bluebear.minhdnhe194478_assigment2_be.entity.SystemAccount;
import com.bluebear.minhdnhe194478_assigment2_be.exception.BusinessException;
import com.bluebear.minhdnhe194478_assigment2_be.exception.ResourceNotFoundException;
import com.bluebear.minhdnhe194478_assigment2_be.repository.NewsArticleRepository;
import com.bluebear.minhdnhe194478_assigment2_be.repository.SystemAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final SystemAccountRepository accountRepository;
    private final NewsArticleRepository newsArticleRepository;


    private AccountDTO toDTO(SystemAccount account) {
        return AccountDTO.builder()
                .accountId(account.getAccountId())
                .accountName(account.getAccountName())
                .accountEmail(account.getAccountEmail())
                .accountRole(account.getAccountRole())
                .build();
    }

    private SystemAccount fromRequest(AccountRequest request) {
        return SystemAccount.builder()
                .accountName(request.getAccountName())
                .accountEmail(request.getAccountEmail())
                .accountRole(request.getAccountRole())
                .accountPassword(request.getAccountPassword())
                .build();
    }


    public List<AccountDTO> getAll() {
        return accountRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public AccountDTO getById(Integer id) {
        return toDTO(accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", id)));
    }

    public List<AccountDTO> search(String name) {
        return accountRepository.findByAccountNameContainingIgnoreCase(name)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public AccountDTO create(AccountRequest request) {
        if (accountRepository.existsByAccountEmail(request.getAccountEmail())) {
            throw new BusinessException("Email already in use: " + request.getAccountEmail());
        }
        SystemAccount saved = accountRepository.save(fromRequest(request));
        return toDTO(saved);
    }

    public AccountDTO update(Integer id, AccountRequest request) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", id));

        if (!account.getAccountEmail().equalsIgnoreCase(request.getAccountEmail())
                && accountRepository.existsByAccountEmail(request.getAccountEmail())) {
            throw new BusinessException("Email already in use: " + request.getAccountEmail());
        }

        account.setAccountName(request.getAccountName());
        account.setAccountEmail(request.getAccountEmail());
        account.setAccountRole(request.getAccountRole());
        account.setAccountPassword(request.getAccountPassword());

        return toDTO(accountRepository.save(account));
    }
    
    public void delete(Integer id) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account", id));

        if (newsArticleRepository.existsByCreatedBy_AccountId(id)) {
            throw new BusinessException(
                    "Cannot delete account '" + account.getAccountName() +
                    "' because they have existing news articles.");
        }

        accountRepository.delete(account);
    }
}
