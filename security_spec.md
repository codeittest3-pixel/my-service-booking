# Security Specification

## 1. Data Invariants
- A reservation must have an authenticated owner (UID).
- The document ID must strictly match `isValidId()`.
- The `createdAt` must match server-side `request.time`.
- Key fields (`id`, `resourceId`, `date`, `startTime`, `endTime`, `purpose`, `status`, `createdAt`) are non-nullable and strictly validated.
- Updates cannot modify once status becomes `completed` or `cancelled` (terminal status lock).

## 2. The "Dirty Dozen" Malicious Payloads
Here are 12 specific payloads attempting to violate system integrity:
1. **Unauthenticated Read/Write**: Attempt to read or write without signing in.
2. **Path ID Poisoning**: Using a 1MB string or junk paths like `/../../something` in Reservation ID.
3. **Spoofed CreatedAt**: Trying to submit a historical time for `createdAt` rather than `request.time`.
4. **Invalid Status Injection**: Requesting with `status: "super_active"` (violates enum).
5. **Ghost Fields Injection**: Trying to insert field `role: "admin"` inside the reservation payload.
6. **Bypassing Character Size Limits**: Submitting 10MB `purpose` or `notes` to cause DB storage exhaustion.
7. **Modifying Terminal Records**: Trying to edit a reservation that is already `completed`.
8. **Cancelling Already Cancelled Reservation**: Trying to edit schedules of cancelled reservations.
9. **Missing Mandatory Field**: Submitting without `resourceId` to cause application crashes.
10. **Orphaned Writes**: Trying to set empty values in ids or references.
11. **Malicious Regex Bypass**: Using invalid characters like emojis in target reservation IDs.
12. **Blanket Query List Scraping**: Attempting to read lists without query enforcements (such as standard authentication matches).
