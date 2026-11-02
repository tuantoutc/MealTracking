# Backend Database Querying & Search Rules

> **Phạm vi áp dụng (Scope):** Chỉ áp dụng khi làm việc với tầng Repository, Service truy vấn database hoặc các API tìm kiếm/lấy dữ liệu liên quan đến Spring Data JPA và PostgreSQL.

## JPA & PostgreSQL Dynamic Search Rule
When generating Spring Data JPA `@Query` or dynamic searches for PostgreSQL:
- **NEVER** generate `(:param IS NULL OR LOWER(column) LIKE LOWER(:param))`. This causes a PostgreSQL JDBC driver exception: `operator does not exist: lower(bytea)`.
- **PREFERRED PATTERN**: Use JPA `Specification` or `Criteria API` (via `JpaSpecificationExecutor<T>`). Conditionally append the `LIKE` predicate in Java only if the `param` is not null and not empty.
- **FALLBACK PATTERN**: If JPQL `@Query` must be used, add a comment instructing the developer to sanitize the `param` to an empty string `""` at the Service layer, or explicitly use `CAST(:param as text)` in the query string.
