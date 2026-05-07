/**
 * server.js - Entry point for cPanel Node.js Selector
 * 
 * This file is required to run Next.js standalone build on cPanel.
 * 
 * Setup Instructions:
 * 1. Run `npm run build` locally to create .next/standalone
 * 2. Upload the `.next` folder and `public` folder to your cPanel
 * 3. In cPanel Node.js Selector, set the "App URL" to point to this file
 * 4. Set "App JS File" to: server.js
 * 5. Set the "Startup File" to: server.js
 * 6. Ensure PORT environment variable is set (cPanel will do this automatically)
 */

const http = require('http')
const path = require('path')

// Load environment variables from .env files
require('dotenv').config({ path: path.join(__dirname, '.env.local') })
require('dotenv').config({ path: path.join(__dirname, '.env') })

// Get port from environment
const port = parseInt(process.env.PORT || '3000', 10)
const host = process.env.HOSTNAME || '0.0.0.0'

// Import the Next.js server
const app = require('./.next/standalone/server.js')

// Create HTTP server
const server = http.createServer(app)

// Start server
server.listen(port, host, () => {
  console.log(`✅ Server started on ${host}:${port}`)
  console.log(`📌 Environment: ${process.env.NODE_ENV || 'production'}`)
  console.log(`🔗 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})
