require('dotenv/config');

module.exports = {
  dialect: process.env.DB_DIALECT || "mysql",
  host: process.env.DB_HOST || "127.0.0.1",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "splitwise",
  logging: process.env.DB_LOGGING === "true" ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
};

