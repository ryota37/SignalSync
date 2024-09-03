# About

- This is a WebSocket demo application to test its behavior.

# How to boot (a little complicated)

- Execute `node server.js`
  - Port No. 8090
  - `const socket = new WebSocket('ws://{localIP}:8090');` in `index.html` should be overwritten by the actual IP address
- Execute `live-server`
  - Defalut Port No. is 8080
  - You can specify the port No. by the `--port {No.}` option but fails when you use the port No. except for 8080. (I'm not sure why)
