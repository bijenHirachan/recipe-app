export const sendToken = (message, user, res, statusCode = 200) => {
  const token = user.getJWTToken();

  const options = {
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  res.status(200).cookie("token", token, options).json({
    success: true,
    message,
    user,
  });
};
