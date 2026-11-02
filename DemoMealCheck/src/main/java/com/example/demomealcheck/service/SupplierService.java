package com.example.demomealcheck.service;

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
import com.example.demomealcheck.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SupplierService {

    // Food Partners
    Page<FoodPartnerSummaryResponse> getPartners(UserPrincipal principal, PartnerCategory category, PartnerStatus status, String search, Pageable pageable);

    FoodPartnerResponse getPartnerById(UserPrincipal principal, Long id);

    FoodPartnerResponse createPartner(UserPrincipal principal, FoodPartnerRequest request);

    FoodPartnerResponse updatePartner(UserPrincipal principal, Long id, FoodPartnerRequest request);

    void deletePartner(UserPrincipal principal, Long id);

    // Clients / Customers
    Page<SupplierClientSummaryResponse> getClients(UserPrincipal principal, ClientType clientType, ClientStatus status, String search, Pageable pageable);

    SupplierClientResponse getClientById(UserPrincipal principal, Long id);

    SupplierClientResponse createClient(UserPrincipal principal, SupplierClientRequest request);

    SupplierClientResponse updateClient(UserPrincipal principal, Long id, SupplierClientRequest request);

    void deleteClient(UserPrincipal principal, Long id);

    // Dashboard summary
    SupplierSummaryDto getSupplierSummary(UserPrincipal principal);
}
