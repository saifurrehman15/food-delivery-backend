import jwt from "jsonwebtoken";

export const tokenGenerator = (payload) => {
  const accessToken = jwt.sign(payload, process.env.AUTH_SECRET, {
    expiresIn: "2h",
  });

  const refreshToken = jwt.sign(payload, process.env.AUTH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
