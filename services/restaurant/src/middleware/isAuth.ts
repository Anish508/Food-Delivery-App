import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  restaurantId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Unauthorized - No token provided",
      });
      return;
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        message: "Unauthorized - Token missing",
      });
      return;
    }

    // 3. Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SEC as string,
    ) as JwtPayload;

    // 4. Validate payload
    if (!decoded || !decoded.user) {
      res.status(401).json({
        message: "Unauthorized - Invalid token",
      });
      return;
    }

    // 6. Attach user to request
    req.user = decoded.user;

    // 7. Continue
    next();
  } catch (error: any) {
    // Handle JWT specific errors
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        message: "Token expired",
      });
      return;
    }

    if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        message: "Invalid token",
      });
      return;
    }

    // Generic error
    res.status(500).json({
      message: "Authentication failed",
    });
  }
};

export const isSeller = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  if (user && user.role !== "seller") {
    res.status(401).json({
      message: "You are not authorised seller",
    });
    return;
  }
  next();
};
