package com.example.demomealcheck.service.impl;

import com.example.demomealcheck.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendVerificationEmail(String toEmail, String fullName, String verificationToken) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + verificationToken;
        String subject = "Xác nhận và kích hoạt tài khoản MealTrace";
        String htmlContent = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h2 style="color: #059669; margin: 0;">MealTrace - Giám Sát Suất Ăn Bán Trú</h2>
                    <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Hệ thống minh bạch hóa & kiểm chuẩn dinh dưỡng học đường</p>
                </div>
                <p>Xin chào <strong>%s</strong>,</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản tham gia hệ thống giám sát suất ăn <strong>MealTrace</strong>.</p>
                <p>Vui lòng nhấn vào nút bên dưới để xác thực địa chỉ email và gửi hồ sơ vào hàng đợi phê duyệt của Ban Quản Trị:</p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="%s" style="background-color: #059669; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">
                        Xác Nhận & Kích Hoạt Email
                    </a>
                </div>
                <p style="font-size: 13px; color: #64748b;">Nếu nút phía trên không hoạt động, bạn có thể copy đường link sau và dán vào trình duyệt:</p>
                <p style="font-size: 13px; word-break: break-all; color: #0284c7;"><a href="%s">%s</a></p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                <p style="font-size: 12px; color: #94a3b8; text-align: center;">Link xác nhận có hiệu lực trong vòng 24 giờ. Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email.</p>
            </div>
            """.formatted(fullName, verificationUrl, verificationUrl, verificationUrl);

        sendHtmlEmail(toEmail, subject, htmlContent, verificationUrl);
    }

    @Override
    public void sendAccountApprovalNotification(String toEmail, String fullName, String roleName) {
        String loginUrl = frontendUrl + "/login";
        String subject = "Chúc mừng! Tài khoản MealTrace của bạn đã được Admin phê duyệt";
        String htmlContent = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <h2 style="color: #059669; margin: 0;">MealTrace - Tài Khoản Đã Được Phê Duyệt</h2>
                <p>Xin chào <strong>%s</strong>,</p>
                <p>Hồ sơ đăng ký của bạn với vai trò <strong>%s</strong> đã được Quản trị viên hệ thống MealTrace xem xét và <strong>CHÍNH THỨC PHÊ DUYỆT</strong>.</p>
                <p>Bạn hiện có thể đăng nhập vào hệ thống để bắt đầu thực hiện các nghiệp vụ theo quyền hạn được cấp.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="%s" style="background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Đăng Nhập Ngay</a>
                </div>
            </div>
            """.formatted(fullName, roleName, loginUrl);

        sendHtmlEmail(toEmail, subject, htmlContent, loginUrl);
    }

    @Override
    public void sendAccountRejectionNotification(String toEmail, String fullName, String reason) {
        String subject = "Thông báo kết quả duyệt tài khoản MealTrace";
        String htmlContent = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <h2 style="color: #e11d48; margin: 0;">Thông Báo Từ Quản Trị Viên MealTrace</h2>
                <p>Xin chào <strong>%s</strong>,</p>
                <p>Rất tiếc, yêu cầu cấp quyền tài khoản của bạn chưa được Quản trị viên chấp thuận vì lý do sau:</p>
                <div style="background-color: #fff1f2; border-left: 4px solid #e11d48; padding: 12px 16px; margin: 16px 0; color: #9f1239;">
                    %s
                </div>
                <p>Vui lòng liên hệ với Quản trị viên qua email hỗ trợ để cập nhật lại thông tin hồ sơ.</p>
            </div>
            """.formatted(fullName, reason);

        sendHtmlEmail(toEmail, subject, htmlContent, null);
    }

    @Override
    public void sendAccountWarningNotification(String toEmail, String fullName, String title, String content) {
        String subject = "[CẢNH BÁO QUẢN TRỊ] " + title;
        String htmlContent = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #fed7aa; border-radius: 12px; background-color: #ffffff;">
                <h2 style="color: #ea580c; margin: 0;">Cảnh Báo Vi Phạm Nghiệp Vụ - MealTrace</h2>
                <p>Kính gửi: <strong>%s</strong>,</p>
                <p>Ban Quản Trị Hệ Thống gửi thông báo cảnh báo liên quan đến tài khoản của bạn:</p>
                <div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 14px 18px; margin: 16px 0;">
                    <p style="font-weight: bold; margin-top: 0; color: #9a3412;">%s</p>
                    <p style="margin-bottom: 0; color: #431407;">%s</p>
                </div>
                <p style="color: #7c2d12; font-size: 13px;">Lưu ý: Nếu vi phạm tiếp diễn, tài khoản của bạn có thể bị tạm khóa hoặc thu hồi vĩnh viễn quyền truy cập.</p>
            </div>
            """.formatted(fullName, title, content);

        sendHtmlEmail(toEmail, subject, htmlContent, null);
    }

    @Override
    public void sendAccountLockNotification(String toEmail, String fullName, String title, String content) {
        String subject = "[THÔNG BÁO VIỆC KHÓA TÀI KHOẢN CỦA BẠN] " + title;
        String htmlContent = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #fed7aa; border-radius: 12px; background-color: #ffffff;">
                <h2 style="color: #ea580c; margin: 0;"> Thông báo khóa tài khoản người dùng  - MealTrace</h2>
                <p>Kính gửi: <strong>%s</strong>,</p>
                <p>Ban Quản Trị Hệ Thống gửi thông báo đến tài khoản của bạn:</p>
                <div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 14px 18px; margin: 16px 0;">
                    <p style="font-weight: bold; margin-top: 0; color: #9a3412;">%s</p>
                    <p style="margin-bottom: 0; color: #431407;">%s</p>
                </div>
                <p style="color: #7c2d12; font-size: 13px;">Lưu ý: Nếu do hành vi phạm tiếp diễn, tài khoản của bạn bị tạm khóa, thu hồi vĩnh viễn quyền truy cập.</p>
            </div>
            """.formatted(fullName, title, content);

        sendHtmlEmail(toEmail, subject, htmlContent, null);
    }

    private void sendHtmlEmail(String toEmail, String subject, String htmlContent, String directLink) {
        // Luôn log ra console để phục vụ phát triển, kiểm thử nội bộ không cần SMTP thực
//        log.info("\n" +
//                "================================================================================\n" +
//                "[EMAIL DISPATCH] ĐẾN: {}\n" +
//                "TIÊU ĐỀ: {}\n" +
//                (directLink != null ? "LIÊN KẾT TRỰC TIẾP: " + directLink + "\n" : "") +
//                "================================================================================"
//                , toEmail, subject);

        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail);
                helper.setTo(toEmail);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);
                mailSender.send(message);
                log.info("Email đã được gửi thành công qua SMTP tới: {}", toEmail);
            } catch (Exception e) {
                log.warn("Không thể gửi email qua SMTP tới {} (Sử dụng đường link trong log console để kiểm thử): {}", toEmail, e.getMessage());
            }
        }
    }
}
