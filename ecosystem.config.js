module.exports = {
  apps: [{
    name: "jxweb-api",
    script: "dist/src/main.js",
    watch : true,
    env_production: {
      NODE_ENV: "production",
    }
  }]
}