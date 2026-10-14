/**
 * JobNest - Form Validation & Utility Module
 * Provides robust validation logic, field error highlighters, and HTML sanitization.
 */

const Validation = {
  /**
   * Escape HTML to safely display user-generated text in the DOM
   */
  escapeHTML(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  /**
   * Validate Email format
   */
  isValidEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).trim());
  },

  /**
   * Validate Phone / Mobile format (10-15 digits, optional + prefix)
   */
  isValidPhone(phone) {
    if (!phone) return false;
    const cleaned = String(phone).replace(/[\s\-()]/g, "");
    const re = /^\+?[0-9]{10,15}$/;
    return re.test(cleaned);
  },

  /**
   * Validate Password length (minimum 6 characters for demo)
   */
  isValidPassword(password, minLength = 6) {
    return Boolean(password && String(password).length >= minLength);
  },

  /**
   * Show an error message for a specific form field
   */
  showError(inputElement, message) {
    if (!inputElement) return;
    inputElement.classList.add("input-error");
    
    // Find or create error element
    let errorContainer = inputElement.parentElement.querySelector(".field-error-msg");
    if (!errorContainer) {
      errorContainer = document.createElement("div");
      errorContainer.className = "field-error-msg";
      errorContainer.setAttribute("role", "alert");
      inputElement.parentElement.appendChild(errorContainer);
    }
    errorContainer.textContent = message;
    errorContainer.style.display = "block";
  },

  /**
   * Clear error message for a specific form field
   */
  clearError(inputElement) {
    if (!inputElement) return;
    inputElement.classList.remove("input-error");
    const errorContainer = inputElement.parentElement.querySelector(".field-error-msg");
    if (errorContainer) {
      errorContainer.textContent = "";
      errorContainer.style.display = "none";
    }
  },

  /**
   * Clear all errors within a form
   */
  clearAllErrors(formElement) {
    if (!formElement) return;
    const errorInputs = formElement.querySelectorAll(".input-error");
    errorInputs.forEach(input => input.classList.remove("input-error"));

    const errorContainers = formElement.querySelectorAll(".field-error-msg");
    errorContainers.forEach(container => {
      container.textContent = "";
      container.style.display = "none";
    });
  }
};
