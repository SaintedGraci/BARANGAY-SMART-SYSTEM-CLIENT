# 🗄️ Document Archive System

## Overview

The Document Archive System allows barangay staff to archive claimed document requests for record-keeping and future reference. This keeps the active requests list clean while preserving historical data.

---

## Features

### ✅ Core Functionality

1. **Auto-Tracking Claimed Dates**
   - When a document is marked as "Claimed", the system automatically records `claimedDate`
   - Timestamp preserved for accurate record-keeping

2. **Manual Archiving**
   - Staff can manually archive claimed documents
   - Records who archived it and when (`archivedBy`, `archivedDate`)

3. **Search & Filter Archives**
   - Search by resident name or document type
   - Filter by date range
   - Filter by document type
   - Pagination support (50 records per page)

4. **Restore from Archives**
   - Admin/Captain can unarchive requests if needed
   - Useful for corrections or audits

---

## Database Changes

### New Fields in `Requests` Table

| Field | Type | Description |
|-------|------|-------------|
| `isArchived` | BOOLEAN | Default: false. True when archived |
| `claimedDate` | DATE | Auto-set when status → "Claimed" |
| `archivedDate` | DATE | When request was archived |
| `archivedBy` | INTEGER (FK) | User ID who archived it |

### Indexes Added

- `idx_requests_archived` - Fast filtering of archived requests
- `idx_requests_claimed_date` - Quick date range queries
- `idx_requests_archived_status` - Composite index for complex queries

---

## API Endpoints

### 1. Mark as Claimed

**POST** `/api/requests/:id/claim`

**Permission:** staff, secretary, captain, admin

**Purpose:** Mark "Ready for Release" as "Claimed" and auto-set claimedDate

```bash
curl -X POST http://localhost:5000/api/requests/123/claim \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Request marked as claimed",
  "data": {
    "id": 123,
    "status": "Claimed",
    "claimedDate": "2026-11-07T10:30:00Z"
  }
}
```

---

### 2. Archive Request

**POST** `/api/requests/:id/archive`

**Permission:** staff, secretary, captain, admin

**Purpose:** Move claimed request to archives

**Requirements:**
- Request status must be "Claimed"
- Not already archived

```bash
curl -X POST http://localhost:5000/api/requests/123/archive \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Request archived successfully",
  "data": {
    "id": 123,
    "documentType": "Barangay Clearance",
    "residentName": "Juan Dela Cruz",
    "archivedDate": "2026-11-07T10:35:00Z"
  }
}
```

---

### 3. Get Archived Requests

**GET** `/api/requests/archives`

**Permission:** All authenticated users (residents see only their own)

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search resident name or document type | `?search=Juan` |
| `startDate` | date | Filter claimed date from | `?startDate=2026-01-01` |
| `endDate` | date | Filter claimed date to | `?endDate=2026-12-31` |
| `documentType` | string | Filter by document type | `?documentType=Barangay%20Clearance` |
| `page` | integer | Page number (default: 1) | `?page=2` |
| `limit` | integer | Records per page (default: 50) | `?limit=100` |

```bash
# Get all archives
curl http://localhost:5000/api/requests/archives \
  -H "Authorization: Bearer YOUR_TOKEN"

# Search archives
curl "http://localhost:5000/api/requests/archives?search=Juan&startDate=2026-01-01" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "documentType": "Barangay Clearance",
      "purpose": "Employment requirement",
      "status": "Claimed",
      "claimedDate": "2026-11-07T10:30:00Z",
      "archivedDate": "2026-11-07T10:35:00Z",
      "isArchived": true,
      "Resident": {
        "firstName": "Juan",
        "lastName": "Dela Cruz",
        "contactNumber": "09123456789"
      }
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "totalPages": 3
  }
}
```

---

### 4. Unarchive Request

**POST** `/api/requests/:id/unarchive`

**Permission:** captain, admin (higher permission level)

**Purpose:** Restore archived request to active list

```bash
curl -X POST http://localhost:5000/api/requests/123/unarchive \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Request restored from archives",
  "data": {
    "id": 123,
    "isArchived": false,
    "archivedDate": null
  }
}
```

---

## User Flow

### For Secretary/Staff:

```
1. Resident picks up document
   ↓
2. Staff marks as "Claimed"
   POST /api/requests/:id/claim
   ✅ claimedDate auto-set
   ↓
3. After some time (end of day/week/month)
   ↓
4. Staff archives claimed requests
   POST /api/requests/:id/archive
   ✅ Moved to archives
   ↓
5. View archives anytime
   GET /api/requests/archives
```

### Workflow Example:

