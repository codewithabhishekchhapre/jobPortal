/**
 * JobNest - Companies Directory & Details Module
 * Controls companies.html and company-details.html dynamic listing and filtering.
 */

const CompaniesController = {
  state: {
    allCompanies: [],
    filteredCompanies: [],
    query: "",
    selectedIndustry: ""
  },

  initList() {
    this.state.allCompanies = Storage.getCompanies();
    this.bindListEvents();
    this.populateIndustryFilter();
    this.applyFilters();
  },

  bindListEvents() {
    const searchInput = document.getElementById("companySearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.state.query = e.target.value.trim().toLowerCase();
        this.applyFilters();
      });
    }

    const industrySelect = document.getElementById("companyIndustryFilter");
    if (industrySelect) {
      industrySelect.addEventListener("change", (e) => {
        this.state.selectedIndustry = e.target.value;
        this.applyFilters();
      });
    }

    const resetBtn = document.getElementById("resetCompanyFiltersBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.state.query = "";
        this.state.selectedIndustry = "";
        if (searchInput) searchInput.value = "";
        if (industrySelect) industrySelect.value = "";
        this.applyFilters();
        App.showToast("Company filters reset.", "info");
      });
    }
  },

  populateIndustryFilter() {
    const select = document.getElementById("companyIndustryFilter");
    if (!select) return;

    const industries = [...new Set(this.state.allCompanies.map(c => c.industry).filter(Boolean))];
    industries.forEach(ind => {
      const opt = document.createElement("option");
      opt.value = ind;
      opt.textContent = ind;
      select.appendChild(opt);
    });
  },

  applyFilters() {
    let results = [...this.state.allCompanies];

    if (this.state.query) {
      results = results.filter(c => 
        c.name.toLowerCase().includes(this.state.query) || 
        c.location.toLowerCase().includes(this.state.query) ||
        (c.description && c.description.toLowerCase().includes(this.state.query))
      );
    }

    if (this.state.selectedIndustry) {
      results = results.filter(c => c.industry === this.state.selectedIndustry);
    }

    this.state.filteredCompanies = results;
    this.renderList();
  },

  renderList() {
    const container = document.getElementById("companiesListContainer");
    const countDisplay = document.getElementById("companiesCountDisplay");
    if (!container) return;

    const total = this.state.filteredCompanies.length;
    if (countDisplay) {
      countDisplay.textContent = `Showing ${total} leading compan${total === 1 ? "y" : "ies"}`;
    }

    if (total === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">
            <i data-lucide="building-2" class="icon-xl"></i>
          </div>
          <h3 class="empty-state-title">No companies found</h3>
          <p class="empty-state-desc">Try clearing your search keyword or selecting a different industry.</p>
        </div>
      `;
      App.initIcons();
      return;
    }

    container.innerHTML = this.state.filteredCompanies.map(comp => {
      const jobCount = Storage.getCompanyJobsCount(comp.id);
      return `
        <article class="company-card">
          <div class="company-card-logo" style="background-color: ${comp.logoBg || '#2563EB'};">
            ${Validation.escapeHTML(comp.logo || comp.name.substring(0, 3).toUpperCase())}
          </div>
          <h3 class="company-card-name">${Validation.escapeHTML(comp.name)}</h3>
          <span class="company-card-industry">${Validation.escapeHTML(comp.industry)}</span>
          <div class="company-card-location">
            <i data-lucide="map-pin" class="icon-xs"></i>
            <span>${Validation.escapeHTML(comp.location)}</span>
          </div>
          <div class="company-card-badge">
            ${jobCount} Open Position${jobCount === 1 ? '' : 's'}
          </div>
          <a href="company-details.html?id=${encodeURIComponent(comp.id)}" class="btn btn-outline btn-block mt-auto">
            View Company & Jobs
          </a>
        </article>
      `;
    }).join("");

    App.initIcons();
  },

  /**
   * Initialize Company Details page
   */
  initDetails() {
    const params = new URLSearchParams(window.location.search);
    const companyId = params.get("id") || "comp-1";
    const company = Storage.getCompanyById(companyId);

    const nameEl = document.getElementById("companyDetailName");
    const logoEl = document.getElementById("companyDetailLogo");
    const industryEl = document.getElementById("companyDetailIndustry");
    const locEl = document.getElementById("companyDetailLocation");
    const sizeEl = document.getElementById("companyDetailSize");
    const foundedEl = document.getElementById("companyDetailFounded");
    const webEl = document.getElementById("companyDetailWebsite");
    const descEl = document.getElementById("companyDetailDesc");
    const jobsListEl = document.getElementById("companyJobsContainer");
    const jobsCountEl = document.getElementById("companyJobsCount");

    if (!company) {
      if (descEl) descEl.textContent = "Company information not found.";
      return;
    }

    if (nameEl) nameEl.textContent = company.name;
    if (logoEl) {
      logoEl.textContent = company.logo || company.name.substring(0, 3).toUpperCase();
      logoEl.style.backgroundColor = company.logoBg || "#2563EB";
    }
    if (industryEl) industryEl.textContent = company.industry;
    if (locEl) locEl.textContent = company.location;
    if (sizeEl) sizeEl.textContent = company.size || "Enterprise";
    if (foundedEl) foundedEl.textContent = company.founded ? `Founded in ${company.founded}` : "Established";
    if (webEl) {
      webEl.href = company.website || "#";
      webEl.textContent = company.website ? company.website.replace("https://", "") : "Visit Website";
    }
    if (descEl) descEl.textContent = company.description;

    // Load active jobs for this company
    const jobs = Storage.getJobsByCompany(company.id);
    if (jobsCountEl) {
      jobsCountEl.textContent = `(${jobs.length} Active Listing${jobs.length === 1 ? '' : 's'})`;
    }

    if (!jobsListEl) return;

    if (jobs.length === 0) {
      jobsListEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i data-lucide="briefcase" class="icon-xl"></i>
          </div>
          <h4 class="empty-state-title">No Active Openings Currently</h4>
          <p class="empty-state-desc">This company does not have any open positions listed at the moment. Check back soon!</p>
        </div>
      `;
      App.initIcons();
      return;
    }

    const currentUser = Auth.getCurrentUser();
    const isSeeker = Boolean(currentUser && currentUser.role === "seeker");

    jobsListEl.innerHTML = jobs.map(job => {
      const isSaved = isSeeker && Storage.isJobSaved(currentUser.id, job.id);
      const hasApplied = isSeeker && Storage.hasSeekerApplied(currentUser.id, job.id);
      const skills = Array.isArray(job.skills) ? job.skills.slice(0, 4) : [];

      return `
        <article class="job-card mb-3">
          <div class="job-card-header">
            <div>
              <a href="job-details.html?id=${encodeURIComponent(job.id)}" class="job-title-link">
                ${Validation.escapeHTML(job.title)}
              </a>
              <div class="job-meta-list mt-1">
                <span class="job-meta-item"><i data-lucide="map-pin" class="icon-xs"></i> ${Validation.escapeHTML(job.location)}</span>
                <span class="job-meta-item"><i data-lucide="briefcase" class="icon-xs"></i> ${Validation.escapeHTML(job.jobType)}</span>
                <span class="job-meta-item"><i data-lucide="user-check" class="icon-xs"></i> ${Validation.escapeHTML(job.experienceLevel || 'All')}</span>
              </div>
            </div>
            ${isSeeker ? `
              <button class="btn-icon-only btn-save-job ${isSaved ? 'active' : ''}" data-job-id="${Validation.escapeHTML(job.id)}" title="Save Job">
                <i data-lucide="bookmark" class="icon-sm"></i>
              </button>
            ` : ''}
          </div>

          <div class="job-tags-list">
            ${skills.map(s => `<span class="skill-tag">${Validation.escapeHTML(s)}</span>`).join("")}
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
        </article>
      `;
    }).join("");

    App.initIcons();

    // Bind save buttons
    jobsListEl.querySelectorAll(".btn-save-job").forEach(btn => {
      btn.addEventListener("click", () => {
        const jId = btn.getAttribute("data-job-id");
        if (!currentUser) {
          App.showToast("Please log in to save jobs.", "warning");
          return;
        }
        const saved = Storage.toggleSaveJob(currentUser.id, jId);
        btn.classList.toggle("active", saved);
        App.showToast(saved ? "Job saved!" : "Job removed from saved list.", "info");
      });
    });
  }
};
