export const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@mju\.ac\.kr$/;
// export const numberRegex = /^\d+$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const isValidPassword = (password) => {
  return passwordRegex.test(password);
};
