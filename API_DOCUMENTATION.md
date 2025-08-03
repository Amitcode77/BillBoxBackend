# BillBox Backend API Documentation

## Authentication APIs

The BillBox Backend supports two authentication modes that can be configured via the `USE_JWT` environment variable:

- **JWT Mode** (`USE_JWT=true`) - Uses JSON Web Tokens for stateless authentication
- **Simple Mode** (`USE_JWT=false`) - Uses email/password authentication for each request

---

## 1. Login API

Authenticates a user with email and password.

### Endpoint
```
POST /api/v1/auth/login
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

### Request Body Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address |
| password | string | Yes | User's password |

### Response Format

#### JWT Mode Response (`USE_JWT=true`)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "string",
      "email": "string",
      "fullName": "string",
      "phone": "string",
      "role": "string",
      "permissions": ["string"],
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)"
    },
    "token": "string (JWT token)"
  }
}
```

#### Simple Mode Response (`USE_JWT=false`)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "string",
      "email": "string",
      "fullName": "string",
      "phone": "string",
      "role": "string",
      "permissions": ["string"],
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)"
    },
    "authenticated": true
  }
}
```

### Response Schema
| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Always true for successful login |
| message | string | Success message |
| data.user | object | User information |
| data.user._id | string | User's unique identifier |
| data.user.email | string | User's email address |
| data.user.fullName | string | User's full name |
| data.user.phone | string | User's phone number |
| data.user.role | string | User's role (admin, manager, staff) |
| data.user.permissions | array | Array of user permissions |
| data.user.createdAt | string | User creation timestamp |
| data.user.updatedAt | string | User last update timestamp |
| data.token | string | JWT token (JWT mode only) |
| data.authenticated | boolean | Authentication status (Simple mode only) |

### Error Responses

#### 400 Bad Request - Missing Fields
```json
{
  "success": false,
  "message": "Email and password are required",
  "data": null
}
```

#### 400 Bad Request - Invalid Email
```json
{
  "success": false,
  "message": "Please provide a valid email address",
  "data": null
}
```

#### 401 Unauthorized - Invalid Credentials
```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Login failed",
  "data": null
}
```

### Example Usage

#### cURL - JWT Mode
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

#### cURL - Simple Mode
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

#### JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:5000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword'
  })
});

const data = await response.json();
```

---

## 2. Logout API

Logs out the current user and invalidates their session.

### Endpoint
```
POST /api/v1/auth/logout
```

### Request Headers

#### JWT Mode (`USE_JWT=true`)
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Simple Mode (`USE_JWT=false`)
```
Content-Type: application/json
```

### Request Body
No request body required.

### Response Format
```json
{
  "success": true,
  "message": "Logout successful",
  "data": {
    "loggedOut": true
  }
}
```

### Response Schema
| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Always true for successful logout |
| message | string | Success message |
| data.loggedOut | boolean | Always true |

### Error Responses

#### 400 Bad Request - Missing Token (JWT Mode)
```json
{
  "success": false,
  "message": "Token is required",
  "data": null
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Logout failed",
  "data": null
}
```

### Example Usage

#### cURL - JWT Mode
```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

#### cURL - Simple Mode
```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Content-Type: application/json"
```

#### JavaScript/Fetch - JWT Mode
```javascript
const response = await fetch('http://localhost:5000/api/v1/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

#### JavaScript/Fetch - Simple Mode
```javascript
const response = await fetch('http://localhost:5000/api/v1/auth/logout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

---

## 3. Get Current User Profile API

Retrieves the current user's profile information.

### Endpoint
```
GET /api/v1/auth/me
```

### Request Headers

#### JWT Mode (`USE_JWT=true`)
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Simple Mode (`USE_JWT=false`)
```
Content-Type: application/json
```

### Request Body

#### JWT Mode
No request body required.

#### Simple Mode
```json
{
  "email": "string (required)"
}
```

### Request Body Schema (Simple Mode)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address |

### Response Format
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "_id": "string",
    "email": "string",
    "fullName": "string",
    "phone": "string",
    "role": "string",
    "permissions": ["string"],
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  }
}
```

### Response Schema
| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Always true for successful retrieval |
| message | string | Success message |
| data._id | string | User's unique identifier |
| data.email | string | User's email address |
| data.fullName | string | User's full name |
| data.phone | string | User's phone number |
| data.role | string | User's role (admin, manager, staff) |
| data.permissions | array | Array of user permissions |
| data.createdAt | string | User creation timestamp |
| data.updatedAt | string | User last update timestamp |

### Error Responses

#### 400 Bad Request - Missing Token (JWT Mode)
```json
{
  "success": false,
  "message": "Token is required",
  "data": null
}
```

#### 400 Bad Request - Missing Email (Simple Mode)
```json
{
  "success": false,
  "message": "Email is required",
  "data": null
}
```

#### 401 Unauthorized - Invalid Token
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "data": null
}
```

#### 404 Not Found - User Not Found
```json
{
  "success": false,
  "message": "User not found",
  "data": null
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to get user profile",
  "data": null
}
```

### Example Usage

#### cURL - JWT Mode
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

#### cURL - Simple Mode
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

#### JavaScript/Fetch - JWT Mode
```javascript
const response = await fetch('http://localhost:5000/api/v1/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

#### JavaScript/Fetch - Simple Mode
```javascript
const response = await fetch('http://localhost:5000/api/v1/auth/me', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com'
  })
});

const data = await response.json();
```

---

## Complete Workflow Examples

### JWT Mode Workflow

1. **Login and get token:**
```bash
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
```

2. **Get user profile:**
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

3. **Logout:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### Simple Mode Workflow

1. **Login (no token):**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

2. **Get user profile:**
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

3. **Logout:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Content-Type: application/json"
```

---

## Environment Configuration

### JWT Mode Configuration
```env
USE_JWT=true
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=24h
```

### Simple Mode Configuration
```env
USE_JWT=false
```

---

## Error Codes Summary

| HTTP Status | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Missing required fields, invalid email format |
| 401 | Unauthorized | Invalid credentials, missing/invalid token |
| 404 | Not Found | User not found |
| 500 | Internal Server Error | Server error during authentication |

---

## Security Notes

1. **JWT Mode:**
   - Tokens should be stored securely on the client side
   - Tokens have an expiration time (configurable via `JWT_EXPIRY`)
   - Always use HTTPS in production

2. **Simple Mode:**
   - Credentials are sent with every request
   - More suitable for server-to-server communication
   - Always use HTTPS in production

3. **General:**
   - Passwords are hashed using bcrypt
   - Email validation is performed
   - Rate limiting should be implemented in production 