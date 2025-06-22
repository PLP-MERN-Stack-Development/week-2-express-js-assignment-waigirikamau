# 🛠️ Products API – Express.js

This is a simple RESTful API built with **Express.js** that manages products with full CRUD functionality, middleware, error handling, filtering, pagination, and search.

---

## 🚀 How to Run the Server

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/products-api.git
cd products-api

npm install

PORT=3000
API_KEY=my-secret-key

node Express.js

http://localhost:3000


GET /api/products?category=electronics&page=1&limit=2
{
  "total": 1,
  "page": 1,
  "limit": 2,
  "products": [
    {
      "id": "123",
      "name": "Laptop",
      "category": "electronics",
      "description": "High-performance laptop",
      "price": 1200,
      "inStock": true
    }
  ]
}

{
  "id": "123",
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}

{
  "name": "Tablet",
  "description": "A small computer",
  "price": 300,
  "category": "electronics",
  "inStock": true
}
 
 {
  "id": "new-id",
  "name": "Tablet",
  "description": "A small computer",
  "price": 300,
  "category": "electronics",
  "inStock": true
}

{
  "total": 1,
  "results": [
    {
      "id": "abc123",
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ]
}

{
  "stats": {
    "electronics": 2,
    "fashion": 1
  }
}

🔐 Authentication
To access protected routes (POST, PUT, DELETE), you must send an API key header:

x-api-key: my-secret-key

