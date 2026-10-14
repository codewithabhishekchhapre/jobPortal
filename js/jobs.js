/**
 * JobNest - Jobs Listing, Filtering, Search & Application Module
 * Controls jobs.html dynamic filters, search query parameters, pagination,
 * bookmarking, and the Apply modal workflow.
 */

const JobsController = {
  state: {
    allJobs: [],
    filteredJobs: [],
    currentPage: 1,
    pageSize: 6,
    filters: {
      query: "",
      location: "",
      category: "",
      jobTypes: [],
      experienceLevels: [],
      workModes: [],
      minSalary: 0,
      sortBy: "newest" // newest, salary-high, title-asc
    },
    applyingJobId: null
  },

  init() {
    this.state.allJobs = Storage.getJobs();
    this.readUrlQueryParams();
    this.bindEvents();
    this.populateFilterDropdowns();
    this.applyFilters();
    this.initApplyModal();
  },

  /**
   * Parse query parameters from URL (e.g., ?q=python&loc=bengaluru&cat=Development)
   */
  readUrlQueryParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) this.state.filters.query = params.get("q").trim();
    if (params.get("loc")) this.state.filters.location = params.get("loc").trim();
    if (params.get("cat")) this.state.filters.category = params.get("cat").trim();
    if (params.get("type")) this.state.filters.jobTypes = [params.get("type")];
    if (params.get("exp")) this.state.filters.experienceLevels = [params.get("exp")];
    if (params.get("mode")) this.state.filters.workModes = [params.get("mode")];

    // Sync input values to DOM if elements exist
    const searchInput = document.getElementById("jobSearchKeyword");
    if (searchInput && this.state.filters.query) searchInput.value = this.state.filters.query;

    const locInput = document.getElementById("jobSearchLocation");
    if (locInput && this.state.filters.location) locInput.value = this.state.filters.location;
  },

  /**
   * Populate category filter counts and dynamic tags
   */
  populateFilterDropdowns() {
    // If category select exists
    const catSelect = document.getElementById("filterCategory");
    if (catSelect) {
      const categories = [...new Set(this.state.allJobs.map(j => j.category).filter(Boolean))];
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        if (this.state.filters.category === cat) option.selected = true;
        catSelect.appendChild(option);
      });
    }
  },

  /**
   * Bind event listeners for search bars, filters, and sorter
   */
  bindEvents() {
    // Search form submit
    const searchForm = document.getElementById("jobsSearchForm");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const qInput = document.getElementById("jobSearchKeyword");
        const locInput = document.getElementById("jobSearchLocation");
        this.state.filters.query = qInput ? qInput.value.trim() : "";
        this.state.filters.location = locInput ? locInput.value.trim() : "";
        this.state.currentPage = 1;
        this.applyFilters();
      });
    }

    // Live search input debounce
    const qInput = document.getElementById("jobSearchKeyword");
    if (qInput) {
      let timeout = null;
      qInput.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.state.filters.query = qInput.value.trim();
          this.state.currentPage = 1;
          this.applyFilters();
        }, 300);
      });
    }

    // Category select
    const catSelect = document.getElementById("filterCategory");
    if (catSelect) {
      catSelect.addEventListener("change", (e) => {
        this.state.filters.category = e.target.value;
        this.state.currentPage = 1;
        this.applyFilters();
      });
    }

    // Sort select
    const sortSelect = document.getElementById("sortBySelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.state.filters.sortBy = e.target.value;
        this.applyFilters();
      });
    }

    // Checkbox groups (Job Type, Experience, Work Mode)
    document.querySelectorAll(".filter-job-type").forEach(cb => {
      if (this.state.filters.jobTypes.includes(cb.value)) cb.checked = true;
      cb.addEventListener("change", () => {
        this.state.filters.jobTypes = Array.from(document.querySelectorAll(".filter-job-type:checked")).map(el => el.value);
        this.state.currentPage = 1;
        this.applyFilters();
      });
    });

    document.querySelectorAll(".filter-experience").forEach(cb => {
      if (this.state.filters.experienceLevels.includes(cb.value)) cb.checked = true;
      cb.addEventListener("change", () => {
        this.state.filters.experienceLevels = Array.from(document.querySelectorAll(".filter-experience:checked")).map(el => el.value);
        this.state.currentPage = 1;
        this.applyFilters();
      });
    });

    document.querySelectorAll(".filter-work-mode").forEach(cb => {
      if (this.state.filters.workModes.includes(cb.value)) cb.checked = true;
      cb.addEventListener("change", () => {
        this.state.filters.workModes = Array.from(document.querySelectorAll(".filter-work-mode:checked")).map(el => el.value);
        this.state.currentPage = 1;
        this.applyFilters();
      });
    });

    // Salary range input
    const salaryRange = document.getElementById("salaryRangeInput");
    const salaryValDisplay = document.getElementById("salaryValDisplay");
    if (salaryRange && salaryValDisplay) {
      salaryRange.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        this.state.filters.minSalary = val;
        salaryValDisplay.textContent = val === 0 ? "Any Salary" : `₹${(val / 100000).toFixed(1)} Lakh+`;
        this.state.currentPage = 1;
        this.applyFilters();
      });
    }

    // Reset filters button
    const resetBtn = document.getElementById("resetJobFiltersBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetFilters());
    }

    // Mobile filter toggle
    const mobileFilterToggle = document.getElementById("mobileFilterToggle");
    const sidebar = document.getElementById("jobFilterSidebar");
    if (mobileFilterToggle && sidebar) {
      mobileFilterToggle.addEventListener("click", () => {
        sidebar.classList.toggle("mobile-open");
        const isOpen = sidebar.classList.contains("mobile-open");
        mobileFilterToggle.textContent = isOpen ? "Hide Filters" : "Filter Jobs";
      });
    }
  },

  /**
   * Reset all filter controls to their default state
   */
  resetFilters() {
    this.state.filters = {
      query: "",
      location: "",
      category: "",
      jobTypes: [],
      experienceLevels: [],
      workModes: [],
      minSalary: 0,
      sortBy: "newest"
    };
    this.state.currentPage = 1;

    const qInput = document.getElementById("jobSearchKeyword");
    if (qInput) qInput.value = "";
    const locInput = document.getElementById("jobSearchLocation");
    if (locInput) locInput.value = "";
    const catSelect = document.getElementById("filterCategory");
    if (catSelect) catSelect.value = "";
    const sortSelect = document.getElementById("sortBySelect");
    if (sortSelect) sortSelect.value = "newest";

    document.querySelectorAll(".filter-job-type:checked, .filter-experience:checked, .filter-work-mode:checked").forEach(cb => cb.checked = false);

    const salaryRange = document.getElementById("salaryRangeInput");
    const salaryValDisplay = document.getElementById("salaryValDisplay");
    if (salaryRange && salaryValDisplay) {
      salaryRange.value = 0;
      salaryValDisplay.textContent = "Any Salary";
    }

    this.applyFilters();
    App.showToast("Filters have been cleared.", "info");
  },

  /**
   * Execute multi-criteria filtering and sorting
   */
  applyFilters() {
    // Re-fetch in case jobs were added/deleted
    this.state.allJobs = Storage.getJobs();
    let results = [...this.state.allJobs];
    const { query, location, category, jobTypes, experienceLevels, workModes, minSalary, sortBy } = this.state.filters;

    // Filter by query (title, company, or skills)
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(j => {
        const inTitle = j.title.toLowerCase().includes(q);
        const inCompany = j.companyName.toLowerCase().includes(q);
        const inSkills = Array.isArray(j.skills) && j.skills.some(s => s.toLowerCase().includes(q));
        return inTitle || inCompany || inSkills;
      });
    }

    // Filter by location
    if (location) {
      const loc = location.toLowerCase();
      results = results.filter(j => j.location.toLowerCase().includes(loc));
    }

    // Filter by Category
    if (category) {
      results = results.filter(j => j.category === category);
    }

    // Filter by Job Types
    if (jobTypes.length > 0) {
      results = results.filter(j => jobTypes.includes(j.jobType));
    }

    // Filter by Experience Level
    if (experienceLevels.length > 0) {
      results = results.filter(j => experienceLevels.includes(j.experienceLevel));
    }

    // Filter by Work Mode
    if (workModes.length > 0) {
      results = results.filter(j => workModes.includes(j.workMode));
    }

    // Filter by Min Salary
    if (minSalary > 0) {
      results = results.filter(j => (j.maxSalary || j.minSalary || 0) >= minSalary);
    }

    // Sort results
    if (sortBy === "salary-high") {
      results.sort((a, b) => (b.maxSalary || 0) - (a.maxSalary || 0));
    } else if (sortBy === "title-asc") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: newest
      results.sort((a, b) => new Date(b.postedDate || 0) - new Date(a.postedDate || 0));
    }

    this.state.filteredJobs = results;
    this.render();
  },

  /**
   * Render job cards, results count, and pagination
   */
  render() {
    const listContainer = document.getElementById("jobsListContainer");
    const countDisplay = document.getElementById("jobsResultsCount");
    if (!listContainer) return;

    const total = this.state.filteredJobs.length;
    if (countDisplay) {
      countDisplay.textContent = `Showing ${total} job${total === 1 ? "" : "s"}`;
    }

    if (total === 0) {
      listContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <i data-lucide="search-x" class="icon-xl"></i>
          </div>
          <h3 class="empty-state-title">No jobs matched your criteria</h3>
          <p class="empty-state-desc">Try clearing your search query or adjusting your filters to discover open job opportunities.</p>
          <button class="btn btn-outline" id="emptyStateResetBtn">Reset All Filters</button>
        </div>
      `;
      const btn = document.getElementById("emptyStateResetBtn");
      if (btn) btn.addEventListener("click", () => this.resetFilters());
      App.initIcons();
      this.renderPagination(0);
      return;
    }

    // Paginate
    const start = (this.state.currentPage - 1) * this.state.pageSize;
    const end = start + this.state.pageSize;
    const paginatedItems = this.state.filteredJobs.slice(start, end);

    const currentUser = Auth.getCurrentUser();
    const isSeeker = Boolean(currentUser && currentUser.role === "seeker");

    listContainer.innerHTML = paginatedItems.map(job => this.createJobCardHTML(job, isSeeker, currentUser?.id)).join("");
    App.initIcons();

    // Attach card event listeners
    this.bindJobCardEvents();

    // Render pagination controls
    this.renderPagination(total);
  },

  /**
   * Generate HTML markup for a single Job Card
   */
  createJobCardHTML(job, isSeeker, seekerId) {
    const isSaved = isSeeker && Storage.isJobSaved(seekerId, job.id);
    const hasApplied = isSeeker && Storage.hasSeekerApplied(seekerId, job.id);
    const skillsList = Array.isArray(job.skills) ? job.skills.slice(0, 4) : [];
    const timeAgo = App.getTimeAgo(job.postedDate);

    return `
      <article class="job-card" data-job-id="${Validation.escapeHTML(job.id)}">
        <div>
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
            ${isSeeker ? `
              <button class="btn-icon-only btn-save-job ${isSaved ? 'active' : ''}" 
                data-job-id="${Validation.escapeHTML(job.id)}" 
                title="${isSaved ? 'Remove from Saved Jobs' : 'Save Job'}"
                aria-label="${isSaved ? 'Remove from Saved Jobs' : 'Save Job'}">
                <i data-lucide="bookmark" class="icon-sm"></i>
              </button>
            ` : ""}
          </div>

          <div class="job-meta-list">
            <span class="job-meta-item">
              <i data-lucide="map-pin" class="icon-xs"></i>
              ${Validation.escapeHTML(job.location)}
            </span>
            <span class="job-meta-item">
              <i data-lucide="briefcase" class="icon-xs"></i>
              ${Validation.escapeHTML(job.jobType)}
            </span>
            <span class="job-meta-item">
              <i data-lucide="building" class="icon-xs"></i>
              ${Validation.escapeHTML(job.workMode || 'On-site')}
            </span>
            <span class="job-meta-item">
              <i data-lucide="user-check" class="icon-xs"></i>
              ${Validation.escapeHTML(job.experienceLevel || 'All Levels')}
            </span>
          </div>

          <div class="job-tags-list">
            ${skillsList.map(skill => `<span class="skill-tag">${Validation.escapeHTML(skill)}</span>`).join("")}
          </div>
        </div>

        <div class="job-card-footer">
          <div>
            <div class="job-salary-text">${Validation.escapeHTML(job.salaryText || App.formatSalary(job.minSalary, job.maxSalary))}</div>
            <div class="job-posted-time">Posted ${timeAgo}</div>
          </div>
          <div class="job-actions-row">
            <a href="job-details.html?id=${encodeURIComponent(job.id)}" class="btn btn-secondary btn-sm">
              Details
            </a>
            ${hasApplied ? `
              <button class="btn btn-secondary btn-sm" disabled title="Already Applied">
                <i data-lucide="check" class="icon-xs"></i> Applied
              </button>
            ` : `
              <button class="btn btn-primary btn-sm btn-quick-apply" data-job-id="${Validation.escapeHTML(job.id)}">
                Apply Now
              </button>
            `}
          </div>
        </div>
      </article>
    `;
  },

  /**
   * Bind Bookmark & Apply buttons
   */
  bindJobCardEvents() {
    // Save job toggle
    document.querySelectorAll(".btn-save-job").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const jobId = btn.getAttribute("data-job-id");
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) {
          App.showToast("Please log in to save jobs.", "warning");
          return;
        }
        const isSavedNow = Storage.toggleSaveJob(currentUser.id, jobId);
        btn.classList.toggle("active", isSavedNow);
        if (isSavedNow) {
          App.showToast("Job added to your saved jobs!", "success");
        } else {
          App.showToast("Job removed from saved jobs.", "info");
        }
      });
    });

    // Apply button
    document.querySelectorAll(".btn-quick-apply").forEach(btn => {
      btn.addEventListener("click", () => {
        const jobId = btn.getAttribute("data-job-id");
        this.openApplyModal(jobId);
      });
    });
  },

  /**
   * Setup Pagination Controls
   */
  renderPagination(totalCount) {
    const wrapper = document.getElementById("jobsPaginationWrapper");
    if (!wrapper) return;

    const totalPages = Math.ceil(totalCount / this.state.pageSize);
    if (totalPages <= 1) {
      wrapper.innerHTML = "";
      return;
    }

    const { currentPage } = this.state;
    let buttonsHtml = "";

    buttonsHtml += `
      <button class="page-btn" id="prevPageBtn" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous Page">
        <i data-lucide="chevron-left" class="icon-sm"></i>
      </button>
    `;

    for (let p = 1; p <= totalPages; p++) {
      buttonsHtml += `
        <button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">
          ${p}
        </button>
      `;
    }

    buttonsHtml += `
      <button class="page-btn" id="nextPageBtn" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next Page">
        <i data-lucide="chevron-right" class="icon-sm"></i>
      </button>
    `;

    wrapper.innerHTML = `
      <div class="pagination-info">
        Showing ${(currentPage - 1) * this.state.pageSize + 1} - ${Math.min(currentPage * this.state.pageSize, totalCount)} of ${totalCount} jobs
      </div>
      <div class="pagination-controls">
        ${buttonsHtml}
      </div>
    `;

    // Bind page button clicks
    wrapper.querySelectorAll(".page-btn[data-page]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.state.currentPage = parseInt(btn.getAttribute("data-page"), 10);
        this.render();
        window.scrollTo({ top: 120, behavior: "smooth" });
      });
    });

    const prevBtn = document.getElementById("prevPageBtn");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (this.state.currentPage > 1) {
          this.state.currentPage--;
          this.render();
          window.scrollTo({ top: 120, behavior: "smooth" });
        }
      });
    }

    const nextBtn = document.getElementById("nextPageBtn");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (this.state.currentPage < totalPages) {
          this.state.currentPage++;
          this.render();
          window.scrollTo({ top: 120, behavior: "smooth" });
        }
      });
    }
  },

  /**
   * Initialize Apply Modal and form submission
   */
  initApplyModal() {
    const modalBackdrop = document.getElementById("applyModalBackdrop");
    const closeBtn = document.getElementById("closeApplyModalBtn");
    const cancelBtn = document.getElementById("cancelApplyModalBtn");
    const applyForm = document.getElementById("jobApplicationForm");

    if (!modalBackdrop || !applyForm) return;

    const closeModal = () => {
      modalBackdrop.classList.remove("show");
      this.state.applyingJobId = null;
      Validation.clearAllErrors(applyForm);
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closeModal();
    });

    // Form submit
    applyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.submitApplication(applyForm, closeModal);
    });
  },

  /**
   * Open the Apply Modal for a specific job
   */
  openApplyModal(jobId) {
    const user = Auth.getCurrentUser();
    if (!user) {
      App.showToast("Please log in to apply for jobs.", "warning");
      setTimeout(() => {
        window.location.href = `login.html?returnUrl=${encodeURIComponent('jobs.html')}`;
      }, 1200);
      return;
    }

    if (user.role === "employer") {
      App.showToast("Employers cannot apply for jobs. Please log in with a Job Seeker account.", "warning");
      return;
    }

    const job = Storage.getJobById(jobId);
    if (!job) {
      App.showToast("Job not found.", "error");
      return;
    }

    // Check duplicate application
    if (Storage.hasSeekerApplied(user.id, jobId)) {
      App.showToast("You have already submitted an application for this position.", "info");
      return;
    }

    this.state.applyingJobId = jobId;

    // Populate modal title and fields
    const modalTitle = document.getElementById("applyModalJobTitle");
    const companySpan = document.getElementById("applyModalCompanyName");
    if (modalTitle) modalTitle.textContent = job.title;
    if (companySpan) companySpan.textContent = job.companyName;

    const nameInput = document.getElementById("applyFullName");
    const emailInput = document.getElementById("applyEmail");
    const phoneInput = document.getElementById("applyPhone");
    const resumeStatus = document.getElementById("applyResumeInfo");

    if (nameInput) nameInput.value = user.name || "";
    if (emailInput) emailInput.value = user.email || "";
    if (phoneInput) phoneInput.value = user.phone || "";

    if (resumeStatus) {
      if (user.resume && user.resume.fileName) {
        resumeStatus.innerHTML = `
          <div class="resume-info">
            <i data-lucide="file-check" class="icon-sm text-success"></i>
            <span>Using profile resume: <strong>${Validation.escapeHTML(user.resume.fileName)}</strong></span>
          </div>
        `;
      } else {
        resumeStatus.innerHTML = `
          <span class="text-xs text-muted">No resume uploaded to profile. You may attach a file below.</span>
        `;
      }
    }

    const modalBackdrop = document.getElementById("applyModalBackdrop");
    if (modalBackdrop) {
      modalBackdrop.classList.add("show");
      App.initIcons();
    }
  },

  /**
   * Submit application to storage
   */
  submitApplication(form, closeModalCallback) {
    Validation.clearAllErrors(form);

    const user = Auth.getCurrentUser();
    const jobId = this.state.applyingJobId;
    const job = Storage.getJobById(jobId);

    if (!user || !job) {
      App.showToast("Unable to submit application. Please reload.", "error");
      return;
    }

    const nameInput = document.getElementById("applyFullName");
    const emailInput = document.getElementById("applyEmail");
    const phoneInput = document.getElementById("applyPhone");
    const noteInput = document.getElementById("applyCoverNote");
    const resumeFileInput = document.getElementById("applyResumeFile");

    let isValid = true;

    if (!nameInput.value.trim()) {
      Validation.showError(nameInput, "Please enter your full name.");
      isValid = false;
    }

    if (!Validation.isValidEmail(emailInput.value)) {
      Validation.showError(emailInput, "Please enter a valid email address.");
      isValid = false;
    }

    if (!Validation.isValidPhone(phoneInput.value)) {
      Validation.showError(phoneInput, "Please enter a valid mobile number (10-15 digits).");
      isValid = false;
    }

    if (!isValid) return;

    // Resume selection
    let resumeName = (user.resume && user.resume.fileName) ? user.resume.fileName : "Standard_Seeker_Resume.pdf";
    if (resumeFileInput && resumeFileInput.files && resumeFileInput.files.length > 0) {
      resumeName = resumeFileInput.files[0].name;
    }

    // Create application
    Storage.createApplication({
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      logoBg: job.logoBg,
      location: job.location,
      seekerId: user.id,
      applicantName: nameInput.value.trim(),
      applicantEmail: emailInput.value.trim(),
      applicantPhone: phoneInput.value.trim(),
      coverNote: noteInput ? noteInput.value.trim() : "",
      resumeName: resumeName,
      employerId: job.employerId || "emp-1",
      status: "Applied"
    });

    closeModalCallback();
    App.showToast("Your application has been submitted successfully!", "success");

    // Re-render to reflect "Applied" status on the button
    this.render();
  }
};
