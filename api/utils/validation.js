const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@belgiumcampus\.ac\.za$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
  // Minimum 6 chars, at least 1 number and 1 letter
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return re.test(password);
};

module.exports = {
  validateEmail,
  validatePassword
};
