// Task 1: Express.js Setup

const express = require('express');      // Import Express
const app = express();                   // Create an instance of Express
const PORT = process.env.PORT || 3000;   // Use environment port or default to 3000

// Middleware to parse JSON bodies
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

// Task 2: RESTful API Routes
const { v4: uuidv4 } = require('uuid');

let products = [
  {
    id: uuidv4(),
    name: 'Laptop',
    description: 'A high-performance laptop',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: uuidv4(),
    name: 'Shoes',
    description: 'Comfortable running shoes',
    price: 60,
    category: 'fashion',
    inStock: false
  }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});


app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  // Simple validation
  if (!name || !description || typeof price !== 'number' || !category || typeof inStock !== 'boolean') {
    return res.status(400).json({ error: 'Invalid product data' });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});


app.put('/api/products/:id', (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  if (!name || !description || typeof price !== 'number' || !category || typeof inStock !== 'boolean') {
    return res.status(400).json({ error: 'Invalid product data' });
  }

  products[index] = { id: products[index].id, name, description, price, category, inStock };
  res.json(products[index]);
});


app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  products.splice(index, 1);
  res.status(204).send(); // No content
});

// Task 3: Middleware Implementation
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());

app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== '123456') {
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }
  next();
});


if (!name || !description || typeof price !== 'number' || !category || typeof inStock !== 'boolean') {
  return next({ status: 400, message: 'Invalid product data' });
}


// Task 4: Error Handling
// middleware/errorHandler.js

module.exports = (err, req, res, next) => {
  console.error(err.stack); // optional: log to terminal

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
  });
};

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

module.exports = { NotFoundError, ValidationError };

const { NotFoundError, ValidationError } = require('./utils/errors');

app.get('/api/products/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  res.json(product);
});

app.post('/api/products', (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (
    !name || !description || typeof price !== 'number' ||
    !category || typeof inStock !== 'boolean'
  ) {
    throw new ValidationError('Invalid product data');
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// utils/asyncHandler.js

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;

const asyncHandler = require('./utils/asyncHandler');

app.get('/api/products', asyncHandler(async (req, res) => {
  res.json(products);
}));

// Task 5: Advanced Features

app.get('/api/products', asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  let filtered = products;

  // Filter by category
  if (category) {
    filtered = filtered.filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Pagination
  const start = (parseInt(page) - 1) * parseInt(limit);
  const end = start + parseInt(limit);
  const paginated = filtered.slice(start, end);

  res.json({
    total: filtered.length,
    page: parseInt(page),
    limit: parseInt(limit),
    products: paginated
  });
}));


const { page = 1, limit = 10 } = req.query;

app.get('/api/products/search', asyncHandler(async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Search term is required in query' });
  }

  const results = products.filter(product =>
    product.name.toLowerCase().includes(name.toLowerCase())
  );

  res.json({ results, total: results.length });
}));

app.get('/api/products/stats', asyncHandler(async (req, res) => {
  const stats = {};

  for (const product of products) {
    const cat = product.category.toLowerCase();
    stats[cat] = (stats[cat] || 0) + 1;
  }

  res.json({ stats });
}));




