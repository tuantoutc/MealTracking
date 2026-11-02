package com.example.demomealcheck.repository;

import com.example.demomealcheck.domain.entity.FoodPartner;
import com.example.demomealcheck.domain.enums.PartnerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FoodPartnerRepository extends JpaRepository<FoodPartner, Long>, JpaSpecificationExecutor<FoodPartner> {

    Optional<FoodPartner> findByIdAndSupplierId(Long id, Long supplierId);

    long countBySupplierId(Long supplierId);

    long countBySupplierIdAndStatus(Long supplierId, PartnerStatus status);
}
