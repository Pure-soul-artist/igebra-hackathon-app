module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '200mb', // Increase the limit for API routes
    },
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb', // Increase the limit for Server Actions
    },
  },
};