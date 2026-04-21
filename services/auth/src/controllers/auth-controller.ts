import User from "../model/users";
import jwt from "jsonwebtoken";
import TryCatch from "../middlewares/trycatch";
import { AuthenticatedRequest } from "../middlewares/isAuth";
import { oauth2client } from "../config/google-auth";
import axios from "axios";

export const loginUser = TryCatch(async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: "Authorised code is required" });
  }
  const googleRes = await oauth2client.getToken(code);
  oauth2client.setCredentials(googleRes.tokens);
  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
  );

  const { email, name, picture } = userRes.data;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      image: picture,
    });
  }

  const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
    expiresIn: "15d",
  });

  res.status(200).json({ message: "Logged Success", token, user });
});

const allowRoles = ["customer", "rider", "seller"] as const;

type Role = (typeof allowRoles)[number];

export const addUserRole = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (!req.user?._id) {
    return res.status(400).json({ message: "Unauthorised" });
  }

  const { role } = req.body as { role: Role };

  if (!allowRoles.includes(role)) {
    return res.status(400).json({
      message: "Invalid role",
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { role },
    { new: true },
  );

  console.log("jwt user:", req.user);

  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }
  const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
    expiresIn: "15d",
  });
  res.status(200).json({ token, user });
});

export const myProfile = TryCatch(async (req, res) => {
  res.json(req.user);
});
