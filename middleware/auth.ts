import { Request, Response, NextFunction } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import env from "../lib/env";

const verifier = CognitoJwtVerifier.create({
  userPoolId: env.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: env.COGNITO_CLIENT_ID,
});

export async function verifyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1] || null;
  if (token) {
    try {
      const payload = await verifier.verify(token);
      req.user = payload;
      next();
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  } else {
    res.status(401).json({ message: "No access token provided" });
  }
}
