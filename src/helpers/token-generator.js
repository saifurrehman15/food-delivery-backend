import jwt from "jsonwebtoken";

export const tokenGenerator = (payload) => {
  const accessToken = jwt.sign(payload, process.env.AUTH_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(payload, process.env.AUTH_SECRET, {
    expiresIn: "1d",
  });

  return { accessToken, refreshToken };
};
