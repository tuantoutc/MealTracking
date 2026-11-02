package com.example.demomealcheck.repository;

import com.example.demomealcheck.domain.entity.SupplierClient;
import com.example.demomealcheck.domain.enums.ClientStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupplierClientRepository extends JpaRepository<SupplierClient, Long>, JpaSpecificationExecutor<SupplierClient> {

    Optional<SupplierClient> findByIdAndSupplierId(Long id, Long supplierId);

    long countBySupplierId(Long supplierId);

    long countBySupplierIdAndStatus(Long supplierId, ClientStatus status);

    @Query("SELECT COALESCE(SUM(sc.dailyServings), 0) FROM SupplierClient sc WHERE sc.supplier.id = :supplierId AND sc.status = 'ACTIVE'")
    long sumActiveDailyServingsBySupplierId(@Param("supplierId") Long supplierId);
}
