# Backend Connection Debug Guide

## Expected API Calls

When you navigate to Inventory screens, you should see these requests in the Network tab:

### Inventory Module (Base: http://localhost:8080/api/inventory)

1. **Categories**
   - GET http://localhost:8080/api/inventory/categories
   - POST http://localhost:8080/api/inventory/categories
   - PUT http://localhost:8080/api/inventory/categories/{id}
   - DELETE http://localhost:8080/api/inventory/categories/{id}

2. **Products**
   - GET http://localhost:8080/api/inventory/products
   - POST http://localhost:8080/api/inventory/products
   - PUT http://localhost:8080/api/inventory/products/{id}
   - DELETE http://localhost:8080/api/inventory/products/{id}

3. **Brands**
   - GET http://localhost:8080/api/inventory/brands
   - POST http://localhost:8080/api/inventory/brands
   - PUT http://localhost:8080/api/inventory/brands/{id}
   - DELETE http://localhost:8080/api/inventory/brands/{id}

4. **Suppliers**
   - GET http://localhost:8080/api/inventory/suppliers
   - POST http://localhost:8080/api/inventory/suppliers
   - PUT http://localhost:8080/api/inventory/suppliers/{id}
   - DELETE http://localhost:8080/api/inventory/suppliers/{id}

5. **Batches**
   - GET http://localhost:8080/api/inventory/batches
   - POST http://localhost:8080/api/inventory/batches

6. **Stock Operations**
   - GET http://localhost:8080/api/inventory/stock
   - GET http://localhost:8080/api/inventory/transfers
   - POST http://localhost:8080/api/inventory/stock/adjustments
   - POST http://localhost:8080/api/inventory/transfers
   - GET http://localhost:8080/api/inventory/reports/stock-overview

## Console Logs to Look For

When the app loads and you navigate to Inventory:

```
=== ROCS Frontend Starting ===
Environment: development
Backend API Base URL: http://localhost:8080/api/inventory
Token in localStorage: EXISTS
==================================

=== Inventory API called ===
[InventorySystem] Starting to load inventory data...
[InventorySystem] Calling Promise.all for products, categories, brands, suppliers

[API] Token from localStorage: EXISTS
[API] Request: GET http://localhost:8080/api/inventory/products
[InventoryService] GET products
[API] Response: GET /products Status: 200
[InventoryService] GET products response: {success: true, data: [...]}
[InventoryService] GET products mapped: X items

[API] Request: GET http://localhost:8080/api/inventory/categories
[InventoryService] GET categories
[API] Response: GET /categories Status: 200
[InventoryService] GET categories response: {success: true, data: [...]}
[InventoryService] GET categories mapped: X items

[API] Request: GET http://localhost:8080/api/inventory/brands
[InventoryService] GET brands
... (similar for suppliers)

[InventorySystem] Data received: {products: X, categories: Y, brands: Z, suppliers: W}
[InventorySystem] State updated successfully
```

## Expected Backend Response Format

All endpoints should return:
```json
{
  "success": true,
  "data": [...] or {...},
  "message": "Success message"
}
```

Frontend extracts data using: `response.data.data || response.data`

## Troubleshooting

### If you see 404 errors:

1. **Check Network Tab:**
   - Request URL should be: `http://localhost:8080/api/inventory/<resource>`
   - NOT: `/api/v1/inventory`, `/api/inventory/v1`, `/inventory/api`, etc.

2. **Check Console Logs:**
   - Look for `[API] Request:` logs to see actual URLs being called
   - Check if token exists: `[API] Token from localStorage: EXISTS`

3. **Check Backend:**
   - Is Spring Boot running on port 8080?
   - Are inventory endpoints exposed at `/api/inventory/*`?
   - Check backend logs for incoming requests

4. **Check Authorization:**
   - Token should be in format: `Bearer <your-token>`
   - If 401, token might be invalid/expired
   - Frontend will auto-redirect to /login on 401

### If API is not called at all:

1. Check browser console for JavaScript errors
2. Verify InventorySystem component is mounting
3. Look for `=== Inventory API called ===` log
4. Check if useEffect is running (React StrictMode runs it twice in dev)

## Files Updated

- `src/services/api.js` - Base axios instance with auth
- `src/services/inventoryService.js` - Service layer with mapping
- `src/services/inventoryApi.js` - Direct API functions
- `src/services/storeService.js` - Store/stock operations
- `src/inventory/InventorySystem.jsx` - Main inventory component
- `src/main.jsx` - App initialization logging

All have comprehensive debug logging enabled.
