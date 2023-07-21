const handlers = require('../functions/handlers.js')
const http     = require('http').Server(handlers.app);
const PORT     = process.env['PORT'] || 7744;

handlers.app.use(handlers.express.static('public'));

http.listen(PORT, () => {
  console.log(`Running at localhost:${PORT}`);
});