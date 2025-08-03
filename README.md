# BillBox Backend

A comprehensive billing and inventory management system built with Node.js, Express, and MongoDB. This backend provides robust APIs for managing products, users, invoices, and inventory with real-time stock tracking and transaction management.

## 🚀 Features

### Core Functionality
- **Product Management**: CRUD operations for products with inventory tracking
- **User Management**: User authentication and role-based access control
- **Invoice Generation**: Create invoices with automatic stock deduction
- **Inventory Tracking**: Real-time stock updates with transaction safety
- **Bulk Operations**: Mass quantity updates for efficient inventory management

### Technical Features
- **Database Transactions**: ACID compliance for critical operations
- **Request Logging**: Comprehensive API request/response logging
- **Health Monitoring**: Database connection health checks
- **Error Handling**: Robust error management with detailed responses
- **Input Validation**: Comprehensive request validation and sanitization

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: bcrypt for password hashing
- **Environment**: dotenv for configuration management

## 📁 Project Structure

```
BillBox-Backend/
├── src/
│   ├── config/
│   │   └── mongo.client.js          # Database connection management
│   ├── controllers/
│   │   ├── base.controller.js       # Base CRUD controller
│   │   ├── health.controller.js     # Health check endpoints
│   │   ├── invoice.controller.js    # Invoice management
│   │   ├── product.controller.js    # Product management
│   │   └── user.controller.js       # User management
│   ├── middleware/
│   │   └── db.middleware.js         # Database connection middleware
│   ├── models/
│   │   ├── invoice.model.js         # Invoice schema with items
│   │   ├── product.model.js         # Product schema
│   │   └── user.model.js            # User schema with authentication
│   ├── routes/
│   │   ├── health.route.js          # Health check routes
│   │   ├── index.route.js           # Main route aggregator
│   │   ├── invoice.route.js         # Invoice endpoints
│   │   ├── product.route.js         # Product endpoints
│   │   └── user.route.js            # User endpoints
│   ├── services/
│   │   ├── base.service.js          # Base CRUD service
│   │   ├── invoice.service.js       # Invoice business logic
│   │   ├── product.service.js       # Product business logic
│   │   └── user.service.js          # User business logic
│   ├── utils/
│   │   └── query-builder.js         # Database query utilities
│   └── server.js                    # Application entry point
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── package.json                     # Dependencies and scripts
└── README.md                        # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BillBox-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/billbox
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Response Format

All API responses follow a standardized format:

**Success Response:**
```json
{
  "success": true,
  "message": "success",
  "data": {
    // Response payload (object, array, etc.)
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "failed",
  "data": {
    // Additional error details (optional)
  }
}
```

### Base URL
```
http://localhost:5000/api/v1
```

### Health Check
```http
GET /health
```
Returns database connection status and server health information.

**Example Response:**
```json
{
  "success": true,
  "message": "Health check successful",
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "database": {
      "status": "connected",
      "readyState": 1
    },
    "uptime": 123.456,
    "memory": {
      "rss": 12345678,
      "heapTotal": 9876543,
      "heapUsed": 5432109,
      "external": 123456
    }
  }
}
```

### Products

#### Get All Products
```http
GET /product
```

#### Get Product by ID
```http
GET /product/:id
```

#### Create Product
```http
POST /product
Content-Type: application/json

{
  "name": "Product Name",
  "category": "Electronics",
  "description": "Product description",
  "price": 99.99,
  "quantity": 100,
  "image": "product-image-url"
}
```

#### Update Product
```http
PATCH /product/:id
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 89.99
}
```

#### Bulk Quantity Update
```http
PATCH /product/quantities
Content-Type: application/json

{
  "quantityUpdates": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 50
    },
    {
      "productId": "507f1f77bcf86cd799439012",
      "quantity": 25
    }
  ]
}
```

#### Delete Product
```http
DELETE /product/:id
```

### Invoices

#### Get All Invoices
```http
GET /invoice
```

#### Get Invoice by ID
```http
GET /invoice/:id
```

#### Create Invoice
```http
POST /invoice
Content-Type: application/json

{
  "soldBy": "507f1f77bcf86cd799439012",
  "items": [
    {
      "product": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "paymentMethod": "cash"
}
```

#### Update Invoice
```http
PATCH /invoice/:id
```

#### Delete Invoice
```http
DELETE /invoice/:id
```

### Users

#### Get All Users
```http
GET /user
```

#### Get User by ID
```http
GET /user/:id
```

#### Create User
```http
POST /user
Content-Type: application/json

{
  "email": "user@example.com",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "password": "securepassword",
  "role": "staff"
}
```

#### Update User
```http
PATCH /user/:id
```

#### Delete User
```http
DELETE /user/:id
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/billbox` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |

### Database Models

#### Product Schema
- `name` (String, required): Product name
- `category` (String, required): Product category
- `description` (String, required): Product description
- `price` (Number, required): Product price
- `quantity` (Number, required): Available stock
- `image` (String): Product image URL

#### Invoice Schema
- `invoiceNumber` (String, unique): Auto-generated invoice number
- `items` (Array): Invoice items with product snapshots
- `totalAmount` (Number, required): Total invoice amount
- `paymentMethod` (String): Payment method (cash/card/upi)
- `soldBy` (ObjectId): Reference to user who created invoice

#### User Schema
- `email` (String, unique, required): User email
- `fullName` (String): User's full name
- `phone` (String): Contact number
- `passwordHash` (String, required): Hashed password
- `role` (String): User role (admin/manager/staff)

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses
- **Database Transactions**: ACID compliance for critical operations

## 📊 Database Features

- **Automatic Invoice Numbers**: Format: `INV-YYYYMMDDHHMMSS-RANDOM`
- **Stock Management**: Automatic deduction on invoice creation
- **Transaction Safety**: Database sessions for critical operations
- **Data Integrity**: Referential integrity with ObjectId references

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set up proper logging
4. Configure reverse proxy (nginx)
5. Set up SSL certificates

### Docker (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation above
- Review the project structure for implementation details 