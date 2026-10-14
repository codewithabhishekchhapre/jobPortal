/**
 * JobNest - Storage Management Module
 * Encapsulates localStorage access with fail-safes, default seeding, and clean CRUD operations.
 */

const STORAGE_KEYS = {
  JOBS: "jobnest_jobs",
  COMPANIES: "jobnest_companies",
  USERS: "jobnest_users",
  APPLICATIONS: "jobnest_applications",
  SAVED_JOBS: "jobnest_saved_jobs",
  CONTACT_MESSAGES: "jobnest_contact_messages",
  SESSION: "jobnest_session",
  SEEDED: "jobnest_seeded_v1"
};

const Storage = {
  /**
   * Safely retrieve and parse JSON from localStorage
   */
  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      if (data === null || data === undefined) return defaultValue;
      return JSON.parse(data);
    } catch (e) {
      console.warn(`[JobNest Storage] Failed to parse key: "${key}"`, e);
      return defaultValue;
    }
  },

  /**
   * Safely serialize and save JSON to localStorage
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`[JobNest Storage] Failed to set key: "${key}"`, e);
      return false;
    }
  },

  /**
   * Remove a specific key from localStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`[JobNest Storage] Failed to remove key: "${key}"`, e);
      return false;
    }
  },

  /**
   * Initialize localStorage with default seed data if not present
   */
  init() {
    const isSeeded = localStorage.getItem(STORAGE_KEYS.SEEDED);
    if (!isSeeded) {
      this.resetToDemoData();
    } else {
      // Ensure all critical arrays exist in case of partial corruption
      if (!Array.isArray(this.get(STORAGE_KEYS.JOBS))) this.set(STORAGE_KEYS.JOBS, INITIAL_JOBS);
      if (!Array.isArray(this.get(STORAGE_KEYS.COMPANIES))) this.set(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
      if (!Array.isArray(this.get(STORAGE_KEYS.USERS))) this.set(STORAGE_KEYS.USERS, INITIAL_USERS);
      if (!Array.isArray(this.get(STORAGE_KEYS.APPLICATIONS))) this.set(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
      if (!this.get(STORAGE_KEYS.SAVED_JOBS)) this.set(STORAGE_KEYS.SAVED_JOBS, { "seeker-1": INITIAL_SAVED_JOBS });
      if (!Array.isArray(this.get(STORAGE_KEYS.CONTACT_MESSAGES))) this.set(STORAGE_KEYS.CONTACT_MESSAGES, INITIAL_CONTACT_MESSAGES);
    }
  },

  /**
   * Reset all data back to the clean initial demo seed
   */
  resetToDemoData() {
    this.set(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    this.set(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
    this.set(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.set(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    this.set(STORAGE_KEYS.SAVED_JOBS, { "seeker-1": [...INITIAL_SAVED_JOBS] });
    this.set(STORAGE_KEYS.CONTACT_MESSAGES, INITIAL_CONTACT_MESSAGES);
    this.set(STORAGE_KEYS.SEEDED, "true");
    console.log("[JobNest Storage] Reset to default demo data completed.");
  },

  // ==========================================
  // JOBS API
  // ==========================================
  getJobs() {
    return this.get(STORAGE_KEYS.JOBS, []) || [];
  },

  getJobById(id) {
    const jobs = this.getJobs();
    return jobs.find(j => String(j.id) === String(id)) || null;
  },

  createJob(jobData) {
    const jobs = this.getJobs();
    const newJob = {
      ...jobData,
      id: "job-" + Date.now(),
      postedDate: new Date().toISOString().split("T")[0],
      featured: Boolean(jobData.featured)
    };
    jobs.unshift(newJob);
    this.set(STORAGE_KEYS.JOBS, jobs);
    return newJob;
  },

  updateJob(id, updatedFields) {
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => String(j.id) === String(id));
    if (index === -1) return null;

    jobs[index] = {
      ...jobs[index],
      ...updatedFields,
      id: jobs[index].id // preserve immutable ID
    };
    this.set(STORAGE_KEYS.JOBS, jobs);
    return jobs[index];
  },

  deleteJob(id) {
    let jobs = this.getJobs();
    jobs = jobs.filter(j => String(j.id) !== String(id));
    this.set(STORAGE_KEYS.JOBS, jobs);
    return true;
  },

  getJobsByEmployer(employerId) {
    const jobs = this.getJobs();
    return jobs.filter(j => String(j.employerId) === String(employerId));
  },

  getJobsByCompany(companyId) {
    const jobs = this.getJobs();
    return jobs.filter(j => String(j.companyId) === String(companyId));
  },

  // ==========================================
  // COMPANIES API
  // ==========================================
  getCompanies() {
    return this.get(STORAGE_KEYS.COMPANIES, []) || [];
  },

  getCompanyById(id) {
    const companies = this.getCompanies();
    return companies.find(c => String(c.id) === String(id)) || null;
  },

  getCompanyJobsCount(companyId) {
    const jobs = this.getJobs();
    return jobs.filter(j => String(j.companyId) === String(companyId)).length;
  },

  // ==========================================
  // APPLICATIONS API
  // ==========================================
  getApplications() {
    return this.get(STORAGE_KEYS.APPLICATIONS, []) || [];
  },

  getApplicationById(id) {
    const apps = this.getApplications();
    return apps.find(a => String(a.id) === String(id)) || null;
  },

  getApplicationsBySeeker(seekerId) {
    const apps = this.getApplications();
    return apps.filter(a => String(a.seekerId) === String(seekerId));
  },

  getApplicationsByEmployer(employerId) {
    const apps = this.getApplications();
    return apps.filter(a => String(a.employerId) === String(employerId));
  },

  getApplicationsByJob(jobId) {
    const apps = this.getApplications();
    return apps.filter(a => String(a.jobId) === String(jobId));
  },

  hasSeekerApplied(seekerId, jobId) {
    const apps = this.getApplications();
    return apps.some(a => String(a.seekerId) === String(seekerId) && String(a.jobId) === String(jobId));
  },

  createApplication(appData) {
    const apps = this.getApplications();
    const newApp = {
      ...appData,
      id: "app-" + Date.now(),
      appliedDate: new Date().toISOString().split("T")[0],
      status: appData.status || "Applied"
    };
    apps.unshift(newApp);
    this.set(STORAGE_KEYS.APPLICATIONS, apps);
    return newApp;
  },

  updateApplicationStatus(appId, newStatus) {
    const apps = this.getApplications();
    const index = apps.findIndex(a => String(a.id) === String(appId));
    if (index === -1) return null;

    apps[index].status = newStatus;
    apps[index].updatedDate = new Date().toISOString().split("T")[0];
    this.set(STORAGE_KEYS.APPLICATIONS, apps);
    return apps[index];
  },

  // ==========================================
  // SAVED JOBS API
  // ==========================================
  getSavedJobIds(seekerId) {
    const savedMap = this.get(STORAGE_KEYS.SAVED_JOBS, {}) || {};
    return savedMap[seekerId] || [];
  },

  isJobSaved(seekerId, jobId) {
    const list = this.getSavedJobIds(seekerId);
    return list.includes(String(jobId));
  },

  toggleSaveJob(seekerId, jobId) {
    const savedMap = this.get(STORAGE_KEYS.SAVED_JOBS, {}) || {};
    let list = savedMap[seekerId] || [];
    const jId = String(jobId);
    let isSavedNow = false;

    if (list.includes(jId)) {
      list = list.filter(id => id !== jId);
      isSavedNow = false;
    } else {
      list.push(jId);
      isSavedNow = true;
    }

    savedMap[seekerId] = list;
    this.set(STORAGE_KEYS.SAVED_JOBS, savedMap);
    return isSavedNow;
  },

  getSavedJobsList(seekerId) {
    const ids = this.getSavedJobIds(seekerId);
    const allJobs = this.getJobs();
    return allJobs.filter(j => ids.includes(String(j.id)));
  },

  // ==========================================
  // USERS & PROFILE API
  // ==========================================
  getUsers() {
    return this.get(STORAGE_KEYS.USERS, []) || [];
  },

  getUserById(id) {
    const users = this.getUsers();
    return users.find(u => String(u.id) === String(id)) || null;
  },

  getUserByEmail(email) {
    if (!email) return null;
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  },

  createUser(userData) {
    const users = this.getUsers();
    const newUser = {
      ...userData,
      id: (userData.role === "employer" ? "emp-" : "seeker-") + Date.now(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this.set(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  updateUserProfile(userId, updatedFields) {
    const users = this.getUsers();
    const index = users.findIndex(u => String(u.id) === String(userId));
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...updatedFields,
      id: users[index].id,
      role: users[index].role
    };
    this.set(STORAGE_KEYS.USERS, users);

    // Update active session if it matches the current user
    const session = this.getSession();
    if (session && String(session.id) === String(userId)) {
      this.setSession({
        ...session,
        ...users[index]
      });
    }

    return users[index];
  },

  // ==========================================
  // DEMO SESSION API
  // ==========================================
  getSession() {
    return this.get(STORAGE_KEYS.SESSION, null);
  },

  setSession(user) {
    return this.set(STORAGE_KEYS.SESSION, user);
  },

  clearSession() {
    return this.remove(STORAGE_KEYS.SESSION);
  },

  // ==========================================
  // CONTACT MESSAGES
  // ==========================================
  getContactMessages() {
    return this.get(STORAGE_KEYS.CONTACT_MESSAGES, []) || [];
  },

  saveContactMessage(msg) {
    const messages = this.getContactMessages();
    const newMsg = {
      ...msg,
      id: "msg-" + Date.now(),
      date: new Date().toISOString().split("T")[0]
    };
    messages.unshift(newMsg);
    this.set(STORAGE_KEYS.CONTACT_MESSAGES, messages);
    return newMsg;
  }
};

// Auto initialize on script load
Storage.init();
