# Security Specification: Conference Room & Equipment Reservation

## 1. Data Invariants
- A reservation cannot be created without a valid resource ID.
- Reservations must have a defined start time and end time.
- Start time must be before end time (enforced in application layer; rules check type and presence).
- A reservation's ID must be immutable once created.
- Reservation status moves linearly (pending/confirmed -> in_use -> completed/cancelled).
- Terminal status (completed/cancelled) locks further updates unless by an admin.

## 2. The "Dirty Dozen" Payloads (Examples)
1. Injection: Reservation ID > 128 chars (Path Poisoning).
2. Ghost Field: Reservation with `isVerified: true` (Shadow update).
3. Invalid Status: Reservation with `status: 'hacked'`.
4. String Injection: Empty `purpose`.
5. String Poisoning: `purpose` > 1000 chars.
6. Type Poisoning: `attendees` as string "10".
7. Temporal Tampering: `createdAt` set to a past date instead of `request.time`.
8. Immutability Violation: Changing `resourceId` on update.
9. Immutability Violation: Changing `createdAt` on update.
10. Terminal State Violation: Updating a `completed` reservation.
11. Unauthenticated Read: `list` reservations without authenticated context.
12. Unauthenticated Write: `create` reservation without authenticated context.

## 3. The Test Runner
A `firestore.rules.test.ts` file will be developed to assert these 12 cases return PERMISSION_DENIED.
