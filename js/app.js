/**
 * JobNest - Global Application Controller
 * Handles header dynamic auth state, mobile navigation, toast alerts,
 * Lucide icons bootstrap, and shared utilities.
 */

const App = {
  init() {
    this.renderHeaderAuthState();
    this.initMobileNav();
    this.highlightActiveNavLink();
    this.initIcons();
    this.initResetDataButtons();
    this.handleUrlToasts();
  },

  /**
   * Safe Lucide icon initializer
   */
  initIcons() {
    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons();
    }
  },

  /**
   * Render dynamic user navbar status (logged in vs logged out)
   */
  renderHeaderAuthState() {
    const authContainer = document.getElementById("nav-auth-container");
    const mobileAuthContainer = document.getElementById("mobile-nav-auth-container");
    const user = Auth.getCurrentUser();

    if (!authContainer && !mobileAuthContainer) return;

    if (user) {
      const isEmployer = user.role === "employer";
      const dashboardLink = isEmployer ? "employer-dashboard.html" : "seeker-dashboard.html";
      const roleLabel = isEmployer ? "Employer" : "Job Seeker";
      const initials = (user.name || "User")
        .split(" ")
        .map(n => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      const userHtml = `
        <div class="user-menu-dropdown">
          <button class="user-profile-btn" id="userMenuToggle" aria-haspopup="true" aria-expanded="false" title="Account Menu">
            <span class="user-avatar-circle">${Validation.escapeHTML(initials)}</span>
            <span class="user-name-label">${Validation.escapeHTML(user.name.split(" ")[0])}</span>
            <i data-lucide="chevron-down" class="icon-sm"></i>
          </button>
          <div class="user-dropdown-menu" id="userDropdownMenu" role="menu">
            <div class="user-dropdown-header">
              <p class="dropdown-name">${Validation.escapeHTML(user.name)}</p>
              <p class="dropdown-email">${Validation.escapeHTML(user.email)}</p>
              <span class="role-badge role-${user.role}">${roleLabel}</span>
            </div>
            <div class="dropdown-divider"></div>
            <a href="${dashboardLink}" class="dropdown-item" role="menuitem">
              <i data-lucide="layout-dashboard" class="icon-sm"></i> Dashboard
            </a>
            ${isEmployer ? `
              <a href="post-job.html" class="dropdown-item" role="menuitem">
                <i data-lucide="plus-circle" class="icon-sm"></i> Post a Job
              </a>
            ` : `
              <a href="applications.html" class="dropdown-item" role="menuitem">
                <i data-lucide="file-check" class="icon-sm"></i> My Applications
              </a>
              <a href="saved-jobs.html" class="dropdown-item" role="menuitem">
                <i data-lucide="bookmark" class="icon-sm"></i> Saved Jobs
              </a>
            `}
            <div class="dropdown-divider"></div>
            <button class="dropdown-item logout-btn" id="headerLogoutBtn" role="menuitem">
              <i data-lucide="log-out" class="icon-sm"></i> Sign Out
            </button>
          </div>
        </div>
      `;

      if (authContainer) authContainer.innerHTML = userHtml;
      if (mobileAuthContainer) {
        mobileAuthContainer.innerHTML = `
          <div class="mobile-user-info">
            <div class="user-avatar-circle">${Validation.escapeHTML(initials)}</div>
            <div>
              <p class="font-bold">${Validation.escapeHTML(user.name)}</p>
              <p class="text-xs text-muted">${Validation.escapeHTML(user.email)}</p>
              <span class="role-badge role-${user.role}">${roleLabel}</span>
            </div>
          </div>
          <div class="mobile-user-links">
            <a href="${dashboardLink}" class="btn btn-outline btn-block mb-2">
              <i data-lucide="layout-dashboard" class="icon-sm mr-2"></i> Dashboard
            </a>
            ${isEmployer ? `
              <a href="post-job.html" class="btn btn-primary btn-block mb-2">
                <i data-lucide="plus-circle" class="icon-sm mr-2"></i> Post a Job
              </a>
            ` : `
              <a href="applications.html" class="btn btn-outline btn-block mb-2">
                <i data-lucide="file-check" class="icon-sm mr-2"></i> My Applications
              </a>
            `}
            <button class="btn btn-danger-outline btn-block" id="mobileLogoutBtn">
              <i data-lucide="log-out" class="icon-sm mr-2"></i> Sign Out
            </button>
          </div>
        `;
      }

      // Attach dropdown listeners
      const toggle = document.getElementById("userMenuToggle");
      const menu = document.getElementById("userDropdownMenu");
      if (toggle && menu) {
        toggle.addEventListener("click", (e) => {
          e.stopPropagation();
          const isOpen = menu.classList.toggle("show");
          toggle.setAttribute("aria-expanded", String(isOpen));
        });

        document.addEventListener("click", (e) => {
          if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove("show");
            toggle.setAttribute("aria-expanded", "false");
          }
        });
      }

      // Logout triggers
      const logoutBtn = document.getElementById("headerLogoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => Auth.logout());
      }
      const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
      if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener("click", () => Auth.logout());
      }

    } else {
      // Guest state
      const guestHtml = `
        <a href="login.html" class="btn btn-ghost">Log In</a>
        <a href="register.html" class="btn btn-primary">Register</a>
      `;
      if (authContainer) authContainer.innerHTML = guestHtml;
      if (mobileAuthContainer) {
        mobileAuthContainer.innerHTML = `
          <a href="login.html" class="btn btn-outline btn-block mb-2">Log In</a>
          <a href="register.html" class="btn btn-primary btn-block">Register</a>
        `;
      }
    }
  },

  /**
   * Mobile Hamburger Menu Drawer Toggle
   */
  initMobileNav() {
    const hamburgerBtn = document.getElementById("mobileMenuBtn");
    const mobileDrawer = document.getElementById("mobileNavDrawer");
    const overlay = document.getElementById("mobileNavOverlay");
    const closeBtn = document.getElementById("mobileNavCloseBtn");

    if (!hamburgerBtn || !mobileDrawer) return;

    const openMenu = () => {
      mobileDrawer.classList.add("open");
      if (overlay) overlay.classList.add("show");
      document.body.style.overflow = "hidden";
    };

    const closeMenu = () => {
      mobileDrawer.classList.remove("open");
      if (overlay) overlay.classList.remove("show");
      document.body.style.overflow = "";
    };

    hamburgerBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileDrawer.classList.contains("open")) {
        closeMenu();
      }
    });
  },

  /**
   * Highlight current active page link in navigation bars
   */
  highlightActiveNavLink() {
    let currentPage = window.location.pathname.split("/").pop() || "index.html";
    if (!currentPage.includes(".html")) currentPage = "index.html";

    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href && (href === currentPage || (currentPage === "index.html" && href === "./"))) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  },

  /**
   * Toast notification display
   */
  showToast(message, type = "info", duration = 3500) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      container.setAttribute("aria-live", "polite");
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type}`;

    let iconName = "info";
    if (type === "success") iconName = "check-circle";
    if (type === "warning") iconName = "alert-triangle";
    if (type === "error") iconName = "alert-circle";

    toast.innerHTML = `
      <i data-lucide="${iconName}" class="icon-sm"></i>
      <span class="toast-msg">${Validation.escapeHTML(message)}</span>
      <button class="toast-close-btn" aria-label="Close notification">&times;</button>
    `;

    container.appendChild(toast);
    this.initIcons();

    const closeToast = () => {
      toast.classList.add("toast-fade-out");
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 300);
    };

    const closeBtn = toast.querySelector(".toast-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", closeToast);

    setTimeout(closeToast, duration);
  },

  /**
   * Read URL parameters for notifications (e.g. ?registered=1, ?logged_out=1, ?auth_required=1)
   */
  handleUrlToasts() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("logged_out")) {
      this.showToast("You have been successfully signed out.", "info");
    } else if (params.get("auth_required")) {
      this.showToast("Please log in to access this page.", "warning");
    } else if (params.get("denied")) {
      this.showToast("Access restricted: Your account does not have permission for that section.", "error");
    }
  },

  /**
   * Bind Reset Demo Data buttons (in footer or developer actions)
   */
  initResetDataButtons() {
    const resetButtons = document.querySelectorAll(".btn-reset-demo-data");
    resetButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (confirm("Reset all jobs, companies, applications, and demo data to default? This will clear customized changes.")) {
          Storage.resetToDemoData();
          this.showToast("Demo data successfully restored to default settings!", "success");
          setTimeout(() => {
            window.location.reload();
          }, 800);
        }
      });
    });
  },

  /**
   * Currency formatter for INR
   */
  formatSalary(min, max, text) {
    if (text) return text;
    if (min && max) {
      return `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")} / yr`;
    }
    if (min) return `₹${min.toLocaleString("en-IN")} / yr`;
    return "Competitive Salary";
  },

  /**
   * Date relative string (e.g., '2 days ago', 'Today')
   */
  getTimeAgo(dateString) {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }
};

// Auto-run on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
