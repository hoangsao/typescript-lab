import jsonServer from 'json-server'
import projectsDB from './projects/api/db.json' with { type: 'json' }
import socialNetworksDB from './socialNetworks/db.json' with { type: 'json' }

const server = jsonServer.create();
const dbData = { ...projectsDB, ...socialNetworksDB }
const router = jsonServer.router(dbData);
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Have all URLS prefixed with a /api
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  })
);

server.use(router);
server.listen(5101, () => {
  console.log("JSON Server is running on port 5101");
  console.log('http://localhost:5101/api');
  Object.keys(dbData).forEach(key => console.log(`http://localhost:5101/api/${key}`));
});