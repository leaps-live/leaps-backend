require("dotenv").config();

export default {
  PORT: parseInt(process.env.PORT || "8080"),
  COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID || "",
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID || "",
}