const invalidUserInputLength = (field, size) => {
  if (!field) return true;
  return field.length < size;
}


const validateNewUserInputs = (payload) => {
  let areAllInputsValid = true;
  let invalidUsername = false;
  let invalidPassword = false;
  let invalidEmail = false;

  if (invalidUserInputLength(payload.username, 6)) {
    invalidUsername = true;
    areAllInputsValid = false;
  }

  if (invalidUserInputLength(payload.password, 10)) {
    invalidPassword = true;
    areAllInputsValid = false;
  }

  if (invalidUserInputLength(payload.email, 6)) {
    invalidEmail = true;
    areAllInputsValid = false;
  }

  return {
    areAllInputsValid: areAllInputsValid,
    invalidUsername: invalidUsername,
    invalidPassword: invalidPassword,
    invalidEmail: invalidEmail
  };
}


const validateSecretInputs = (payload) => {
  let areAllInputsValid = true;
  let invalidSecretLabel = false;
  let invalidSecret = false;

  if (payload.secretLabel.length === 0) {
    invalidSecretLabel = true;
    areAllInputsValid = false;
  }

  if (payload.secret.length === 0) {
    invalidSecret = true;
    areAllInputsValid = false;
  }

  return {
    areAllInputsValid: areAllInputsValid,
    invalidSecretLabel: invalidSecretLabel,
    invalidSecret: invalidSecret
  };
}


export { 
  validateNewUserInputs,
  validateSecretInputs
};