package com.example.demomealcheck.config;

import com.example.demomealcheck.domain.entity.FoodPartner;
import com.example.demomealcheck.domain.entity.Role;
import com.example.demomealcheck.domain.entity.SupplierClient;
import com.example.demomealcheck.domain.entity.User;
import com.example.demomealcheck.domain.enums.*;
import com.example.demomealcheck.repository.FoodPartnerRepository;
import com.example.demomealcheck.repository.RoleRepository;
import com.example.demomealcheck.repository.SupplierClientRepository;
import com.example.demomealcheck.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final FoodPartnerRepository foodPartnerRepository;
    private final SupplierClientRepository supplierClientRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        log.info("Khởi tạo dữ liệu nền tảng và tài khoản quản trị hệ thống...");

        // Danh mục đầy đủ vai trò
        List<String> roleNames = List.of(
                "ROLE_ADMIN",
                "ROLE_USER",
                "ROLE_SUPPLIER",
                "ROLE_GATE_INSPECTOR",
                "ROLE_NUTRITIONIST",
                "ROLE_TEACHER",
                "ROLE_PARENT",
                "ROLE_WARD_OFFICER",
                "ROLE_PRINCIPAL"
        );

        for (String rName : roleNames) {
            roleRepository.findByName(rName).orElseGet(() ->
                    roleRepository.save(Role.builder().name(rName).build())
            );
        }

        // Tạo tài khoản Admin mặc định nếu chưa tồn tại
        String adminEmail = "admin@mealtrace.vn";
        if (!userRepository.existsByEmail(adminEmail)) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
            Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow();

            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode("Admin@123456"))
                    .fullName("Quản Trị Viên Hệ Thống")
                    .phoneNumber("0901234567")
                    .organization("Ban Quản Trị Hệ Thống MealTrace")
                    .address("Tòa nhà Điều Hành Bán Trú, Quận 1, TP. Hồ Chí Minh")
                    .provider(AuthProvider.LOCAL)
                    .requestedRole("ROLE_ADMIN")
                    .approvalStatus(ApprovalStatus.APPROVED)
                    .emailVerified(true)
                    .verifiedBadge(true)
                    .locked(false)
                    .enabled(true)
                    .roles(new HashSet<>(Set.of(adminRole, userRole)))
                    .build();

            userRepository.save(admin);
            log.info(">>> ĐÃ KHỞI TẠO TÀI KHOẢN ADMIN: {} / Admin@123456", adminEmail);
        }

        // Tạo tài khoản Nhà Cung Cấp mẫu nếu chưa tồn tại
        String supplierEmail = "supplier@mealtrace.vn";
        User supplier;
        if (!userRepository.existsByEmail(supplierEmail)) {
            Role supplierRole = roleRepository.findByName("ROLE_SUPPLIER").orElseThrow();
            Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow();

            supplier = User.builder()
                    .email(supplierEmail)
                    .password(passwordEncoder.encode("Supplier@123456"))
                    .fullName("Bếp Trung Tâm VinaMeal Catering")
                    .phoneNumber("0918889999")
                    .organization("Công ty CP Suất Ăn Học Đường VinaMeal")
                    .address("Lô C2, KCN Tân Bình, Phường Tây Thạnh, Quận Tân Phú, TP. HCM")
                    .provider(AuthProvider.LOCAL)
                    .requestedRole("ROLE_SUPPLIER")
                    .approvalStatus(ApprovalStatus.APPROVED)
                    .emailVerified(true)
                    .verifiedBadge(true)
                    .locked(false)
                    .enabled(true)
                    .roles(new HashSet<>(Set.of(supplierRole, userRole)))
                    .build();

            supplier = userRepository.save(supplier);
            log.info(">>> ĐÃ KHỞI TẠO TÀI KHOẢN NHÀ CUNG CẤP: {} / Supplier@123456", supplierEmail);
        } else {
            supplier = userRepository.findByEmail(supplierEmail).orElse(null);
        }

        // Khởi tạo đối tác thực phẩm mẫu và khách hàng mẫu cho supplier
        if (supplier != null && foodPartnerRepository.countBySupplierId(supplier.getId()) == 0) {
            seedSampleSupplierData(supplier);
        }
    }

    private void seedSampleSupplierData(User supplier) {
        log.info("Khởi tạo danh mục đối tác thực phẩm & khách hàng mẫu cho Nhà cung cấp: {}", supplier.getEmail());

        // 1. Đối tác Rau củ
        foodPartnerRepository.save(FoodPartner.builder()
                .supplier(supplier)
                .name("Hợp Tác Xã Nông Sản Sạch Đà Lạt GreenFarm")
                .category(PartnerCategory.RAU_CU)
                .representative("Ông Nguyễn Văn Thịnh")
                .phone("0987111222")
                .email("sales@dalatgreenfarm.vn")
                .address("Thôn Đa Quý, Xã Xuân Thọ, TP. Đà Lạt, Tỉnh Lâm Đồng")
                .suppliedProducts("Bắp cải tím, Cà chua bi, Su su, Cà rốt, Cải ngọt baby, Xà lách thủy canh")
                .contractNumber("HĐ-2026/DLG-VM-01")
                .contractStartDate(LocalDate.of(2026, 1, 1))
                .contractEndDate(LocalDate.of(2026, 12, 31))
                .certifications("Chứng nhận VietGAP số 142/VietGAP-NN; Giấy chứng nhận ATTP số 88/2025/NNPTNT-LĐ")
                .certificateFiles("https://cert.greenfarm.vn/vietgap-2026.pdf")
                .status(PartnerStatus.ACTIVE)
                .notes("Giao hàng xe lạnh hàng ngày lúc 04:30 sáng tại Bếp trung tâm.")
                .build());

        // 2. Đối tác Thịt tươi sống
        foodPartnerRepository.save(FoodPartner.builder()
                .supplier(supplier)
                .name("Công Ty TNHH Thực Phẩm Tươi Sống CP Food Vietnam")
                .category(PartnerCategory.THIT_CA)
                .representative("Bà Lê Thị Mai Lan")
                .phone("0934555666")
                .email("contact@cpfood.com.vn")
                .address("KCN Biên Hòa 2, Phường Long Bình, TP. Biên Hòa, Tỉnh Đồng Nai")
                .suppliedProducts("Thịt heo nạc dăm, Ức gà phi lê, Thịt bò Úc tươi, Tôm nõn bóc vỏ")
                .contractNumber("HĐ-2026/CP-MEAL-88")
                .contractStartDate(LocalDate.of(2026, 2, 1))
                .contractEndDate(LocalDate.of(2027, 2, 1))
                .certifications("Chuẩn kiểm dịch Thú y 3F (Feed-Farm-Food), Chứng nhận HACCP Codex 2020")
                .certificateFiles("https://cpfood.com.vn/cert-haccp-2026.pdf")
                .status(PartnerStatus.ACTIVE)
                .notes("Kèm phiếu xét nghiệm âm tính Salmonella và chất cấm mỗi chuyến giao.")
                .build());

        // 3. Đối tác Đồ khô
        foodPartnerRepository.save(FoodPartner.builder()
                .supplier(supplier)
                .name("Tổng Kho Nông Sản & Lương Thực Miền Nam")
                .category(PartnerCategory.DO_KHO)
                .representative("Ông Trần Đình Trọng")
                .phone("0912334455")
                .email("luongthuc.mn@gmail.com")
                .address("Kho B3, Cảng Tân Thuận Đông, Quận 7, TP. Hồ Chí Minh")
                .suppliedProducts("Gạo ST25 chuẩn đóng túi 25kg, Đậu xanh hạt, Nấm hương khô, Mộc nhĩ, Miến dong")
                .contractNumber("HĐ-2025/LT-MN-09")
                .contractStartDate(LocalDate.of(2025, 9, 1))
                .contractEndDate(LocalDate.of(2026, 9, 1))
                .certifications("Chứng chỉ ISO 22000:2018, Phiếu kiểm nghiệm tồn dư thuốc BVTV đạt tiêu chuẩn")
                .certificateFiles("https://storage.mealtrace.vn/docs/iso-luongthuc.pdf")
                .status(PartnerStatus.ACTIVE)
                .notes("Giao định kỳ vào thứ Hai hàng tuần.")
                .build());

        // 4. Đối tác Gia vị & Nhu yếu phẩm
        foodPartnerRepository.save(FoodPartner.builder()
                .supplier(supplier)
                .name("Công Ty Phân Phối Gia Vị Thực Phẩm VinaSpices")
                .category(PartnerCategory.GIA_VI_NHU_YEU_PHAM)
                .representative("Bà Vũ Hoàng Yến")
                .phone("0945678901")
                .email("order@vinaspices.vn")
                .address("Số 45 đường số 8, KDC Cityland Park Hills, Quận Gò Vấp, TP. HCM")
                .suppliedProducts("Nước mắm truyền thống Phú Quốc 35 độ đạm, Muối I-ốt tinh khiết, Dầu ăn hoa cải Simply, Đường cát Biên Hòa")
                .contractNumber("HĐ-2026/VS-03")
                .contractStartDate(LocalDate.of(2026, 1, 15))
                .contractEndDate(LocalDate.of(2027, 1, 15))
                .certifications("Cam kết 100% hóa đơn VAT điện tử, đạt kiểm định chất lượng định kỳ Viện Pasteur")
                .certificateFiles("https://vinaspices.vn/pasteur-report.pdf")
                .status(PartnerStatus.ACTIVE)
                .notes("Hạn sử dụng tối thiểu còn 80% tại thời điểm nhập kho.")
                .build());

        // Khách hàng mẫu
        supplierClientRepository.save(SupplierClient.builder()
                .supplier(supplier)
                .name("Trường Tiểu Học Chu Văn An")
                .clientType(ClientType.TRUONG_TIEU_HOC)
                .address("Số 115 đường Nguyễn Văn Cừ, Phường 2, Quận 5, TP. Hồ Chí Minh")
                .representativeName("Thầy Phạm Quang Vinh")
                .representativeTitle("Phó Hiệu Trưởng / Phụ Trách Bán Trú")
                .phone("0903112233")
                .email("bantiu.chuvanan@edu.vn")
                .contractNumber("HĐCƯ-2026/CVA-VM")
                .dailyServings(750)
                .pricePerServing(35000.0)
                .contractStartDate(LocalDate.of(2026, 8, 15))
                .contractEndDate(LocalDate.of(2027, 5, 31))
                .contractPdfUrl("https://storage.mealtrace.vn/contracts/hopdong-chuvanan-2026.pdf")
                .status(ClientStatus.ACTIVE)
                .notes("Giao trước 09:30 sáng. Kiểm nhiệt độ tại cổng ≥ 65°C.")
                .build());

        supplierClientRepository.save(SupplierClient.builder()
                .supplier(supplier)
                .name("Trường Mầm Non Hướng Dương 1")
                .clientType(ClientType.TRUONG_MAM_NON)
                .address("Số 24 đường Lê Lai, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh")
                .representativeName("Cô Đỗ Bích Hạnh")
                .representativeTitle("Hiệu Trưởng")
                .phone("0919445566")
                .email("mamnonhuongduong1@gmail.com")
                .contractNumber("HĐCƯ-2026/HD1-VM")
                .dailyServings(380)
                .pricePerServing(32000.0)
                .contractStartDate(LocalDate.of(2026, 9, 1))
                .contractEndDate(LocalDate.of(2027, 6, 30))
                .contractPdfUrl("https://storage.mealtrace.vn/contracts/hopdong-huongduong-2026.pdf")
                .status(ClientStatus.ACTIVE)
                .notes("Thực đơn xay nhuyễn và thái hạt lựu phù hợp lứa tuổi 3-5 tuổi.")
                .build());

        supplierClientRepository.save(SupplierClient.builder()
                .supplier(supplier)
                .name("Tập Đoàn Công Nghệ FPT Software (Tòa nhà F-Town 3)")
                .clientType(ClientType.DOANH_NGHIEP)
                .address("Khu Công Nghệ Cao, Phường Tân Phú, TP. Thủ Đức, TP. Hồ Chí Minh")
                .representativeName("Anh Hoàng Quốc Tuấn")
                .representativeTitle("Trưởng Ban Tiện Ích & Đời Sống Nhân Viên")
                .phone("0988667788")
                .email("tuanhq@fpt.com")
                .contractNumber("HĐ-2026/FPTSOFT-CATERING")
                .dailyServings(520)
                .pricePerServing(45000.0)
                .contractStartDate(LocalDate.of(2026, 1, 1))
                .contractEndDate(LocalDate.of(2026, 12, 31))
                .contractPdfUrl("https://storage.mealtrace.vn/contracts/hopdong-fpt-2026.pdf")
                .status(ClientStatus.ACTIVE)
                .notes("Giao 2 ca: Trưa 11:15 và Chiều tăng ca 17:30.")
                .build());
    }
}
