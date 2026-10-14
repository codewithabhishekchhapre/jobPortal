/**
 * JobNest - Job Seeker Dashboard Controller
 * Manages overview metrics, profile updating, skills tags, simulated resume upload,
 * application status tracker, and saved jobs list.
 */

const SeekerDashboard = {
  user: null,

  init() {
    if (!Auth.requireAuth("seeker", "login.html")) return;
    this.user = Auth.getCurrentUser();

    this.renderUserInfo();
    this.bindTabNavigation();
    this.renderStats();
    this.renderApplications();
    this.renderSavedJobs();
    this.initProfileForm();
    this.initSkillsManager();
    this.initResumeManager();
    this.checkUrlHashTab();
  },

  /**
   * Render user header info and avatar
   */
  renderUserInfo() {
    const user = this.user;
    const nameEls = document.querySelectorAll(".seeker-name-display");
    const emailEls = document.querySelectorAll(".seeker-email-display");
    const titleEls = document.querySelectorAll(".seeker-title-display");
    const avatarEls = document.querySelectorAll(".seeker-avatar-display");

    const initials = (user.name || "Seeker")
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    nameEls.forEach(el => el.textContent = user.name);
    emailEls.forEach(el => el.textContent = user.email);
    titleEls.forEach(el => el.textContent = user.title || "Job Seeker");
    avatarEls.forEach(el => el.textContent = initials);
  },

  /**
   * Tab Navigation (Overview, Profile, Resume, Applications, Saved Jobs)
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
   * Calculate and render stats metrics
   */
  renderStats() {
    const apps = Storage.getApplicationsBySeeker(this.user.id);
    const saved = Storage.getSavedJobIds(this.user.id);

    const totalApplied = apps.length;
    const underReview = apps.filter(a => a.status === "Under Review").length;
    const shortlisted = apps.filter(a => a.status === "Shortlisted").length;
    const selected = apps.filter(a => a.status === "Selected").length;

    const elTotal = document.getElementById("statTotalApplied");
    const elReview = document.getElementById("statUnderReview");
    const elShortlist = document.getElementById("statShortlisted");
    const elSelected = document.getElementById("statSelected");
    const elSaved = document.getElementById("statSavedJobs");

    if (elTotal) elTotal.textContent = totalApplied;
    if (elReview) elReview.textContent = underReview;
    if (elShortlist) elShortlist.textContent = shortlisted;
    if (elSelected) elSelected.textContent = selected;
    if (elSaved) elSaved.textContent = saved.length;

    // Badges in sidebar
    const badgeApps = document.getElementById("sidebarAppsBadge");
    const badgeSaved = document.getElementById("sidebarSavedBadge");
    if (badgeApps) badgeApps.textContent = totalApplied;
    if (badgeSaved) badgeSaved.textContent = saved.length;
  },

  /**
   * Render Applications Table & Statuses
   */
  renderApplications() {
    const container = document.getElementById("applicationsListTableBody");
    if (!container) return;

    const apps = Storage.getApplicationsBySeeker(this.user.id);

    if (apps.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="6" class="text-center" style="padding: 2.5rem;">
            <div class="empty-state-icon" style="margin: 0 auto 0.75rem auto;">
              <i data-lucide="file-question" class="icon-lg"></i>
            </div>
            <p class="font-bold">No job applications submitted yet</p>
            <p class="text-xs text-muted mb-3">Explore thousands of open positions and submit your first application today!</p>
            <a href="jobs.html" class="btn btn-primary btn-sm">Browse Available Jobs</a>
          </td>
        </tr>
      `;
      App.initIcons();
      return;
    }

    container.innerHTML = apps.map(app => {
      const statusClass = "status-" + app.status.toLowerCase().replace(/\s+/g, "-");
      return `
        <tr>
          <td>
            <div class="table-company-cell">
              <div class="company-logo-badge" style="background-color: ${app.logoBg || '#2563EB'}; width: 34px; height: 34px; font-size: 0.75rem;">
                ${Validation.escapeHTML(app.companyLogo || app.companyName.substring(0, 3).toUpperCase())}
              </div>
              <div>
                <a href="job-details.html?id=${encodeURIComponent(app.jobId)}" class="font-bold text-main" style="display: block;">
                  ${Validation.escapeHTML(app.jobTitle)}
                </a>
                <span class="text-xs text-muted">${Validation.escapeHTML(app.companyName)}</span>
              </div>
            </div>
          </td>
          <td><span class="text-sm">${Validation.escapeHTML(app.location || 'India')}</span></td>
          <td><span class="text-sm">${Validation.escapeHTML(app.appliedDate)}</span></td>
          <td>
            <span class="badge ${statusClass}">
              ${Validation.escapeHTML(app.status)}
            </span>
          </td>
          <td>
            <span class="text-xs text-secondary" title="${Validation.escapeHTML(app.resumeName || 'Default Resume')}">
              ${Validation.escapeHTML(app.resumeName || 'Resume.pdf')}
            </span>
          </td>
          <td class="text-right">
            <a href="job-details.html?id=${encodeURIComponent(app.jobId)}" class="btn btn-secondary btn-sm" title="View Job Details">
              View Job
            </a>
          </td>
        </tr>
      `;
    }).join("");

    App.initIcons();
  },

  /**
   * Render Saved Jobs Grid
   */
  renderSavedJobs() {
    const container = document.getElementById("savedJobsContainer");
    if (!container) return;

    const savedJobs = Storage.getSavedJobsList(this.user.id);

    if (savedJobs.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <i data-lucide="bookmark" class="icon-xl"></i>
          </div>
          <h4 class="empty-state-title">No Saved Jobs</h4>
          <p class="empty-state-desc">You haven't bookmarked any jobs yet. When browsing jobs, click the bookmark icon to save them here for quick access.</p>
          <a href="jobs.html" class="btn btn-primary">Discover Jobs</a>
        </div>
      `;
      App.initIcons();
      return;
    }

    container.innerHTML = savedJobs.map(job => {
      const hasApplied = Storage.hasSeekerApplied(this.user.id, job.id);
      return `
        <div class="job-card mb-3">
          <div class="job-card-header">
            <div class="job-brand-wrap">
              <div class="company-logo-badge" style="background-color: ${job.logoBg || '#2563EB'};">
                ${Validation.escapeHTML(job.companyLogo || job.companyName.substring(0, 3).toUpperCase())}
              </div>
              <div>
                <span class="job-company-title">${Validation.escapeHTML(job.companyName)}</span>
                <a href="job-details.html?id=${encodeURIComponent(job.id)}" class="job-title-link">
                  ${Validation.escapeHTML(job.title)}
                </a>
              </div>
            </div>
            <button class="btn-icon-only active btn-remove-saved" data-job-id="${Validation.escapeHTML(job.id)}" title="Remove Bookmark">
              <i data-lucide="bookmark-x" class="icon-sm"></i>
            </button>
          </div>

          <div class="job-meta-list">
            <span class="job-meta-item"><i data-lucide="map-pin" class="icon-xs"></i> ${Validation.escapeHTML(job.location)}</span>
            <span class="job-meta-item"><i data-lucide="briefcase" class="icon-xs"></i> ${Validation.escapeHTML(job.jobType)}</span>
            <span class="job-meta-item"><i data-lucide="building" class="icon-xs"></i> ${Validation.escapeHTML(job.workMode || 'On-site')}</span>
          </div>

          <div class="job-card-footer">
            <div class="job-salary-text">${Validation.escapeHTML(job.salaryText || App.formatSalary(job.minSalary, job.maxSalary))}</div>
            <div class="job-actions-row">
              <a href="job-details.html?id=${encodeURIComponent(job.id)}" class="btn btn-secondary btn-sm">Details</a>
              ${hasApplied ? `
                <button class="btn btn-secondary btn-sm" disabled><i data-lucide="check" class="icon-xs"></i> Applied</button>
              ` : `
                <a href="job-details.html?id=${encodeURIComponent(job.id)}#apply" class="btn btn-primary btn-sm">Apply</a>
              `}
            </div>
          </div>
        </div>
      `;
    }).join("");

    App.initIcons();

    // Bind remove button
    container.querySelectorAll(".btn-remove-saved").forEach(btn => {
      btn.addEventListener("click", () => {
        const jobId = btn.getAttribute("data-job-id");
        Storage.toggleSaveJob(this.user.id, jobId);
        App.showToast("Job removed from saved list.", "info");
        this.renderSavedJobs();
        this.renderStats();
      });
    });
  },

  /**
   * Initialize Edit Profile Form
   */
  initProfileForm() {
    const form = document.getElementById("seekerProfileForm");
    if (!form) return;

    const u = this.user;
    const nameInput = document.getElementById("profileFullName");
    const emailInput = document.getElementById("profileEmail");
    const phoneInput = document.getElementById("profilePhone");
    const titleInput = document.getElementById("profileHeadline");
    const locInput = document.getElementById("profileLocation");
    const bioInput = document.getElementById("profileBio");

    if (nameInput) nameInput.value = u.name || "";
    if (emailInput) emailInput.value = u.email || "";
    if (phoneInput) phoneInput.value = u.phone || "";
    if (titleInput) titleInput.value = u.title || "";
    if (locInput) locInput.value = u.location || "";
    if (bioInput) bioInput.value = u.bio || "";

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      Validation.clearAllErrors(form);

      let isValid = true;
      if (!nameInput.value.trim()) {
        Validation.showError(nameInput, "Full name cannot be blank.");
        isValid = false;
      }
      if (!Validation.isValidPhone(phoneInput.value)) {
        Validation.showError(phoneInput, "Please enter a valid mobile number.");
        isValid = false;
      }

      if (!isValid) return;

      const updated = Storage.updateUserProfile(u.id, {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        title: titleInput.value.trim(),
        location: locInput.value.trim(),
        bio: bioInput.value.trim()
      });

      this.user = updated;
      this.renderUserInfo();
      App.renderHeaderAuthState();
      App.showToast("Profile details updated successfully!", "success");
    });
  },

  /**
   * Skills Tag Manager
   */
  initSkillsManager() {
    const container = document.getElementById("profileSkillsContainer");
    const skillInput = document.getElementById("profileSkillInput");
    const addSkillBtn = document.getElementById("addSkillBtn");

    if (!container) return;

    const renderSkills = () => {
      const skills = this.user.skills || [];
      if (skills.length === 0) {
        container.innerHTML = `<span class="text-xs text-muted">No skills added yet. Type a skill and click Add.</span>`;
        return;
      }
      container.innerHTML = skills.map((skill, index) => `
        <span class="skill-removable-tag">
          ${Validation.escapeHTML(skill)}
          <button type="button" data-index="${index}" aria-label="Remove ${Validation.escapeHTML(skill)}">&times;</button>
        </span>
      `).join("");

      container.querySelectorAll("button[data-index]").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-index"), 10);
          this.user.skills.splice(idx, 1);
          Storage.updateUserProfile(this.user.id, { skills: this.user.skills });
          renderSkills();
          App.showToast("Skill removed.", "info");
        });
      });
    };

    const addSkill = () => {
      if (!skillInput) return;
      const val = skillInput.value.trim();
      if (!val) return;

      if (!Array.isArray(this.user.skills)) this.user.skills = [];
      if (this.user.skills.includes(val)) {
        App.showToast("Skill already added.", "warning");
        return;
      }

      this.user.skills.push(val);
      Storage.updateUserProfile(this.user.id, { skills: this.user.skills });
      skillInput.value = "";
      renderSkills();
      App.showToast("Skill added!", "success");
    };

    if (addSkillBtn) addSkillBtn.addEventListener("click", addSkill);
    if (skillInput) {
      skillInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addSkill();
        }
      });
    }

    renderSkills();
  },

  /**
   * Resume upload and preview simulation
   */
  initResumeManager() {
    const resumeDisplay = document.getElementById("resumeCurrentCard");
    const fileInput = document.getElementById("resumeUploadInput");
    const deleteBtn = document.getElementById("deleteResumeBtn");

    if (!resumeDisplay) return;

    const renderResume = () => {
      const r = this.user.resume;
      if (r && r.fileName) {
        resumeDisplay.style.display = "flex";
        document.getElementById("resumeFileName").textContent = r.fileName;
        document.getElementById("resumeFileSize").textContent = `${r.fileSize || '1.2 MB'} • Uploaded on ${r.uploadDate || '2026-10-01'}`;
        const previewEl = document.getElementById("resumePreviewBox");
        if (previewEl) {
          previewEl.style.display = "block";
          document.getElementById("resumePreviewText").textContent = r.previewText || `Verified ATS-compliant resume: ${r.fileName}`;
        }
      } else {
        resumeDisplay.style.display = "none";
        const previewEl = document.getElementById("resumePreviewBox");
        if (previewEl) previewEl.style.display = "none";
      }
    };

    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        // Store metadata only (prevents localStorage quota overflow)
        const sizeKb = (file.size / 1024).toFixed(1);
        const sizeStr = file.size > 1048576 ? `${(file.size / 1048576).toFixed(1)} MB` : `${sizeKb} KB`;

        const newResume = {
          fileName: file.name,
          fileSize: sizeStr,
          uploadDate: new Date().toISOString().split("T")[0],
          previewText: `${this.user.name} - ${this.user.title || 'Applicant'} | ${file.name} ready for one-click job applications.`
        };

        this.user = Storage.updateUserProfile(this.user.id, { resume: newResume });
        renderResume();
        App.showToast("Resume uploaded successfully! Ready for applications.", "success");
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        if (confirm("Remove your current resume from JobNest profile?")) {
          this.user = Storage.updateUserProfile(this.user.id, { resume: null });
          renderResume();
          App.showToast("Resume removed from profile.", "info");
        }
      });
    }

    renderResume();
  }
};
