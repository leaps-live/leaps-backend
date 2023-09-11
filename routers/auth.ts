import { Router } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
  UserData,
} from "amazon-cognito-identity-js";
import env from "../lib/env";
import { verifyMiddleware } from "../middleware/auth";

const verifier = CognitoJwtVerifier.create({
  userPoolId: env.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: env.COGNITO_CLIENT_ID,
});

const UserPool = new CognitoUserPool({
  UserPoolId: env.COGNITO_USER_POOL_ID,
  ClientId: env.COGNITO_CLIENT_ID,
});

const extractUserInfo = (data: UserData) => {
  return {
    username: data.Username,
    email: data.UserAttributes.find((attr) => attr.Name === "email")?.Value,
    firstName: data.UserAttributes.find((attr) => attr.Name === "given_name")
      ?.Value,
    lastName: data.UserAttributes.find((attr) => attr.Name === "family_name")
      ?.Value,
  };
};

const router = Router();

router.post("/verify", verifyMiddleware, async (req, res) => {
  res.json(req.user);
});

export default router;
