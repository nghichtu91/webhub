module.exports = {
  apps: [{
    name: "jxweb-api",
    script: "dist/src/main",
    env_production: {
      NODE_ENV: "production",
    }
  }]
}