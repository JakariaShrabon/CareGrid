import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import swaggerUi from 'swagger-ui-express';
import { pool, initDB } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Initialize Database Table
initDB();

// ---------------------- SWAGGER DEFINITION ----------------------
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'CareGrid API Documentation',
    version: '1.0.0',
    description: 'CareGrid Healthcare Platform Backend REST API with Render PostgreSQL',
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Local Development Server',
    },
  ],
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check',
        responses: { 200: { description: 'Backend is running' } },
      },
    },
    '/api/users': {
      get: {
        summary: 'Get all registered users from PostgreSQL',
        responses: { 200: { description: 'List of all users' } },
      },
    },
    '/api/users/{id}': {
      delete: {
        summary: 'Delete a user by ID from PostgreSQL',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'User ID (e.g. usr_dy0d41)',
          },
        ],
        responses: {
          200: { description: 'User deleted successfully' },
          404: { description: 'User not found' },
        },
      },
    },
    '/api/auth/register': {
      post: {
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fullName: { type: 'string', example: 'Dr. John Doe' },
                  email: { type: 'string', example: 'john@caregrid.io' },
                  phone: { type: 'string', example: '+1 234-567-8900' },
                  role: { type: 'string', example: 'doctor' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User created successfully' },
          409: { description: 'Email already exists' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Log in an existing user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'jshrabon221093@bscse.uiu.ac.bd' },
                  password: { type: 'string', example: 'password123' },
                  remember: { type: 'boolean', example: true },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
  },
};

// Mount Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ---------------------- API ROUTES ----------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is connected and working!' });
});

// 2. View all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, phone, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. DELETE USER BY ID (From Swagger or Frontend)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, full_name, email',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('🗑️ Deleted user:', result.rows[0]);
    res.json({
      message: 'User deleted successfully',
      deletedUser: result.rows[0],
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Register route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, role, password } = req.body;

    const existing = await pool.query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        code: 'email_exists',
        message: 'An account with this email already exists. Try logging in instead.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = `usr_${Math.random().toString(36).slice(2, 8)}`;

    const result = await pool.query(
      `INSERT INTO users (id, full_name, email, phone, role, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, full_name, email, phone, role, created_at`,
      [userId, fullName.trim(), email.trim().toLowerCase(), phone?.trim() || '', role || 'doctor', passwordHash]
    );

    const savedUser = result.rows[0];
    const safeUser = {
      id: savedUser.id,
      fullName: savedUser.full_name,
      email: savedUser.email,
      phone: savedUser.phone,
      role: savedUser.role,
    };

    const issuedAt = new Date();
    const ttl = 30 * 24 * 60 * 60 * 1000;

    res.status(201).json({
      token: `jwt_${safeUser.id}_${Math.random().toString(36).slice(2, 10)}`,
      user: safeUser,
      issuedAt: issuedAt.toISOString(),
      expiresAt: new Date(issuedAt.getTime() + ttl).toISOString(),
      remember: true,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      code: 'service_unavailable',
      message: 'Server error during registration: ' + error.message,
    });
  }
});

// 5. Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        code: 'invalid_credentials',
        message: 'The email or password you entered is incorrect.',
      });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        code: 'invalid_credentials',
        message: 'The email or password you entered is incorrect.',
      });
    }

    const safeUser = {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const issuedAt = new Date();
    const ttl = remember ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

    res.json({
      token: `jwt_${safeUser.id}_${Math.random().toString(36).slice(2, 10)}`,
      user: safeUser,
      issuedAt: issuedAt.toISOString(),
      expiresAt: new Date(issuedAt.getTime() + ttl).toISOString(),
      remember: !!remember,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      code: 'service_unavailable',
      message: 'Server error during login: ' + error.message,
    });
  }
});

// 6. Forgot password
app.post('/api/auth/forgot-password', (req, res) => {
  res.json({ message: 'If that email exists, a reset link was sent.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📖 Swagger Docs at http://localhost:${PORT}/api-docs`);
});