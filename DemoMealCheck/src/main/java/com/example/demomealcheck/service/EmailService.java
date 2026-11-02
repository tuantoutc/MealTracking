package com.example.demomealcheck.service;

public interface EmailService {
    void sendVerificationEmail(String toEmail, String fullName, String verificationToken);
    void sendAccountApprovalNotification(String toEmail, String fullName, String roleName);
    void sendAccountRejectionNotification(String toEmail, String fullName, String reason);
    void sendAccountWarningNotification(String toEmail, String fullName, String title, String content);
    void sendAccountLockNotification(String toEmail, String fullName, String title, String content);


}
