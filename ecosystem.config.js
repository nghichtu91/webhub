module.exports = {
  apps: [{
    name: "jxweb-api",
    script: "yarn start:prod",
    env_production: {
      NODE_ENV: "production",
    }
  }]
}