package com.example.demomealcheck.service.impl;

import com.example.demomealcheck.domain.entity.FoodPartner;
import com.example.demomealcheck.domain.entity.SupplierClient;
import com.example.demomealcheck.domain.entity.User;
import com.example.demomealcheck.domain.enums.ClientStatus;
import com.example.demomealcheck.domain.enums.ClientType;
import com.example.demomealcheck.domain.enums.PartnerCategory;
import com.example.demomealcheck.domain.enums.PartnerStatus;
import com.example.demomealcheck.dto.request.FoodPartnerRequest;
import com.example.demomealcheck.dto.request.SupplierClientRequest;
import com.example.demomealcheck.dto.response.FoodPartnerResponse;
import com.example.demomealcheck.dto.response.FoodPartnerSummaryResponse;
import com.example.demomealcheck.dto.response.SupplierClientResponse;
import com.example.demomealcheck.dto.response.SupplierClientSummaryResponse;
import com.example.demomealcheck.dto.response.SupplierSummaryDto;
import com.example.demomealcheck.repository.FoodPartnerRepository;
import com.example.demomealcheck.repository.SupplierClientRepository;
import com.example.demomealcheck.repository.UserRepository;
import com.example.demomealcheck.security.UserPrincipal;
import com.example.demomealcheck.service.SupplierService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SupplierServiceImpl implements SupplierService {

    private final FoodPartnerRepository foodPartnerRepository;
    private final SupplierClientRepository supplierClientRepository;
    private final UserRepository userRepository;

    private User getSupplierUser(UserPrincipal principal) {
        if (principal == null) {
            throw new IllegalArgumentException("Phiên đăng nhập không hợp lệ");
        }
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin tài khoản người dùng"));
    }

    // ==================== FOOD PARTNERS ====================

    @Override
    @Transactional(readOnly = true)
    public Page<FoodPartnerSummaryResponse> getPartners(UserPrincipal principal, PartnerCategory category, PartnerStatus status, String search, Pageable pageable) {
        User supplier = getSupplierUser(principal);

        Specification<FoodPartner> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("supplier").get("id"), supplier.getId()));

            if (category != null) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate nameLike = cb.like(cb.lower(root.get("name")), pattern);
                Predicate productLike = cb.like(cb.lower(root.get("suppliedProducts")), pattern);
                Predicate repLike = cb.like(cb.lower(root.get("representative")), pattern);
                Predicate contractLike = cb.like(cb.lower(root.get("contractNumber")), pattern);
                predicates.add(cb.or(nameLike, productLike, repLike, contractLike));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return foodPartnerRepository.findAll(spec, pageable)
                .map(FoodPartnerSummaryResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public FoodPartnerResponse getPartnerById(UserPrincipal principal, Long id) {
        User supplier = getSupplierUser(principal);
        FoodPartner partner = foodPartnerRepository.findByIdAndSupplierId(id, supplier.getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đối tác cung cấp thực phẩm với ID: " + id));
        return FoodPartnerResponse.fromEntity(partner);
    }

    @Override
    public FoodPartnerResponse createPartner(UserPrincipal principal, FoodPartnerRequest request) {
        User supplier = getSupplierUser(principal);

        FoodPartner partner = FoodPartner.builder()
                .supplier(supplier)
                .name(request.getName().trim())
                .category(request.getCategory())
                .representative(request.getRepresentative())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .suppliedProducts(request.getSuppliedProducts())
                .contractNumber(request.getContractNumber())
                .contractStartDate(request.getContractStartDate())
                .contractEndDate(request.getContractEndDate())
                .certifications(request.getCertifications())
                .certificateFiles(request.getCertificateFiles())
                .status(request.getStatus() != null ? request.getStatus() : PartnerStatus.ACTIVE)
                .notes(request.getNotes())
                .build();

        FoodPartner saved = foodPartnerRepository.save(partner);
        log.info("Nhà cung cấp {} ({}) đã thêm đối tác thực phẩm: {}", supplier.getFullName(), supplier.getId(), saved.getName());
        return FoodPartnerResponse.fromEntity(saved);
    }

    @Override
    public FoodPartnerResponse updatePartner(UserPrincipal principal, Long id, FoodPartnerRequest request) {
        User supplier = getSupplierUser(principal);
        FoodPartner partner = foodPartnerRepository.findByIdAndSupplierId(id, supplier.getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đối tác cung cấp thực phẩm với ID: " + id));

        partner.setName(request.getName().trim());
        partner.setCategory(request.getCategory());
        partner.setRepresentative(request.getRepresentative());
        partner.setPhone(request.getPhone());
        partner.setEmail(request.getEmail());
        partner.setAddress(request.getAddress());
        partner.setSuppliedProducts(request.getSuppliedProducts());
        partner.setContractNumber(request.getContractNumber());
        partner.setContractStartDate(request.getContractStartDate());
        partner.setContractEndDate(request.getContractEndDate());
        partner.setCertifications(request.getCertifications());
        partner.setCertificateFiles(request.getCertificateFiles());
        if (request.getStatus() != null) {
            partner.setStatus(request.getStatus());
        }
        partner.setNotes(request.getNotes());

        FoodPartner updated = foodPartnerRepository.save(partner);
        log.info("Cập nhật đối tác thực phẩm ID: {} bởi supplier ID: {}", id, supplier.getId());
        return FoodPartnerResponse.fromEntity(updated);
    }

    @Override
    public void deletePartner(UserPrincipal principal, Long id) {
        User supplier = getSupplierUser(principal);
        FoodPartner partner = foodPartnerRepository.findByIdAndSupplierId(id, supplier.getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đối tác thực phẩm với ID: " + id));

        foodPartnerRepository.delete(partner);
        log.info("Xóa đối tác thực phẩm ID: {} bởi supplier ID: {}", id, supplier.getId());
    }

    // ==================== CLIENTS / CUSTOMERS ====================

    @Override
    @Transactional(readOnly = true)
    public Page<SupplierClientSummaryResponse> getClients(UserPrincipal principal, ClientType clientType, ClientStatus status, String search, Pageable pageable) {
        User supplier = getSupplierUser(principal);

        Specification<SupplierClient> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("supplier").get("id"), supplier.getId()));

            if (clientType != null) {
                predicates.add(cb.equal(root.get("clientType"), clientType));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                Predicate nameLike = cb.like(cb.lower(root.get("name")), pattern);
                Predicate addressLike = cb.like(cb.lower(root.get("address")), pattern);
                Predicate repLike = cb.like(cb.lower(root.get("representativeName")), pattern);
                Predicate contractLike = cb.like(cb.lower(root.get("contractNumber")), pattern);
                predicates.add(cb.or(nameLike, addressLike, repLike, contractLike));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return supplierClientRepository.findAll(spec, pageable)
                .map(SupplierClientSummaryResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public SupplierClientResponse getClientById(UserPrincipal principal, Long id) {
        User supplier = getSupplierUser(principal);
        SupplierClient client = supplierClientRepository.findByIdAndSupplierId(id, supplier.getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng sử dụng dịch vụ với ID: " + id));
        return SupplierClientResponse.fromEntity(client);
    }

    @Override
    public SupplierClientResponse createClient(UserPrincipal principal, SupplierClientRequest request) {
        User supplier = getSupplierUser(principal);

        SupplierClient client = SupplierClient.builder()
                .supplier(supplier)
                .name(request.getName().trim())
                .clientType(request.getClientType())
                .address(request.getAddress())
                .representativeName(request.getRepresentativeName())
                .representativeTitle(request.getRepresentativeTitle())
                .phone(request.getPhone())
                .email(request.getEmail())
                .contractNumber(request.getContractNumber())
                .dailyServings(request.getDailyServings() != null ? request.getDailyServings() : 0)
                .pricePerServing(request.getPricePerServing() != null ? request.getPricePerServing() : 0.0)
                .contractStartDate(request.getContractStartDate())
                .contractEndDate(request.getContractEndDate())
                .contractPdfUrl(request.getContractPdfUrl())
                .status(request.getStatus() != null ? request.getStatus() : ClientStatus.ACTIVE)
                .notes(request.getNotes())
                .build();

        SupplierClient saved = supplierClientRepository.save(client);
        log.info("Nhà cung cấp {} ({}) đã thêm khách hàng: {}", supplier.getFullName(), supplier.getId(), saved.getName());
        return SupplierClientResponse.fromEntity(saved);
    }

    @Override
    public SupplierClientResponse updateClient(UserPrincipal principal, Long id, SupplierClientRequest request) {
        User supplier = getSupplierUser(principal);
        SupplierClient client = supplierClientRepository.findByIdAndSupplierId(id, supplier.getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng sử dụng dịch vụ với ID: " + id));

        client.setName(request.getName().trim());
        client.setClientType(request.getClientType());
        client.setAddress(request.getAddress());
        client.setRepresentativeName(request.getRepresentativeName());
        client.setRepresentativeTitle(request.getRepresentativeTitle());
        client.setPhone(request.getPhone());
        client.setEmail(request.getEmail());
        client.setContractNumber(request.getContractNumber());
        if (request.getDailyServings() != null) {
            client.setDailyServings(request.getDailyServings());
        }
        if (request.getPricePerServing() != null) {
            client.setPricePerServing(request.getPricePerServing());
        }
        client.setContractStartDate(request.getContractStartDate());
        client.setContractEndDate(request.getContractEndDate());
        client.setContractPdfUrl(request.getContractPdfUrl());
        if (request.getStatus() != null) {
            client.setStatus(request.getStatus());
        }
        client.setNotes(request.getNotes());

        SupplierClient updated = supplierClientRepository.save(client);
        log.info("Cập nhật khách hàng ID: {} bởi supplier ID: {}", id, supplier.getId());
        return SupplierClientResponse.fromEntity(updated);
    }

    @Override
    public void deleteClient(UserPrincipal principal, Long id) {
        User supplier = getSupplierUser(principal);
        SupplierClient client = supplierClientRepository.findByIdAndSupplierId(id, supplier.getId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khách hàng sử dụng dịch vụ với ID: " + id));

        supplierClientRepository.delete(client);
        log.info("Xóa khách hàng ID: {} bởi supplier ID: {}", id, supplier.getId());
    }

    // ==================== DASHBOARD SUMMARY ====================

    @Override
    @Transactional(readOnly = true)
    public SupplierSummaryDto getSupplierSummary(UserPrincipal principal) {
        User supplier = getSupplierUser(principal);
        long totalPartners = foodPartnerRepository.countBySupplierId(supplier.getId());
        long activePartners = foodPartnerRepository.countBySupplierIdAndStatus(supplier.getId(), PartnerStatus.ACTIVE);
        long totalClients = supplierClientRepository.countBySupplierId(supplier.getId());
        long activeClients = supplierClientRepository.countBySupplierIdAndStatus(supplier.getId(), ClientStatus.ACTIVE);
        long totalDailyServings = supplierClientRepository.sumActiveDailyServingsBySupplierId(supplier.getId());

        return SupplierSummaryDto.builder()
                .totalPartners(totalPartners)
                .activePartners(activePartners)
                .totalClients(totalClients)
                .activeClients(activeClients)
                .totalDailyServings(totalDailyServings)
                .build();
    }
}
