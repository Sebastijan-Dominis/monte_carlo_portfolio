export const validateCredentials = (email: string, password: string) => {
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }
  if (!password || password.length < 8 || password.length > 20) {
    alert("Password has to be between 8 and 20 characters.");
    return false;
  }
  return true;
};
