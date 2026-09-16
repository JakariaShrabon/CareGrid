# API Contract

## Common Shape

Successful responses use:

```ts
type ApiResponse<T> = {
  data: T;
  meta: {
    requestId: string;
    timestamp?: string;
  };
};
```

Paginated responses use:

```ts
type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}>;
```

Errors use:

```ts
type ApiError = {
  code: string;
  message: string;
  status: number;
  details?: Record<string, unknown>;
};
```

Timestamps are ISO-8601 strings.

## Naming Conventions

- IDs are strings and use stable prefixes where useful, such as `patient_001`.
- Request/response JSON uses camelCase.
- Enum values use uppercase snake case when they represent durable backend states.
- Money values must be returned by the backend in a documented currency and precision in a later API phase.

## Endpoint Plan

- `GET /patients`
- `GET /patients/:patientId`
- `GET /wards`
- `GET /organ/matches`
- `GET /organ/waiting-list`
- `GET /organ/ischemia`
- `GET /organ/living-donors`
- `GET /blood-bank/inventory`
- `GET /blood-bank/donors`
- `POST /blood-bank/sos`
- `GET /pharmacy/prescriptions`
- `POST /pharmacy/prescriptions`
- `GET /pharmacy/prescriptions/:id`
- `POST /pharmacy/prescriptions/:id/dispense`
- `GET /pharmacy/inventory`
- `GET /billing/bills`
- `GET /billing/bills/:id`
- `GET /billing/claims`
- `GET /billing/discharge/:patientId`
- `GET /billing/discharge/:patientId/pdf`
- `GET /notifications`

## Integration Rule

Feature components must not change when switching from MSW to backend APIs. Integration should update handlers, services, or backend implementations while preserving contracts.
