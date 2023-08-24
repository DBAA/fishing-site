import {app,express} from '../functions/handlers.js';
import http from 'http'
const httpserver = http.Server(app);
const PORT     = process.env['PORT'] || 7744;

app.use(express.static('public'));

httpserver.listen(PORT, () => {
  console.log(`Running at localhost:${PORT}`);
});