```javascript
// Step 1: Mark as claimed
const claimResponse = await fetch('/api/requests/123/claim', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});

// Step 2: Archive (can be done immediately or later)
const archiveResponse = await fetch('/api/requests/123/archive', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});

// Step 3: Search archives later
const archives = await fetch('/api/requests/archives?search=Juan&page=1', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## Benefits

### 1. **Clean Active List**
- Active requests only show unclaimed/pending documents
- Easier for staff to focus on current work
- Reduced clutter

### 2. **Historical Record**
- All claimed documents preserved
- Easy to search past records
- Audit trail maintained

### 3. **Performance**
- Pagination prevents loading thousands of records
- Indexes speed up queries
- Efficient date range filtering

### 4. **Compliance**
- Record retention for legal purposes
- Track who archived what and when
- Supports barangay record-keeping requirements

---

## Migration

### Run Migration Manually

```bash
cd barangay_server
node migrations/add-request-archive-system.js
```

### Auto-Migration (Railway/Production)

Migration runs automatically on server start via `auto-migrate.js`

### Migration Features

✅ Adds 4 new columns to Requests table
✅ Creates 3 indexes for performance
✅ Migrates existing "Claimed" requests (sets claimedDate)
✅ Safe to run multiple times (checks if columns exist)

---

## Frontend Integration Ideas

### Admin Dashboard - Archives Tab

```jsx
function ArchivesTab() {
  const [archives, setArchives] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchArchives();
  }, [search, page]);

  const fetchArchives = async () => {
    const res = await api.get(`/requests/archives?search=${search}&page=${page}`);
    setArchives(res.data.data);
  };

  return (
    <div>
      <h2>📦 Document Archives</h2>
      <input 
        type="text" 
        placeholder="Search archives..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Resident</th>
            <th>Document Type</th>
            <th>Claimed Date</th>
            <th>Archived Date</th>
          </tr>
        </thead>
        <tbody>
          {archives.map(req => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>{req.Resident.firstName} {req.Resident.lastName}</td>
              <td>{req.documentType}</td>
              <td>{new Date(req.claimedDate).toLocaleDateString()}</td>
              <td>{new Date(req.archivedDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination page={page} onPageChange={setPage} />
    </div>
  );
}
```

### Request Management - Archive Button

```jsx
function RequestRow({ request, onArchived }) {
  const handleArchive = async () => {
    try {
      await api.post(`/requests/${request.id}/archive`);
      toast.success('Request archived successfully');
      onArchived();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to archive');
    }
  };

  return (
    <tr>
      <td>{request.documentType}</td>
      <td>{request.status}</td>
      <td>
        {request.status === 'Claimed' && !request.isArchived && (
          <button onClick={handleArchive}>
            📦 Archive
          </button>
        )}
      </td>
    </tr>
  );
}
```

---

## Security

### Permissions

| Action | Allowed Roles |
|--------|---------------|
| Mark as Claimed | staff, secretary, captain, admin |
| Archive Request | staff, secretary, captain, admin |
| View Archives | All (residents see only their own) |
| Unarchive | captain, admin only |

### Data Protection

- Archived requests are NOT deleted (soft archive)
- All timestamps preserved
- Audit trail maintained (archivedBy field)
- Can be unarchived if needed

---

## Testing

### Manual Test Script

```bash
# 1. Create a test request
curl -X POST http://localhost:5000/api/requests \
  -H "Authorization: Bearer RESIDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"documentServiceId": 1, "purpose": "Test archive"}'

# 2. Update to Ready for Release (as admin)
curl -X PUT http://localhost:5000/api/requests/123 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "Ready for Release"}'

# 3. Mark as claimed
curl -X POST http://localhost:5000/api/requests/123/claim \
  -H "Authorization: Bearer ADMIN_TOKEN"

# 4. Archive it
curl -X POST http://localhost:5000/api/requests/123/archive \
  -H "Authorization: Bearer ADMIN_TOKEN"

# 5. View in archives
curl "http://localhost:5000/api/requests/archives" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# 6. Unarchive (if needed)
curl -X POST http://localhost:5000/api/requests/123/unarchive \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Future Enhancements

### Potential Features:

1. **Auto-Archive**
   - Automatically archive claimed requests after X days
   - Configurable in system_settings

2. **Export Archives**
   - Download CSV/Excel of archived requests
   - Date range reports

3. **Archive Statistics**
   - Total archived per month
   - Most requested document types
   - Average processing time

4. **Bulk Archive**
   - Archive multiple claimed requests at once
   - Filter and archive in batch

---

## Summary

The Document Archive System provides a complete solution for managing historical document requests while keeping the active workspace clean and organized. It supports future audits, record-keeping requirements, and provides a searchable history of all claimed documents.

**Key Takeaways:**
- ✅ Automatic `claimedDate` tracking
- ✅ Manual archive control
- ✅ Powerful search & filter
- ✅ Preserve audit trail
- ✅ Ready for Railway deployment
