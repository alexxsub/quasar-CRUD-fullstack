// web server to start SPA from building folder
const path = require('path')
const
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  port = process.env.WEB_PORT || 5000

const app = express()

app.use(history())
app.use(serveStatic(path.join(__dirname, '../dist/spa')))
app.listen(port)
