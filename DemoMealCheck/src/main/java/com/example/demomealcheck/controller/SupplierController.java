package com.example.demomealcheck.controller;

import com.example.demomealcheck.domain.enums.ClientStatus;
import com.example.demomealcheck.domain.enums.ClientType;
import com.example.demomealcheck.domain.enums.PartnerCategory;
import com.example.demomealcheck.domain.enums.PartnerStatus;
import com.example.demomealcheck.dto.ApiResponse;
import com.example.demomealcheck.dto.request.FoodPartnerRequest;
import com.example.demomealcheck.dto.request.SupplierClientRequest;
import com.example.demomealcheck.dto.response.FoodPartnerResponse;
import com.example.demomealcheck.dto.response.FoodPartnerSummaryResponse;
import com.example.demomealcheck.dto.response.SupplierClientResponse;
import com.example.demomealcheck.dto.response.SupplierClientSummaryResponse;
import com.example.demomealcheck.dto.response.SupplierSummaryDto;
import com.example.demomealcheck.security.UserPrincipal;
import com.example.demomealcheck.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/supplier")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ROLE_SUPPLIER', 'ROLE_ADMIN')")
public class SupplierController {

    private final SupplierService supplierService;

    // ==================== DASHBOARD SUMMARY ====================

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<SupplierSummaryDto>> getSummary(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        SupplierSummaryDto summary = supplierService.getSupplierSummary(principal);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    // ==================== FOOD PARTNERS ====================

    @GetMapping("/partners")
    public ResponseEntity<ApiResponse<Page<FoodPartnerSummaryResponse>>> getPartners(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) PartnerCategory category,
            @RequestParam(required = false) PartnerStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), Sort.by("id").descending());
        Page<FoodPartnerSummaryResponse> partners = supplierService.getPartners(principal, category, status, search, pageable);
        return ResponseEntity.ok(ApiResponse.success(partners));
    }

    @GetMapping("/partners/{id}")
    public ResponseEntity<ApiResponse<FoodPartnerResponse>> getPartnerById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {
        FoodPartnerResponse partner = supplierService.getPartnerById(principal, id);
        return ResponseEntity.ok(ApiResponse.success(partner));
    }

    @PostMapping("/partners")
    public ResponseEntity<ApiResponse<FoodPartnerResponse>> createPartner(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody FoodPartnerRequest request
    ) {
        FoodPartnerResponse partner = supplierService.createPartner(principal, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm đối tác cung cấp thực phẩm thành công", partner));
    }

    @PutMapping("/partners/{id}")
    public ResponseEntity<ApiResponse<FoodPartnerResponse>> updatePartner(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody FoodPartnerRequest request
    ) {
        FoodPartnerResponse partner = supplierService.updatePartner(principal, id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật đối tác thành công", partner));
    }

    @DeleteMapping("/partners/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePartner(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {
        supplierService.deletePartner(principal, id);
        return ResponseEntity.ok(ApiResponse.success("Xóa đối tác thành công", null));
    }

    // ==================== CLIENTS / CUSTOMERS ====================

    @GetMapping("/clients")
    public ResponseEntity<ApiResponse<Page<SupplierClientSummaryResponse>>> getClients(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) ClientType clientType,
            @RequestParam(required = false) ClientStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), Sort.by("id").descending());
        Page<SupplierClientSummaryResponse> clients = supplierService.getClients(principal, clientType, status, search, pageable);
        return ResponseEntity.ok(ApiResponse.success(clients));
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<ApiResponse<SupplierClientResponse>> getClientById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {
        SupplierClientResponse client = supplierService.getClientById(principal, id);
        return ResponseEntity.ok(ApiResponse.success(client));
    }

    @PostMapping("/clients")
    public ResponseEntity<ApiResponse<SupplierClientResponse>> createClient(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SupplierClientRequest request
    ) {
        SupplierClientResponse client = supplierService.createClient(principal, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm khách hàng thành công", client));
    }

    @PutMapping("/clients/{id}")
    public ResponseEntity<ApiResponse<SupplierClientResponse>> updateClient(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody SupplierClientRequest request
    ) {
        SupplierClientResponse client = supplierService.updateClient(principal, id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật khách hàng thành công", client));
    }

    @DeleteMapping("/clients/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteClient(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {
        supplierService.deleteClient(principal, id);
        return ResponseEntity.ok(ApiResponse.success("Xóa khách hàng thành công", null));
    }
}
