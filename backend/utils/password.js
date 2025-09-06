import bcrypt from "bcrypt"

function validatePassword(password) {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&]/.test(password);

  if (password.length < minLength)
    return {
      success: false,
      message: "Password must be at least 8 characters",
    };
  if (!hasUpper)
    return {
      success: false,
      message: "Password must contain an uppercase letter",
    };
  if (!hasLower)
    return {
      success: false,
      message: "Password must contain a lowercase letter",
    };
  if (!hasNumber)
    return { success: false, message: "Password must contain a number" };
  if (!hasSpecial)
    return {
      success: false,
      message: "Password must contain a special character",
    };

  return { success: true };
}

async function verifyPassword(password, hash){
  const isPasswordVerified = await bcrypt.compare(password, hash)
  return isPasswordVerified;
}

async function hashPassword(password){
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

export {validatePassword, verifyPassword, hashPassword};
