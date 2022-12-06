module.exports = {
  apps: [{
    name: "jxweb-api",
    script: "npm run start:prod",
    env_production: {
      NODE_ENV: "production",
    }
  }]
}