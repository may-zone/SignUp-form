const form = document.getElementById('signup-form');
const container = document.querySelector('.container');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-password');

const patterns = {
  name: /^[a-zA-Z\s'-]{2,50}$/,
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
};

const getErrorElement = (input) =>
  input.closest('.field')?.querySelector('.error');

function showError(input, message) {
  const errorEl = getErrorElement(input);
  if (errorEl) errorEl.textContent = message;
  input.setCustomValidity(message);
}

function clearError(input) {
  const errorEl = getErrorElement(input);
  if (errorEl) errorEl.textContent = '';
  input.setCustomValidity('');
}

function validateName() {
  const value = nameInput.value.trim();
  if (!value) {
    showError(nameInput, 'Name is required.');
    return false;
  }
  if (!patterns.name.test(value)) {
    showError(nameInput, 'Use 2-50 letters, spaces, apostrophes, or hyphens.');
    return false;
  }
  clearError(nameInput);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  if (!value) {
    showError(emailInput, 'Email is required.');
    return false;
  }
  if (!patterns.email.test(value)) {
    showError(emailInput, 'Enter a valid email address.');
    return false;
  }
  clearError(emailInput);
  return true;
}

function validatePassword() {
  const value = passwordInput.value;
  if (!value) {
    showError(passwordInput, 'Password is required.');
    return false;
  }
  if (!patterns.password.test(value)) {
    showError(
      passwordInput,
      'Use 8+ chars with upper, lower, number, and symbol.'
    );
    return false;
  }
  clearError(passwordInput);
  return true;
}

function validateConfirmation() {
  const value = confirmInput.value;
  if (!value) {
    showError(confirmInput, 'Please retype your password.');
    return false;
  }
  if (value !== passwordInput.value) {
    showError(confirmInput, 'Passwords do not match.');
    return false;
  }
  clearError(confirmInput);
  return true;
}

function validateField(event) {
  const target = event.target;
  switch (target) {
    case nameInput:
      validateName();
      break;
    case emailInput:
      validateEmail();
      break;
    case passwordInput:
      validatePassword();
      validateConfirmation();
      break;
    case confirmInput:
      validateConfirmation();
      break;
    default:
      break;
  }
}

function validateForm() {
  const validators = [
    validateName(),
    validateEmail(),
    validatePassword(),
    validateConfirmation()
  ];
  return validators.every(Boolean);
}

[nameInput, emailInput, passwordInput, confirmInput].forEach((input) => {
  input.addEventListener('input', validateField);
  input.addEventListener('blur', validateField);
});

form.addEventListener('submit', (event) => {
  const isValid = validateForm();
  if (!isValid) {
    event.preventDefault();
    const firstInvalid = form.querySelector('input:invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  event.preventDefault();

  // play swap animation then submit
  if (!container.classList.contains('swap-animate')) {
    container.classList.remove('swapped');
    container.classList.add('swap-animate');

    const handleAnimationEnd = () => {
      container.classList.remove('swap-animate');
      container.classList.add('swapped');
      container.removeEventListener('animationend', handleAnimationEnd, true);
      setTimeout(() => form.submit(), 200);
    };

    container.addEventListener('animationend', handleAnimationEnd, true);
  } else {
    form.submit();
  }
});
