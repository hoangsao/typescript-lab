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

const ACCESS_TOKEN_SECRET = 'ef5e063095c018eb59b701a02a520dd8a5a4ba7843aca2b6e45f204e41d1d635c77ffb7b19702721e49206f8890ff476a17f121958d49b4a7c888dee97995cd8ab63cecb2b898bef487782c7bdbab98bacbc190b838add1ed9bbde39bcf2a515df31af5c1b1b7b455db2a4f3b4d4673d8232151ce5ee14e2bb235b4a39cb1d1c';
const REFRESH_TOKEN_SECRET = '207114e00739c418b0de7c6f065fd60328d518b6c041a6f89505c63c2d922a662b5d4954c6d614bd2a4ba2acb07ae54b7218cf60209d24f67e88334668db1a973215ba2512fe0875acd84dc6dd0f8aa511bf313edaaca412e5f32cee8a4451e72ea2a5fa4d13db6958a08c2f566f95102e07329d725007ab4813480ca7722991';
const accessTokenExpiresInMins = 30
const refreshTokenExpiresInMins = 7200
let refreshTokens = [];

function generateAccessToken (user) {
  return jwt.sign({ id: user.id, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: `${accessTokenExpiresInMins}m` });
}

function generateRefreshToken (user) {
  return jwt.sign({ id: user.id, username: user.username }, REFRESH_TOKEN_SECRET, { expiresIn: `${refreshTokenExpiresInMins}m` });
}

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

function getRequestAccessToken (req) {
  if (!req) {
    return null;
  }
  return req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
}

function getRequestRefreshToken (req) {
  if (!req) {
    return null;
  }
  return req.cookies?.refreshToken || req.headers.authorization?.split(' ')[1];
}

// Function to handle refresh token verification and renewal
function checkRefreshToken (req, res) {
  // Retrieve refresh token from cookie or request body
  const refreshToken = req.cookies['refreshToken'] || req.body.refreshToken;

  // If no refresh token is provided, return an error
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token found' });
  }

  // Check if the refresh token exists in the simulated database
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  // Verify the refresh token
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Refresh token is invalid or expired' });
    }

    // Generate new access and refresh tokens
    const user = { id: decoded.id, username: decoded.username };
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Remove old refresh token and add the new one to the list
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    refreshTokens.push(newRefreshToken);

    // Set new tokens in cookies
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      maxAge: accessTokenExpiresInMins * 60 * 1000, // 15 minutes
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: refreshTokenExpiresInMins * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production',
    });

    // Return new tokens in the response body
    res.json({
      message: 'Tokens refreshed successfully',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: { id: user.id, username: user.username },
    });
  });
}

// 2. Authentication middleware for protected routes
const authMiddleware = (req, res, next) => {
  // Skip authentication for auth endpoints that don't require a token
  if (req.path.startsWith('/api/auth/login') ||
    req.path.startsWith('/api/auth/logout') ||
    req.path.startsWith('/api/auth/check')) {
    return next();
  }

  // Check for authorization header or cookie
  const token = getRequestAccessToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Verify token and attach user info to request
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
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
  const { username, password } = req.body;

  // Find user in our sample list
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  refreshTokens.push(refreshToken);

  // Set token in cookie
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: accessTokenExpiresInMins * 60 * 1000,
    path: '/'
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: refreshTokenExpiresInMins * 60 * 1000,
    path: '/'
  });

  res.json({ accessToken, refreshToken });
});

// Logout endpoint
server.post('/api/auth/logout', (req, res) => {
  res.cookie('accessToken', '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
  });

  res.cookie('refreshToken', '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
  });

  res.json({ message: 'Logged out successfully' });
});

// Token refresh endpoint
server.post('/api/auth/refresh', (req, res) => {
  const token = getRequestRefreshToken(req);

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const user = { id: decoded.id, username: decoded.username }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set token in cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: accessTokenExpiresInMins * 60 * 1000,
      path: '/'
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: refreshTokenExpiresInMins * 60 * 1000,
      path: '/'
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Endpoint to check token validity
server.post('/api/auth/check', (req, res) => {
  // Retrieve access token from cookie or Authorization header
  let accessToken = req.cookies['accessToken'] || req.headers['authorization']?.slice(7);

  // If no access token is found, proceed to check refresh token
  if (!accessToken) {
    return checkRefreshToken(req, res);
  }

  // Verify the access token
  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // If access token is invalid or expired, check refresh token
      return checkRefreshToken(req, res);
    }
    // Access token is valid, return user info
    res.json({
      message: 'Access token is valid',
      user: { id: decoded.id, username: decoded.username },
    });
  });
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