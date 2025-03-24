// npm install json-server@0.17.4 jsonwebtoken cookie-parser
import jwt from 'jsonwebtoken';
import jsonServer from 'json-server';
import cookieParser from 'cookie-parser';
import carts from './dummyjson/carts.json' with { type: 'json' }
import comments from './dummyjson/comments.json' with { type: 'json' }
import posts from './dummyjson/posts.json' with { type: 'json' }
import products from './dummyjson/products.json' with { type: 'json' }
import quotes from './dummyjson/quotes.json' with { type: 'json' }
import recipes from './dummyjson/recipes.json' with { type: 'json' }
import todos from './dummyjson/todos.json' with { type: 'json' }
import users from './dummyjson/users.json' with { type: 'json' }
import projects from './projects/api/db.json' with { type: 'json' }

const database = {
  carts,
  comments,
  posts,
  products,
  quotes,
  recipes,
  todos,
  users,
  projects
};

const server = jsonServer.create();
const router = jsonServer.router(database);
const middlewares = jsonServer.defaults();

const SECRET_KEY = 'mhhebyjy_*dd7=0w0qa_vx7a2%8+6d40n=7d(tbp#6nuuudse*';

// Apply default middlewares
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Apply cookie-parser middleware at the top
server.use(cookieParser());

// Add CORS support (if needed for cross-origin requests)
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins (adjust for production)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

function getExpiresInMins(expiresInMins) {
  if (typeof expiresInMins === 'number') {
    return expiresInMins;
  } else {
    return 60;
  }
}

function getRequestAccessToken(req) {
  if (!req) {
    return null;
  }
  return req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
}

// 2. Authentication middleware for protected routes
const authMiddleware = (req, res, next) => {
  // Skip authentication for auth endpoints that don't require a token
  if (req.path.startsWith('/api/auth/login') ||
      req.path.startsWith('/api/auth/logout')) {
    return next();
  }

  // Check for authorization header or cookie
  const token = getRequestAccessToken(req);
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Verify token and attach user info to request
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply authentication middleware before defining routes
server.use(authMiddleware);

// 1. Auth API with updated routes
// Login endpoint
server.post('/api/auth/login', (req, res) => {
  const { username, password, expiresInMins } = req.body;

  // Find user in our sample list
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const expiresIn = getExpiresInMins(expiresInMins);
  // Generate JWT token
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: `${expiresIn}m` });

  // Set token in cookie
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: expiresIn * 60 * 1000,
    path: '/'
  });
  res.json({ accessToken: token });
});

// Logout endpoint
server.post('/api/auth/logout', (req, res) => {
  res.cookie('accessToken', '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
  });
  res.json({ message: 'Logged out successfully' });
});

// Token refresh endpoint
server.post('/api/auth/refresh', (req, res) => {
  const { expiresInMins } = req.body;
  const token = getRequestAccessToken(req);

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const expiresIn = getExpiresInMins(expiresInMins);
    const decoded = jwt.verify(token, SECRET_KEY);
    const newToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      SECRET_KEY,
      { expiresIn: `${expiresIn}m` }
    );

    res.cookie('accessToken', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn * 60 * 1000,
      path: '/'
    });
    res.json({ accessToken: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Me endpoint (now after authMiddleware)
server.get('/api/auth/me', (req, res) => {
  const user = users.find(u => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Update router with data
router.db._.db = database;
server.use('/api', router);

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}/api`);
  Object.keys(database).forEach(key => console.log(`http://localhost:${PORT}/api/${key}`));
});