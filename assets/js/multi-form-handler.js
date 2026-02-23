/**
 * Form Handler for Index and About Pages
 */

class MultiFormHandler {
  constructor() {
    this.submissionStates = new Map();
    this.init();
  }

  init() {
    this.setupIndexForm();
    this.setupAboutForm();
  }

  setupIndexForm() {
    const form = document.getElementById("indexContactForm");
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formId = "index-contact-form";
      if (this.isSubmitting(formId)) return;

      this.setSubmitting(formId, true);
      this.updateButtonState(submitBtn, true, "Sending...");

      try {
        const formData = {
          name: document.getElementById("indexName").value.trim(),
          email: document.getElementById("indexEmail").value.trim(),
          phone: document.getElementById("indexPhone").value.trim(),
          subject: document.getElementById("indexSubject").value.trim(),
          message: document.getElementById("indexMessage").value.trim(),
        };

        if (!this.validateForm(formData)) {
          this.resetSubmission(formId, submitBtn, "Send Message");
          return;
        }

        const response = await this.submitForm(formData);

        if (response.ok) {
          this.showSuccess(
            "Your message has been sent successfully! We will get back to you soon.",
          );
          form.reset();
        } else {
          const errorData = await response.json();
          this.showError(
            errorData.message || "Failed to send message. Please try again.",
          );
        }
      } catch (error) {
        console.error("Form error:", error);
        this.showError(
          "Network error. Please check your connection and try again.",
        );
      } finally {
        this.resetSubmission(formId, submitBtn, "Send Message");
      }
    });
  }

  setupAboutForm() {
    const form = document.getElementById("aboutContactForm");
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formId = "about-contact-form";
      if (this.isSubmitting(formId)) return;

      this.setSubmitting(formId, true);
      this.updateButtonState(submitBtn, true, "Submitting...");

      try {
        const formData = {
          name: document.getElementById("aboutName").value.trim(),
          email: document.getElementById("aboutEmail").value.trim(),
          phone: document.getElementById("aboutPhone").value.trim(),
          subject: document.getElementById("aboutSubject").value.trim(),
          message: document.getElementById("aboutMessage").value.trim(),
        };

        if (!this.validateForm(formData)) {
          this.resetSubmission(formId, submitBtn, "Submit Message");
          return;
        }

        const response = await this.submitForm(formData);

        if (response.ok) {
          this.showSuccess(
            "Your quote request has been submitted successfully! We will contact you soon.",
          );
          form.reset();
        } else {
          const errorData = await response.json();
          this.showError(
            errorData.message || "Failed to submit request. Please try again.",
          );
        }
      } catch (error) {
        console.error("Form error:", error);
        this.showError(
          "Network error. Please check your connection and try again.",
        );
      } finally {
        this.resetSubmission(formId, submitBtn, "Submit Message");
      }
    });
  }

  async submitForm(data) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_CONFIG.API_BASE}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  validateForm(data) {
    const { name, email, phone, subject, message } = data;

    if (!name || !email || !phone || !subject || !message) {
      this.showError("Please fill all required fields");
      return false;
    }

    if (!this.isValidEmail(email)) {
      this.showError("Please enter a valid email address");
      return false;
    }

    if (!this.isValidPhone(phone)) {
      this.showError("Please enter a valid 10-digit phone number");
      return false;
    }

    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  }

  isSubmitting(formId) {
    return this.submissionStates.get(formId) === true;
  }

  setSubmitting(formId, state) {
    this.submissionStates.set(formId, state);
  }

  updateButtonState(button, disabled, text) {
    if (button) {
      button.disabled = disabled;
      button.textContent = text;
    }
  }

  resetSubmission(formId, button, originalText) {
    this.setSubmitting(formId, false);
    this.updateButtonState(button, false, originalText);
  }

  showSuccess(message) {
    this.showNotification(message, "success");
  }

  showError(message) {
    this.showNotification(message, "error");
  }

  showNotification(message, type = "info") {
    document.querySelectorAll(".form-notification").forEach((n) => n.remove());

    const notification = document.createElement("div");
    notification.className = `alert alert-${type === "error" ? "danger" : "success"} alert-dismissible fade show form-notification`;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            max-width: 500px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

    notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new MultiFormHandler();
});
