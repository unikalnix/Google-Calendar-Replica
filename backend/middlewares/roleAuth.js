async function roleAuth(req, res, next) {
  const payload = req.user;
  const { loginUserId, loginUserEmail } = payload;
}

export default roleAuth;
