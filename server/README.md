# Digital Coupon Marketplace

Backend service for managing and selling digital coupons.

The system allows administrators to create coupon products and resellers to view and purchase them.
Each coupon can be sold **only once**.

The service is implemented with **Node.js**, **Express**, and **MongoDB**, and runs locally using **Docker Compose**.

---

# Tech Stack

* Node.js
* Express
* MongoDB
* Mongoose
* Docker
* Docker Compose

---

# Architecture

The system contains two main components:

**API Server (Node.js + Express)**
Handles product creation, listing, and purchasing logic.

**MongoDB Database**
Stores products and coupon information.

Docker Compose runs both services:

* `server` – Node.js backend
* `mongo` – MongoDB database

---

# Project Structure

```
digital-coupon-marketplace
│
├── server
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   └── server.js
│   │
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .dockerignore
└── README.md
```

---

# Quick Start

Clone the repository:

```
git clone <repo-url>
cd digital-coupon-marketplace
```

Run the project with Docker:

```
docker compose up --build
```

The API will be available at:

```
http://localhost:5000
```

MongoDB runs inside Docker as well.

---

# Stop Containers

Stop the running containers:

```
docker compose down
```

Remove containers and database volumes:

```
docker compose down -v
```

---

# API Endpoints

## Health Check

```
GET /api/health
```

---

## Create Product (Admin)

```
POST /api/admin/products
```

Example request body:

```
{
  "name": "Amazon $100 Coupon",
  "description": "Gift card",
  "image_url": "https://example.com/img.png",
  "cost_price": 80,
  "margin_percentage": 25,
  "coupon_value_type": "STRING",
  "coupon_value": "ABCD-1234"
}
```

The server calculates the minimum selling price automatically.

---

## Get Available Products (Reseller)

```
GET /api/v1/products
```

Header:

```
Authorization: Bearer dev-token-123
```

Example response:

```
[
  {
    "id": "product_id",
    "name": "Amazon $100 Coupon",
    "description": "Gift card",
    "image_url": "https://example.com/img.png",
    "price": 100
  }
]
```

---

## Purchase Product

```
POST /api/v1/products/:id/purchase
```

Request body:

```
{
  "reseller_price": 120
}
```

Example response:

```
{
  "product_id": "69a95f97b2834485ca583963",
  "final_price": 120,
  "value_type": "STRING",
  "value": "ABCD-1234"
}
```

---

# Purchase Flow

1. Admin creates a coupon product.
2. The product appears in the reseller products list.
3. A reseller sends a purchase request.
4. The server attempts to mark the coupon as sold.
5. If the coupon was not sold before, the purchase succeeds.
6. If it was already sold, the request fails.

---

# Concurrency Handling

Each coupon can be sold only once.

To prevent race conditions, the purchase operation uses an atomic MongoDB query.

The server performs a `findOneAndUpdate` with the condition:

```
is_sold: false
```

If two purchase requests happen at the same time, only the first request succeeds.

The second request receives:

```
409 PRODUCT_ALREADY_SOLD
```

---

# Environment Variables

The server supports the following environment variables:

| Variable  | Description               | Default                                  |
| --------- | ------------------------- | ---------------------------------------- |
| PORT      | Server port               | 5000                                     |
| MONGO_URI | MongoDB connection string | mongodb://mongo:27017/coupon_marketplace |

---

# Notes

This project was built as a backend exercise demonstrating:

* REST API design
* atomic database operations
* handling race conditions
* containerized development with Docker
* simple product purchase flow
