/**
 * JobNest - Demo Authentication Module
 * Manages user authentication, role checks, and protected routes using localStorage.
 * 
 * NOTE: This is a front-end demo application. Real production systems require
 * secure server-side authentication, HTTPS, hashed passwords, and JWT / httpOnly cookies.
 */

const Auth = {
  /**
   * Get currently authenticated session user
   */
  getCurrentUser() {
    return Storage.getSession();
  },

  /**
   * Check if any user is currently logged in
   */
  isLoggedIn() {
    return Boolean(this.getCurrentUser());
  },

  /**
   * Check if current user has the 'seeker' role
   */
  isSeeker() {
    const user = this.getCurrentUser();
    return Boolean(user && user.role === "seeker");
  },

  /**
   * Check if current user has the 'employer' role
   */
  isEmployer() {
    const user = this.getCurrentUser();
    return Boolean(user && user.role === "employer");
  },

  /**
   * Attempt demo login
   */
  login(email, password, remember = false) {
    if (!email || !password) {
      return { success: false, message: "Please enter both email and password." };
    }

    const user = Storage.getUserByEmail(email);
    if (!user) {
      return { success: false, message: "No account found with this email address." };
    }

    if (user.password !== password) {
      return { success: false, message: "Invalid password. (For demo, default password is password123)" };
    }

    // Set demo session (omitting raw password from stored session object)
    const sessionUser = { ...user };
    delete sessionUser.password;
    sessionUser.sessionStartedAt = new Date().toISOString();
    sessionUser.remember = Boolean(remember);

    Storage.setSession(sessionUser);

    return {
      success: true,
      user: sessionUser,
      message: `Welcome back, ${sessionUser.name}!`
    };
  },

  /**
   * Register a new user
   */
  register(userData) {
    const { name, email, password, role, phone } = userData;

    if (!name || !email || !password || !role) {
      return { success: false, message: "Please fill in all required fields." };
    }

    // Check if email already registered in demo data
    const existing = Storage.getUserByEmail(email);
    if (existing) {
      return {
        success: false,
        message: "An account with this email address already exists. Please login instead."
      };
    }

    const newUser = Storage.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: role, // 'seeker' or 'employer'
      phone: phone ? phone.trim() : "",
      title: role === "seeker" ? "Job Seeker" : "Hiring Manager",
      companyName: userData.companyName || (role === "employer" ? "My Company" : ""),
      companyId: userData.companyId || (role === "employer" ? "comp-1" : null),
      location: userData.location || "India",
      bio: role === "seeker" ? "Enthusiastic candidate ready for new opportunities." : "Leading hiring initiatives.",
      skills: role === "seeker" ? ["Communication", "Problem Solving"] : [],
      experience: [],
      education: [],
      resume: null
    });

    // Auto login new registered user
    const sessionUser = { ...newUser };
    delete sessionUser.password;
    Storage.setSession(sessionUser);

    return {
      success: true,
      user: sessionUser,
      message: "Registration successful! You are now logged in."
    };
  },

  /**
   * Log out current user
   */
  logout() {
    Storage.clearSession();
    window.location.href = "login.html?logged_out=1";
  },

  /**
   * Guard for protected pages (e.g. dashboards)
   * @param {string} requiredRole - 'seeker' | 'employer' | 'any'
   * @param {string} redirectUrl - where to redirect if unauthorized
   */
  requireAuth(requiredRole = "any", redirectUrl = "login.html") {
    const user = this.getCurrentUser();
    if (!user) {
      const returnUrl = encodeURIComponent(window.location.pathname.split("/").pop() + window.location.search);
      window.location.href = `${redirectUrl}?returnUrl=${returnUrl}&auth_required=1`;
      return false;
    }

    if (requiredRole !== "any" && user.role !== requiredRole) {
      // User is logged in but has wrong role
      if (user.role === "employer") {
        window.location.href = "employer-dashboard.html?denied=1";
      } else {
        window.location.href = "seeker-dashboard.html?denied=1";
      }
      return false;
    }

    return true;
  }
};
