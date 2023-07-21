# Fishing Site

An express backend that serves a React frontend app

To run the site:

`npm run start`

`TODO(dustmop): try deploying to netlify instead?`

## NPM Scripts

`npm run start`

Runs the react frontend and the express backend. Proxy requests from the backend to the frontend. Allows live development on both. Default port is 7744 (hits express backend, and proxies frontend requests to 3000).

`npm run backend`

Serve the express backend only. Default port 7744.

`npm run emulate-firebase`

Run the firebase emulator. Default port 5000.

`npm run frontend`

Serve the react frontend only. Default port 5000.

`npm run frontend-build`

Create a static build of the react frontend.

`npm run copy-static-react`

Copies the results of the frontend-build command into the firebase asset folder so that the express server can serve this static build of the react app.

`npm run exec`

Build the react frontend, copy it to the asset directly, then run the firebase emulator.

## Live Site

https://fishing-site-da919.web.app/
