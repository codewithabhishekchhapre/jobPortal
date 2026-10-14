/**
 * JobNest - Employer Dashboard Controller
 * Manages company metrics, job postings (create, edit, delete),
 * applicant review, and candidate application status transitions.
 */

const EmployerDashboard = {
  user: null,
  editingJobId: null,

  init() {
    if (!Auth.requireAuth("employer", "login.html")) return;
    this.user = Auth.getCurrentUser();

    this.renderUserInfo();
    this.bindTabNavigation();
    this.renderStats();
    this.renderEmployerJobs();
    this.renderApplicants();
    this.initPostJobForm();
    this.initEditJobModal();
    this.initCompanyProfileForm();
    this.checkUrlHashTab();
  },

  /**
   * Render employer header info and brand initials
   */
  renderUserInfo() {
    const u = this.user;
    const nameEls = document.querySelectorAll(".employer-name-display");
    const compEls = document.querySelectorAll(".employer-company-display");
    const emailEls = document.querySelectorAll(".employer-email-display");
    const avatarEls = document.querySelectorAll(".employer-avatar-display");

    const initials = (u.companyName || u.name || "Company")
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    nameEls.forEach(el => el.textContent = u.name);
    compEls.forEach(el => el.textContent = u.companyName || "Employer Portal");
    emailEls.forEach(el => el.textContent = u.email);
    avatarEls.forEach(el => el.textContent = initials);
  },

  /**
   * Tab Navigation (Overview, Manage Jobs, Post Job, Applicants, Company Profile)
   */
  bindTabNavigation() {
    const navItems = document.querySelectorAll(".dashboard-nav-item[data-tab]");
    navItems.forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const tabId = item.getAttribute("data-tab");
        this.switchTab(tabId);
      });
    });
  },

  switchTab(tabId) {
    document.querySelectorAll(".dashboard-nav-item[data-tab]").forEach(item => {
      item.classList.toggle("active", item.getAttribute("data-tab") === tabId);
    });

    document.querySelectorAll(".tab-pane").forEach(pane => {
      pane.classList.remove("active");
    });

    const activePane = document.getElementById(tabId);
    if (activePane) {
      activePane.classList.add("active");
      window.location.hash = tabId;
      App.initIcons();
    }
  },

  checkUrlHashTab() {
    const hash = window.location.hash.replace("#", "");
    if (hash && document.getElementById(hash)) {
      this.switchTab(hash);
    }
  },

  /**
   * Calculate metrics for posted jobs and received applicants
   */
  renderStats() {
    const myJobs = Storage.getJobsByEmployer(this.user.id);
    const myApps = Storage.getApplicationsByEmployer(this.user.id);

    const totalJobs = myJobs.length;
    const totalApplicants = myApps.length;
    const shortlistedCount = myApps.filter(a => a.status === "Shortlisted").length;
    const selectedCount = myApps.filter(a => a.status === "Selected").length;

    const elJobs = document.getElementById("statEmployerJobs");
    const elApps = document.getElementById("statEmployerApplicants");
    const elShortlist = document.getElementById("statEmployerShortlisted");
    const elHired = document.getElementById("statEmployerHired");

    if (elJobs) elJobs.textContent = totalJobs;
    if (elApps) elApps.textContent = totalApplicants;
    if (elShortlist) elShortlist.textContent = shortlistedCount;
    if (elHired) elHired.textContent = selectedCount;

    // Sidebar badge
    const badgeJobs = document.getElementById("sidebarEmployerJobsBadge");
    const badgeApps = document.getElementById("sidebarEmployerAppsBadge");
    if (badgeJobs) badgeJobs.textContent = totalJobs;
    if (badgeApps) badgeApps.textContent = totalApplicants;
  },

  /**
   * Render table of jobs created by this employer
   */
  renderEmployerJobs() {
    const tbody = document.getElementById("employerJobsTableBody");
    if (!tbody) return;

    const jobs = Storage.getJobsByEmployer(this.user.id);

    if (jobs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center" style="padding: 2.5rem;">
            <div class="empty-state-icon" style="margin: 0 auto 0.75rem auto;">
              <i data-lucide="briefcase" class="icon-lg"></i>
            </div>
            <p class="font-bold">No active job listings posted yet</p>
            <p class="text-xs text-muted mb-3">Post your first job opening to reach thousands of qualified applicants.</p>
            <button class="btn btn-primary btn-sm" onclick="EmployerDashboard.switchTab('post-job-tab')">
              <i data-lucide="plus-circle" class="icon-xs mr-1"></i> Post a New Job
            </button>
          </td>
        </tr>
      `;
      App.initIcons();
      return;
    }

    tbody.innerHTML = jobs.map(job => {
      const applicantCount = Storage.getApplicationsByJob(job.id).length;
      return `
        <tr>
          <td>
            <a href="job-details.html?id=${encodeURIComponent(job.id)}" class="font-bold text-main" style="display: block;">
              ${Validation.escapeHTML(job.title)}
            </a>
            <span class="text-xs text-muted">${Validation.escapeHTML(job.category || 'General')} • ${Validation.escapeHTML(job.workMode || 'On-site')}</span>
          </td>
          <td><span class="text-sm">${Validation.escapeHTML(job.jobType)}</span></td>
          <td><span class="text-sm">${Validation.escapeHTML(job.location)}</span></td>
          <td><span class="text-sm font-semibold">${applicantCount} candidate${applicantCount === 1 ? '' : 's'}</span></td>
          <td><span class="text-xs text-muted">${Validation.escapeHTML(job.postedDate)}</span></td>
          <td>
            <div class="table-actions-cell">
              <a href="job-details.html?id=${encodeURIComponent(job.id)}" class="btn btn-secondary btn-sm" title="View Job Page">
                <i data-lucide="external-link" class="icon-xs"></i>
              </a>
              <button class="btn btn-secondary btn-sm btn-edit-job" data-job-id="${Validation.escapeHTML(job.id)}" title="Edit Job">
                <i data-lucide="edit-2" class="icon-xs"></i>
              </button>
              <button class="btn btn-danger-outline btn-sm btn-delete-job" data-job-id="${Validation.escapeHTML(job.id)}" title="Delete Job">
                <i data-lucide="trash-2" class="icon-xs"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    App.initIcons();

    // Bind Edit and Delete
    tbody.querySelectorAll(".btn-edit-job").forEach(btn => {
      btn.addEventListener("click", () => {
        const jobId = btn.getAttribute("data-job-id");
        this.openEditModal(jobId);
      });
    });

    tbody.querySelectorAll(".btn-delete-job").forEach(btn => {
      btn.addEventListener("click", () => {
        const jobId = btn.getAttribute("data-job-id");
        if (confirm("Are you sure you want to permanently delete this job posting? This cannot be undone.")) {
          Storage.deleteJob(jobId);
          App.showToast("Job listing deleted successfully.", "info");
          this.renderEmployerJobs();
          this.renderStats();
          this.renderApplicants();
        }
      });
    });
  },

  /**
   * Render table of applicants received by this employer
   */
  renderApplicants() {
    const tbody = document.getElementById("employerApplicantsTableBody");
    const jobFilterSelect = document.getElementById("applicantJobFilterSelect");
    if (!tbody) return;

    let apps = Storage.getApplicationsByEmployer(this.user.id);
    const myJobs = Storage.getJobsByEmployer(this.user.id);

    // Populate job filter dropdown
    if (jobFilterSelect && jobFilterSelect.options.length <= 1) {
      jobFilterSelect.innerHTML = `<option value="">All Job Openings</option>`;
      myJobs.forEach(j => {
        const opt = document.createElement("option");
        opt.value = j.id;
        opt.textContent = j.title;
        jobFilterSelect.appendChild(opt);
      });

      jobFilterSelect.addEventListener("change", () => {
        this.renderApplicants();
      });
    }

    if (jobFilterSelect && jobFilterSelect.value) {
      apps = apps.filter(a => String(a.jobId) === String(jobFilterSelect.value));
    }

    if (apps.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center" style="padding: 2.5rem;">
            <div class="empty-state-icon" style="margin: 0 auto 0.75rem auto;">
              <i data-lucide="users" class="icon-lg"></i>
            </div>
            <p class="font-bold">No candidates found</p>
            <p class="text-xs text-muted">When candidates apply for your listed openings, they will appear here with full details.</p>
          </td>
        </tr>
      `;
      App.initIcons();
      return;
    }

    tbody.innerHTML = apps.map(app => {
      return `
        <tr>
          <td>
            <div class="font-bold text-main">${Validation.escapeHTML(app.applicantName)}</div>
            <div class="text-xs text-muted">${Validation.escapeHTML(app.applicantEmail)} • ${Validation.escapeHTML(app.applicantPhone)}</div>
          </td>
          <td>
            <span class="text-sm font-semibold">${Validation.escapeHTML(app.jobTitle)}</span>
          </td>
          <td>
            <span class="text-xs text-muted">${Validation.escapeHTML(app.appliedDate)}</span>
          </td>
          <td>
            <span class="text-xs text-secondary" title="${Validation.escapeHTML(app.resumeName)}">
              <i data-lucide="file-text" class="icon-xs mr-1" style="display:inline;"></i>
              ${Validation.escapeHTML(app.resumeName || 'Resume.pdf')}
            </span>
          </td>
          <td>
            <select class="status-select app-status-updater" data-app-id="${Validation.escapeHTML(app.id)}">
              <option value="Applied" ${app.status === 'Applied' ? 'selected' : ''}>Applied</option>
              <option value="Under Review" ${app.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
              <option value="Shortlisted" ${app.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
              <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
              <option value="Selected" ${app.status === 'Selected' ? 'selected' : ''}>Selected (Hired)</option>
            </select>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm btn-view-applicant-cover" 
              data-app-id="${Validation.escapeHTML(app.id)}"
              data-name="${Validation.escapeHTML(app.applicantName)}"
              data-note="${Validation.escapeHTML(app.coverNote || 'No cover note provided by candidate.')}">
              View Cover Note
            </button>
          </td>
        </tr>
      `;
    }).join("");

    App.initIcons();

    // Bind status updates
    tbody.querySelectorAll(".app-status-updater").forEach(select => {
      select.addEventListener("change", (e) => {
        const appId = select.getAttribute("data-app-id");
        const newStatus = e.target.value;
        Storage.updateApplicationStatus(appId, newStatus);
        App.showToast(`Application status updated to "${newStatus}"!`, "success");
        this.renderStats();
      });
    });

    // Bind cover note view modal
    tbody.querySelectorAll(".btn-view-applicant-cover").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        const note = btn.getAttribute("data-note");
        alert(`Candidate Note from ${name}:\n\n"${note}"`);
      });
    });
  },

  /**
   * Post New Job Form Controller
   */
  initPostJobForm() {
    const form = document.getElementById("postJobForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      Validation.clearAllErrors(form);

      const titleInput = document.getElementById("jobPostTitle");
      const categoryInput = document.getElementById("jobPostCategory");
      const jobTypeInput = document.getElementById("jobPostType");
      const expLevelInput = document.getElementById("jobPostExpLevel");
      const workModeInput = document.getElementById("jobPostWorkMode");
      const locationInput = document.getElementById("jobPostLocation");
      const minSalaryInput = document.getElementById("jobPostMinSalary");
      const maxSalaryInput = document.getElementById("jobPostMaxSalary");
      const deadlineInput = document.getElementById("jobPostDeadline");
      const skillsInput = document.getElementById("jobPostSkills");
      const descInput = document.getElementById("jobPostDesc");
      const respInput = document.getElementById("jobPostResponsibilities");
      const qualInput = document.getElementById("jobPostQualifications");
      const benInput = document.getElementById("jobPostBenefits");

      let isValid = true;
      if (!titleInput.value.trim()) {
        Validation.showError(titleInput, "Job title is required.");
        isValid = false;
      }
      if (!categoryInput.value) {
        Validation.showError(categoryInput, "Please select a category.");
        isValid = false;
      }
      if (!locationInput.value.trim()) {
        Validation.showError(locationInput, "Location is required.");
        isValid = false;
      }
      if (!descInput.value.trim()) {
        Validation.showError(descInput, "Please write a brief job description.");
        isValid = false;
      }

      if (!isValid) return;

      const minSal = parseInt(minSalaryInput.value, 10) || 500000;
      const maxSal = parseInt(maxSalaryInput.value, 10) || 1000000;
      const skillsArr = skillsInput.value ? skillsInput.value.split(",").map(s => s.trim()).filter(Boolean) : ["General"];
      const respArr = respInput.value ? respInput.value.split("\n").map(r => r.trim()).filter(Boolean) : ["Collaborate with engineering teams."];
      const qualArr = qualInput.value ? qualInput.value.split("\n").map(q => q.trim()).filter(Boolean) : ["Relevant Bachelor's degree or practical experience."];
      const benArr = benInput.value ? benInput.value.split("\n").map(b => b.trim()).filter(Boolean) : ["Health insurance", "Flexible working"];

      // Company info
      const companyName = this.user.companyName || "Tata Consultancy Services (TCS)";
      const companyId = this.user.companyId || "comp-1";
      const company = Storage.getCompanyById(companyId);

      const createdJob = Storage.createJob({
        title: titleInput.value.trim(),
        companyId: companyId,
        companyName: companyName,
        companyLogo: company ? company.logo : companyName.substring(0, 3).toUpperCase(),
        logoBg: company ? company.logoBg : "#2563EB",
        location: locationInput.value.trim(),
        workMode: workModeInput.value,
        jobType: jobTypeInput.value,
        experienceLevel: expLevelInput.value,
        category: categoryInput.value,
        minSalary: minSal,
        maxSalary: maxSal,
        salaryText: `₹${minSal.toLocaleString("en-IN")} - ₹${maxSal.toLocaleString("en-IN")} / yr`,
        deadline: deadlineInput.value || "2026-12-31",
        skills: skillsArr,
        description: descInput.value.trim(),
        responsibilities: respArr,
        qualifications: qualArr,
        benefits: benArr,
        employerId: this.user.id
      });

      form.reset();
      App.showToast(`Job listing "${createdJob.title}" posted successfully!`, "success");
      this.renderEmployerJobs();
      this.renderStats();
      this.switchTab("manage-jobs-tab");
    });
  },

  /**
   * Edit Job Modal Controller
   */
  initEditJobModal() {
    const modal = document.getElementById("editJobModalBackdrop");
    const closeBtn = document.getElementById("closeEditJobModalBtn");
    const cancelBtn = document.getElementById("cancelEditJobModalBtn");
    const form = document.getElementById("editJobForm");

    if (!modal || !form) return;

    const closeModal = () => {
      modal.classList.remove("show");
      this.editingJobId = null;
      Validation.clearAllErrors(form);
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!this.editingJobId) return;

      const titleInput = document.getElementById("editJobTitle");
      const categoryInput = document.getElementById("editJobCategory");
      const jobTypeInput = document.getElementById("editJobType");
      const expLevelInput = document.getElementById("editJobExpLevel");
      const workModeInput = document.getElementById("editJobWorkMode");
      const locationInput = document.getElementById("editJobLocation");
      const salaryTextInput = document.getElementById("editJobSalaryText");
      const skillsInput = document.getElementById("editJobSkills");
      const descInput = document.getElementById("editJobDesc");

      if (!titleInput.value.trim()) {
        Validation.showError(titleInput, "Title is required.");
        return;
      }

      const skillsArr = skillsInput.value ? skillsInput.value.split(",").map(s => s.trim()).filter(Boolean) : [];

      Storage.updateJob(this.editingJobId, {
        title: titleInput.value.trim(),
        category: categoryInput.value,
        jobType: jobTypeInput.value,
        experienceLevel: expLevelInput.value,
        workMode: workModeInput.value,
        location: locationInput.value.trim(),
        salaryText: salaryTextInput.value.trim(),
        skills: skillsArr,
        description: descInput.value.trim()
      });

      closeModal();
      App.showToast("Job listing updated successfully!", "success");
      this.renderEmployerJobs();
    });
  },

  openEditModal(jobId) {
    const job = Storage.getJobById(jobId);
    if (!job) return;

    this.editingJobId = jobId;

    document.getElementById("editJobTitle").value = job.title || "";
    document.getElementById("editJobCategory").value = job.category || "";
    document.getElementById("editJobType").value = job.jobType || "Full-Time";
    document.getElementById("editJobExpLevel").value = job.experienceLevel || "Mid-Level";
    document.getElementById("editJobWorkMode").value = job.workMode || "Hybrid";
    document.getElementById("editJobLocation").value = job.location || "";
    document.getElementById("editJobSalaryText").value = job.salaryText || "";
    document.getElementById("editJobSkills").value = Array.isArray(job.skills) ? job.skills.join(", ") : "";
    document.getElementById("editJobDesc").value = job.description || "";

    const modal = document.getElementById("editJobModalBackdrop");
    if (modal) modal.classList.add("show");
  },

  /**
   * Company Profile Edit Form
   */
  initCompanyProfileForm() {
    const form = document.getElementById("employerCompanyProfileForm");
    if (!form) return;

    const u = this.user;
    const compName = document.getElementById("empProfileCompanyName");
    const recName = document.getElementById("empProfileRecruiterName");
    const phone = document.getElementById("empProfilePhone");
    const loc = document.getElementById("empProfileLocation");
    const bio = document.getElementById("empProfileBio");

    if (compName) compName.value = u.companyName || "";
    if (recName) recName.value = u.name || "";
    if (phone) phone.value = u.phone || "";
    if (loc) loc.value = u.location || "";
    if (bio) bio.value = u.bio || "";

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const updated = Storage.updateUserProfile(u.id, {
        companyName: compName.value.trim(),
        name: recName.value.trim(),
        phone: phone.value.trim(),
        location: loc.value.trim(),
        bio: bio.value.trim()
      });

      this.user = updated;
      this.renderUserInfo();
      App.renderHeaderAuthState();
      App.showToast("Company recruiter profile updated!", "success");
    });
  }
};
