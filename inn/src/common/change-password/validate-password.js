export default function ValidatePassword(enterPassword) {
  let userRegData = {};
  if (enterPassword) {
    userRegData.password = enterPassword;
  }
  let re;
  if (userRegData.password) {
    if (userRegData.password.length < 8) {
      return 'Password should be min 8 characters long with one special character, number and upper case letter.';
    }
    if (userRegData.password.length > 20) {
      return 'Password should be min 8 characters long with one special character, number and upper case letter.';
    }
    re = /[0-9]/;
    if (!re.test(userRegData.password)) {
      return 'Password should be min 8 characters long with one special character, number and upper case letter.';
    }
    re = /[A-Z]/;
    if (!re.test(userRegData.password)) {
      return 'Password should be min 8 characters long with one special character, number and upper case letter.';
    }
    re = /[!@#$%^&*]/;
    if (!re.test(userRegData.password)) {
      return 'Password should be min 8 characters long with one special character, number and upper case letter.';
    }
  } else {
    return 'Please enter your password';
  }
  return;
}
