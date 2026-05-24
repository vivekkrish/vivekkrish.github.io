/* ==========================================================================
   EXECUTIVE WEBSITE APP ENGINE - APP.JS
   Vivek Krishnakumar Website Revamp
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let configData = null;
  let canvasAnimationId = null;
  let animationRunning = true;
  let lastCitationsData = null;

  // Social Icon SVGs mapping
  const SOCIAL_ICONS = {
    github: `<svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
    speakerdeck: `<svg viewBox="0 0 24 24"><path d="M22.096 4.341H1.904C.853 4.341 0 5.176 0 6.205v11.589c0 1.03.853 1.865 1.904 1.865h20.192c1.051 0 1.904-.836 1.904-1.865V6.205c0-1.029-.853-1.864-1.904-1.864zM10.16 15.65H4.15V8.349h6.01v7.301zm9.69 0h-8.08V8.349h8.08v7.301z"/></svg>`,
    scholar: `<svg viewBox="0 0 24 24"><path d="M12 2L1 9l11 7 9-5.73V17h2V9L12 2z M12 14.5L3.6 9.16 12 3.82l8.4 5.34L12 14.5z M18 13.92V17c0 .55-.45 1-1 1h-1v-4.08l2-.92z M11 17.5c-2.21 0-4-1.79-4-4v-1.12l4 1.83 4-1.83v1.12c0 2.21-1.79 4-4 4z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
    twitter: `<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    email: `<svg viewBox="0 0 24 24"><path d="M0 3v18h24v-18h-24zm21.514 2l-9.514 7.555-9.514-7.555h19.028zm-19.514 14v-10.909l10 7.941 10-7.941v10.909h-20z"/></svg>`
  };

  // ------------------------------------------------------------------------
  // 1. Initial Setup: Load config.json & Render profile details
  // ------------------------------------------------------------------------
  function initApp() {
    Promise.all([
      fetch('assets/resources/profile_config.json').then(response => {
        if (!response.ok) {
          throw new Error('Config file not found or corrupted.');
        }
        return response.json();
      }),
      fetch('assets/resources/citation_metrics.json').then(response => {
        if (!response.ok) {
          throw new Error('Scholar stats file not found or corrupted.');
        }
        return response.json();
      })
    ])
      .then(([config, scholarStats]) => {
        configData = config;
        applyConfig(config);
        renderScholarStats(scholarStats);
        
        // Setup background canvas
        initBackgroundCanvas();
        
        // Setup Router & Event Listeners
        initRouter();
        initThemeManager();
        initCvAccordion();
        initSkillsRadarChart();
        
        // Dynamically load Google Scholar publications list
        loadPublicationsAndRender();
 
        // Hide Global Loader
        const loader = document.getElementById('site-loader');
        if (loader) {
          loader.classList.add('fade-out');
        }
      })
      .catch(err => {
        console.error('App initialization failed:', err);
        // Fail gracefully: Hide loader and show main page
        const loader = document.getElementById('site-loader');
        if (loader) loader.classList.add('fade-out');
      });
  }

  function applyConfig(config) {
    // 1. Title / Header
    document.title = `${config.name} | ${config.title}`;
    const logoName = document.querySelector('.logo-name');
    if (logoName) logoName.textContent = config.name;
    const logoTitle = document.querySelector('.logo-title');
    if (logoTitle) logoTitle.textContent = config.title;

    // 2. Home Page details
    const profileName = document.getElementById('profile-name');
    if (profileName) profileName.textContent = config.name;
    const profileTitle = document.getElementById('profile-title');
    if (profileTitle) profileTitle.textContent = config.title;
    const profileIntro = document.getElementById('profile-intro');
    if (profileIntro) profileIntro.innerHTML = config.bio;

    // 3. Render Social Icons
    const socialsContainer = document.getElementById('social-links-container');
    if (socialsContainer) {
      socialsContainer.innerHTML = '';
      
      const order = config.socialLinksOrder || Object.keys(config.socials);
      order.forEach(key => {
        let href = '';
        let title = '';
        
        if (key === 'email') {
          href = `mailto:${config.email}`;
          title = config.email;
        } else {
          const handle = config.socials[key];
          if (!handle) return;
          
          if (key === 'github') href = `https://github.com/${handle}`;
          else if (key === 'linkedin') href = `https://linkedin.com/in/${handle}`;
          else if (key === 'speakerdeck') href = `https://speakerdeck.com/${handle}`;
          else if (key === 'scholar') href = `https://scholar.google.com/citations?user=${handle}`;
          else if (key === 'instagram') href = `https://instagram.com/${handle}`;
          else if (key === 'twitter') href = `https://twitter.com/${handle}`;
          title = `${key}.com/${handle}`;
        }
        
        const svg = SOCIAL_ICONS[key] || '';
        const a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener me';
        a.className = 'social-icon-btn';
        a.id = `social-link-${key}`;
        a.setAttribute('aria-label', key);
        a.setAttribute('title', title);
        a.innerHTML = svg;
        socialsContainer.appendChild(a);
      });
    }

  }

  // ------------------------------------------------------------------------
  // 2. Navigation Hash Router
  // ------------------------------------------------------------------------
  function initRouter() {
    const navLinks = document.querySelectorAll('.nav-link');
    const viewPanels = document.querySelectorAll('.view-panel');
    const menuToggle = document.getElementById('menu-toggle-btn');
    const mainNav = document.getElementById('main-navigation');

    // Hamburger Mobile Toggle
    if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        mainNav.classList.toggle('mobile-active');
      });
    }

    function routePage() {
      const hash = window.location.hash || '#home';
      
      // Ensure the hash is a valid CSS selector and is one of our panels
      const validHashes = ['#home', '#about', '#publications', '#cv'];
      if (!validHashes.includes(hash)) {
        return; // Ignore other hashes like BibBase groupby links
      }

      try {
        const targetPanel = document.querySelector(hash);
        if (targetPanel && targetPanel.classList.contains('view-panel')) {
          // Close mobile drawer if active
          if (menuToggle && mainNav) {
            menuToggle.classList.remove('open');
            mainNav.classList.remove('mobile-active');
          }

          // Deactivate all panels and active links
          viewPanels.forEach(panel => {
            panel.classList.remove('active-panel');
          });
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
              link.classList.add('active');
            }
          });

          // Activate target panel
          targetPanel.classList.add('active-panel');
          window.scrollTo(0, 0);

          // Dynamically update page title
          if (configData) {
            const pageName = hash === '#home' ? '' : hash.replace('#', '');
            if (pageName) {
              const displayPage = pageName === 'cv' ? 'CV' : pageName.charAt(0).toUpperCase() + pageName.slice(1);
              document.title = `${displayPage} | ${configData.name} — ${configData.title}`;
            } else {
              document.title = `${configData.name} | ${configData.title}`;
            }
          }



          // Special handling: rebuild citation chart when publications is viewed so it gets correct width
          if (hash === '#publications' && lastCitationsData) {
            buildCitationSvgChart(lastCitationsData);
          }
        }
      } catch (e) {
        console.error("Routing error for hash:", hash, e);
      }
    }

    // Bind routing events
    window.addEventListener('hashchange', routePage);
    window.addEventListener('load', routePage);
    window.addEventListener('resize', () => {
      if (window.location.hash === '#publications' && lastCitationsData) {
        buildCitationSvgChart(lastCitationsData);
      }
    });

    // Initial run
    routePage();
  }

  // ------------------------------------------------------------------------
  // 3. Theme Manager (Dark / Light toggle)
  // ------------------------------------------------------------------------
  function initThemeManager() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (!themeBtn) return;

    // Detect theme preference from localStorage, falling back to system preferences
    const savedTheme = localStorage.getItem('theme');
    let currentTheme = 'dark'; // default

    if (savedTheme) {
      currentTheme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      currentTheme = 'light';
    }

    document.documentElement.setAttribute('data-theme', currentTheme);

    themeBtn.addEventListener('click', () => {
      currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('theme', currentTheme);
    });
  }

  // ------------------------------------------------------------------------
  // 4. Subtle background Canvas Wave / DNA Animation
  // ------------------------------------------------------------------------
  function initBackgroundCanvas() {
    const canvas = document.getElementById('dna-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const toggleBtn = document.getElementById('animation-toggle-btn');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Load animation setting, respecting system preference first
    const savedAnimState = localStorage.getItem('animationState');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (savedAnimState === 'off' || (savedAnimState === null && prefersReducedMotion)) {
      animationRunning = false;
      if (toggleBtn) toggleBtn.textContent = 'Animation: Off';
    }

    // Respond to window resize
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Particle nodes for helix
    const particles = [];
    const particleCount = 28;
    const strandDistance = 60; // Amplitude of sine waves
    const frequency = 0.007; // How tight the wave coils
    
    // Initialize points
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        xIndex: i,
        baseAngle: (i / particleCount) * Math.PI * 4,
        size: 3
      });
    }

    let speedOffset = 0;

    function animate() {
      if (!animationRunning) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Color from CSS custom property
      const dnaColorHex = getComputedStyle(document.documentElement).getPropertyValue('--dna-color').trim();
      ctx.strokeStyle = dnaColorHex || 'rgba(56, 189, 248, 0.12)';
      ctx.fillStyle = dnaColorHex || 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1.5;

      const centerY = height * 0.45;
      const spacingX = width / (particleCount - 1);

      // Draw base pair rungs
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        const angle = p.baseAngle + speedOffset;
        
        // Node coordinates
        const x = i * spacingX;
        const y1 = centerY + Math.sin(angle) * strandDistance;
        const y2 = centerY - Math.sin(angle) * strandDistance;
        
        // Calculate 3D simulated depth (scales size & opacity)
        const cosVal = Math.cos(angle);
        const sizeMultiplier = (cosVal + 1) / 2 * 1.5 + 0.5; // range: 0.5 to 2.0
        const opacity = (cosVal + 1.2) / 2.2 * 0.9 + 0.1; // range: 0.1 to 1.0

        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Rung connecting the two strands
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();

        // Strand 1 Nucleotide Sphere
        ctx.beginPath();
        ctx.arc(x, y1, p.size * sizeMultiplier, 0, Math.PI * 2);
        ctx.fill();

        // Strand 2 Nucleotide Sphere
        ctx.beginPath();
        ctx.arc(x, y2, p.size * sizeMultiplier, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }

      speedOffset += 0.005; // speed of rotation
      canvasAnimationId = requestAnimationFrame(animate);
    }

    // Toggle listener
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        animationRunning = !animationRunning;
        if (animationRunning) {
          toggleBtn.textContent = 'Animation: On';
          localStorage.setItem('animationState', 'on');
          animate();
        } else {
          toggleBtn.textContent = 'Animation: Off';
          localStorage.setItem('animationState', 'off');
          if (canvasAnimationId) {
            cancelAnimationFrame(canvasAnimationId);
          }
          ctx.clearRect(0, 0, width, height);
        }
      });
    }

    // Start rendering
    if (animationRunning) {
      animate();
    }
  }

  // ------------------------------------------------------------------------
  // 5. OpenAlex API Caller & SVG Citation Chart Builder
  // ------------------------------------------------------------------------
  function renderScholarStats(statsData) {
    if (!statsData.scholarStats || !statsData.citationsHistory) return false;

    // Update stats UI
    const citationsVal = statsData.scholarStats.citations;
    const hIndexVal = statsData.scholarStats.hIndex;
    const i10IndexVal = statsData.scholarStats.i10Index;
    const papersVal = statsData.scholarStats.papersCount;

    const citEl = document.querySelector('#stat-citations .stat-num');
    const hEl = document.querySelector('#stat-hindex .stat-num');
    const i10El = document.querySelector('#stat-i10index .stat-num');
    const papEl = document.querySelector('#stat-papers .stat-num');

    if (citEl) citEl.textContent = citationsVal.toLocaleString();
    if (hEl) hEl.textContent = hIndexVal;
    if (i10El) i10El.textContent = i10IndexVal;
    if (papEl) papEl.textContent = papersVal;

    // Update source meta to Google Scholar
    const metaSource = document.querySelector('.chart-meta');
    if (metaSource) {
      metaSource.textContent = 'Source: Google Scholar';
    }

    // Map citationsHistory {year, citations} to {year, cited_by_count} for buildCitationSvgChart
    lastCitationsData = statsData.citationsHistory.map(d => ({
      year: d.year,
      cited_by_count: d.citations
    }));

    buildCitationSvgChart(lastCitationsData);
    return true;
  }



  function buildCitationSvgChart(data) {
    const wrapper = document.getElementById('citations-chart-wrapper');
    if (!wrapper) return;

    wrapper.innerHTML = ''; // Clear loading message

    // Create Tooltip DOM if missing
    let tooltip = document.getElementById('chart-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'chart-tooltip';
      tooltip.className = 'chart-tooltip';
      document.body.appendChild(tooltip);
    }

    const containerWidth = wrapper.clientWidth || 320;
    const containerHeight = 220;

    const padding = { top: 30, right: 15, bottom: 35, left: 15 };
    const chartWidth = containerWidth - padding.left - padding.right;
    const chartHeight = containerHeight - padding.top - padding.bottom;

    // Find maximum citation count to scale bars
    const maxVal = Math.max(...data.map(d => d.cited_by_count));
    const maxValScaled = maxVal === 0 ? 1 : maxVal;

    // Build SVG Markup
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("width", containerWidth);
    svg.setAttribute("height", containerHeight);
    svg.setAttribute("viewBox", `0 0 ${containerWidth} ${containerHeight}`);
    svg.style.overflow = "visible";

    // Horizontal baseline
    const baselineY = padding.top + chartHeight;
    const line = document.createElementNS(svgNamespace, "line");
    line.setAttribute("x1", padding.left);
    line.setAttribute("y1", baselineY);
    line.setAttribute("x2", padding.left + chartWidth);
    line.setAttribute("y2", baselineY);
    line.setAttribute("class", "chart-axis-line");
    svg.appendChild(line);

    // Render bars
    const barSpacing = 4;
    const barWidth = (chartWidth / data.length) - barSpacing;

    data.forEach((d, idx) => {
      const barHeight = (d.cited_by_count / maxValScaled) * chartHeight;
      const x = padding.left + idx * (barWidth + barSpacing);
      const y = baselineY - barHeight;

      // Group for each bar
      const g = document.createElementNS(svgNamespace, "g");

      // Visual Bar Rect
      const rect = document.createElementNS(svgNamespace, "rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", barWidth);
      rect.setAttribute("height", barHeight);
      rect.setAttribute("rx", "2"); // rounded top corner
      rect.setAttribute("class", "chart-bar-rect");
      
      // Interactive Event Listeners for Tooltip
      rect.addEventListener('mouseover', (e) => {
        tooltip.innerHTML = `<strong>${d.year}</strong>: ${d.cited_by_count.toLocaleString()} citations`;
        tooltip.style.opacity = 1;
      });

      rect.addEventListener('mousemove', (e) => {
        tooltip.style.left = (e.pageX + 15) + 'px';
        tooltip.style.top = (e.pageY - 15) + 'px';
      });

      rect.addEventListener('mouseout', () => {
        tooltip.style.opacity = 0;
      });

      g.appendChild(rect);

      // Label: Year (shown for alternating bars if crowded)
      if (data.length <= 10 || idx % 2 === 0 || idx === data.length - 1) {
        const textYear = document.createElementNS(svgNamespace, "text");
        textYear.setAttribute("x", x + barWidth / 2);
        textYear.setAttribute("y", baselineY + 20);
        textYear.setAttribute("class", "chart-text-year");
        textYear.textContent = d.year;
        g.appendChild(textYear);
      }

      // Label: Value atop bar (shown for highlight years or if space permits)
      if (barHeight > 18 && (data.length <= 12 || idx === data.length - 1)) {
        const textVal = document.createElementNS(svgNamespace, "text");
        textVal.setAttribute("x", x + barWidth / 2);
        textVal.setAttribute("y", y - 6);
        textVal.setAttribute("class", "chart-text-value");
        textVal.textContent = d.cited_by_count >= 1000 ? (d.cited_by_count/1000).toFixed(1)+'k' : d.cited_by_count;
        g.appendChild(textVal);
      }

      svg.appendChild(g);
    });

    wrapper.appendChild(svg);
  }

  const RADAR_DATA = [
    { 
      label: "Test Engineering", 
      value: 0.95, 
      skills: ["git & gitflow", "ci/cd (jenkins, github actions)", "test validation & automation", "agile scrum / jira"] 
    },
    { 
      label: "Pipeline Orchestration", 
      value: 0.90, 
      skills: ["bioinformatics pipelines (wdl/nextflow)"] 
    },
    { 
      label: "Genomic Analysis", 
      value: 0.95, 
      skills: ["dragen verification", "clinical research workflows"] 
    },
    { 
      label: "Platform Infra", 
      value: 0.85, 
      skills: ["python", "django", "c# (.net)", "perl", "shell scripting", "html / css / js", "postgresql", "mysql", "amazon web services (aws)", "docker", "grafana", "prometheus"] 
    },
    { 
      label: "GenAI & LLMOps", 
      value: 0.75, 
      skills: ["cursor", "aws bedrock", "opencode", "langfuse"] 
    },
    { 
      label: "Academic Genomics", 
      value: 0.85, 
      skills: ["jcvi", "araport"] 
    }
  ];

  function initSkillsRadarChart() {
    const wrapper = document.getElementById('radar-chart-wrapper');
    if (!wrapper) return;

    wrapper.innerHTML = ''; // Clear loading message

    const size = 260;
    const center = size / 2;
    const rMax = 80;
    const domainCount = RADAR_DATA.length;

    // Angles
    const angles = [];
    for (let i = 0; i < domainCount; i++) {
      angles.push(-Math.PI / 2 + (i * 2 * Math.PI) / domainCount);
    }

    // Build SVG
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.style.overflow = "visible";

    // 1. Draw Concentric Grid Polygons (Levels: 0.25, 0.50, 0.75, 1.0)
    const levels = [0.25, 0.5, 0.75, 1.0];
    levels.forEach(level => {
      const points = angles.map((angle, idx) => {
        const x = center + rMax * level * Math.cos(angle);
        const y = center + rMax * level * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');

      const poly = document.createElementNS(svgNamespace, "polygon");
      poly.setAttribute("points", points);
      poly.setAttribute("class", "radar-grid-poly");
      svg.appendChild(poly);
    });

    // 2. Draw Axis Lines
    const axisLines = [];
    angles.forEach((angle, idx) => {
      const x = center + rMax * Math.cos(angle);
      const y = center + rMax * Math.sin(angle);

      const line = document.createElementNS(svgNamespace, "line");
      line.setAttribute("x1", center);
      line.setAttribute("y1", center);
      line.setAttribute("x2", x);
      line.setAttribute("y2", y);
      line.setAttribute("class", "radar-axis-line");
      line.id = `radar-axis-${idx}`;
      svg.appendChild(line);
      axisLines.push(line);
    });

    // 3. Draw Skill Area Polygon
    const skillPoints = angles.map((angle, idx) => {
      const val = RADAR_DATA[idx].value;
      const x = center + rMax * val * Math.cos(angle);
      const y = center + rMax * val * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');

    const skillArea = document.createElementNS(svgNamespace, "polygon");
    skillArea.setAttribute("points", skillPoints);
    skillArea.setAttribute("class", "radar-area-poly");
    svg.appendChild(skillArea);

    // 4. Draw Vertex Dots
    const dots = [];
    angles.forEach((angle, idx) => {
      const val = RADAR_DATA[idx].value;
      const x = center + rMax * val * Math.cos(angle);
      const y = center + rMax * val * Math.sin(angle);

      const circle = document.createElementNS(svgNamespace, "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", "4");
      circle.setAttribute("class", "radar-vertex-dot");
      circle.id = `radar-dot-${idx}`;
      
      // Bind hover events
      bindHoverToDomain(circle, idx);
      
      svg.appendChild(circle);
      dots.push(circle);
    });

    // 5. Draw Axis Labels
    const labels = [];
    angles.forEach((angle, idx) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      // Fine-tuned placement offset
      let offsetR = rMax + 18;
      if (Math.abs(cos) < 0.1) {
        offsetR = rMax + 14; // vertical labels closer
      }
      
      const x = center + offsetR * cos;
      const y = center + offsetR * sin + (sin > 0.5 ? 4 : (sin < -0.5 ? -2 : 2)); // slight vertical adjustment

      const text = document.createElementNS(svgNamespace, "text");
      text.setAttribute("x", x);
      text.setAttribute("y", y);
      text.setAttribute("class", "radar-label");
      text.id = `radar-label-${idx}`;
      text.textContent = RADAR_DATA[idx].label;

      // Adjust text-anchor based on position
      if (cos > 0.1) {
        text.setAttribute("text-anchor", "start");
      } else if (cos < -0.1) {
        text.setAttribute("text-anchor", "end");
      } else {
        text.setAttribute("text-anchor", "middle");
      }

      bindHoverToDomain(text, idx);

      svg.appendChild(text);
      labels.push(text);
    });

    wrapper.appendChild(svg);

    // Dynamic Skill Tags hover setup
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
      const text = tag.textContent.trim().toLowerCase();
      const domainIdx = RADAR_DATA.findIndex(d => d.skills.includes(text));

      if (domainIdx !== -1) {
        tag.addEventListener('mouseenter', () => {
          highlightDomain(domainIdx);
        });
        tag.addEventListener('mouseleave', () => {
          clearHighlights();
        });
      }
    });

    // Helper to highlight everything in a domain
    function highlightDomain(idx) {
      // 1. Highlight SVG components
      const dot = document.getElementById(`radar-dot-${idx}`);
      const line = document.getElementById(`radar-axis-${idx}`);
      const label = document.getElementById(`radar-label-${idx}`);

      if (dot) dot.classList.add('highlighted');
      if (line) line.classList.add('highlighted');
      if (label) label.classList.add('highlighted');

      // 2. Highlight matching skill tags
      const domainSkills = RADAR_DATA[idx].skills;
      skillTags.forEach(tag => {
        const text = tag.textContent.trim().toLowerCase();
        if (domainSkills.includes(text)) {
          tag.classList.add('accent-highlight');
        }
      });
    }

    function clearHighlights() {
      // Clear SVG highlights
      document.querySelectorAll('.radar-vertex-dot').forEach(el => el.classList.remove('highlighted'));
      document.querySelectorAll('.radar-axis-line').forEach(el => el.classList.remove('highlighted'));
      document.querySelectorAll('.radar-label').forEach(el => el.classList.remove('highlighted'));

      // Clear tag highlights
      skillTags.forEach(tag => tag.classList.remove('accent-highlight'));
    }

    function bindHoverToDomain(element, idx) {
      element.addEventListener('mouseenter', () => {
        highlightDomain(idx);
      });
      element.addEventListener('mouseleave', () => {
        clearHighlights();
      });
    }
  }

  function generateBibtex(pub) {
    let firstAuthor = 'author';
    if (pub.authors) {
      const parts = pub.authors.split(',');
      if (parts.length > 0) {
        const firstPart = parts[0].trim();
        const nameParts = firstPart.split(/\s+/);
        if (nameParts.length > 0) {
          firstAuthor = nameParts[nameParts.length - 1].toLowerCase().replace(/[^a-z0-9]/g, '');
        }
      }
    }
    const year = pub.year || 'unknown';
    let firstTitleWord = 'title';
    if (pub.title) {
      const titleParts = pub.title.trim().split(/\s+/);
      if (titleParts.length > 0) {
        firstTitleWord = titleParts[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      }
    }
    const key = `${firstAuthor}${year}${firstTitleWord}`;
    
    let entry = `@article{${key},\n`;
    entry += `  title={${pub.title}},\n`;
    entry += `  author={${pub.authors}},\n`;
    if (pub.venue) {
      entry += `  journal={${pub.venue}},\n`;
    }
    if (pub.year) {
      entry += `  year={${pub.year}},\n`;
    }
    if (pub.cite_url) {
      entry += `  url={${pub.cite_url}}\n`;
    }
    entry += `}`;
    return entry;
  }

  // ------------------------------------------------------------------------
  // 6. Google Scholar Bibliography Loader
  // ------------------------------------------------------------------------
  function loadPublicationsAndRender() {
    fetch('assets/resources/publications_list.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Publications file not found.');
        }
        return response.json();
      })
      .then(publications => {
        renderPublicationsList(publications);
      })
      .catch(err => {
        console.error('Failed to load publications:', err);
        const wrapper = document.getElementById('bibbase-wrapper');
        if (wrapper) {
          wrapper.innerHTML = 'Unable to fetch publications automatically.<br>' +
            '<span style="font-size: 1.2rem; color: var(--text-muted);">' +
            'Please visit my <a href="https://scholar.google.com/citations?user=cLlRcPYAAAAJ" target="_blank">Google Scholar profile</a> directly.' +
            '</span>';
        }
      });
  }

  function renderPublicationsList(publications) {
    const wrapper = document.getElementById('bibbase-wrapper');
    if (!wrapper) return;

    if (!publications || publications.length === 0) {
      wrapper.innerHTML = '<div class="bib-loading">No publications found.</div>';
      return;
    }

    // Sort by year descending, null years at the end
    publications.sort((a, b) => {
      const yA = a.year || 0;
      const yB = b.year || 0;
      return yB - yA;
    });

    // Group publications by year
    const groups = {};
    publications.forEach(pub => {
      const yearStr = pub.year ? String(pub.year) : 'Other';
      if (!groups[yearStr]) {
        groups[yearStr] = [];
      }
      groups[yearStr].push(pub);
    });

    wrapper.innerHTML = ''; // Clear loading message

    // Render group by group
    const sortedYears = Object.keys(groups).sort((a, b) => {
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      return parseInt(b) - parseInt(a);
    });

    sortedYears.forEach(year => {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'pub-year-group';
      
      const count = groups[year].length;
      const countText = count === 1 ? '1 publication' : `${count} publications`;

      // Header Button
      const headerBtn = document.createElement('button');
      headerBtn.className = 'pub-year-header';
      headerBtn.setAttribute('aria-expanded', 'false');
      headerBtn.innerHTML = `
        <span class="pub-year-title">${year}</span>
        <span class="pub-year-meta">
          <span class="pub-year-count">${countText}</span>
          <span class="pub-year-chevron">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </span>
        </span>
      `;
      groupDiv.appendChild(headerBtn);

      // Collapsible Content container
      const contentDiv = document.createElement('div');
      contentDiv.className = 'pub-year-content';
      
      const pubList = document.createElement('ul');
      pubList.className = 'pub-list';

      groups[year].forEach(pub => {
        const li = document.createElement('li');
        li.className = 'pub-item';

        // Title (link to cite_url if exists, otherwise text)
        let titleHtml = '';
        if (pub.cite_url) {
          titleHtml = `<a href="${pub.cite_url}" target="_blank" rel="noopener" class="pub-title">${pub.title}</a>`;
        } else {
          titleHtml = `<span class="pub-title">${pub.title}</span>`;
        }

        // Highlight author name (e.g. bold "Krishnakumar")
        const highlightedAuthors = highlightAuthorSelf(pub.authors);

        // Citations badge
        let citeBadgeHtml = '';
        if (pub.citations > 0) {
          const cUrl = pub.citations_url || '#';
          citeBadgeHtml = `<a href="${cUrl}" target="_blank" rel="noopener" class="pub-cite-badge" title="View citations on Google Scholar">
            <svg viewBox="0 0 24 24" width="12" height="12"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
            Cited by ${pub.citations.toLocaleString()}
          </a>`;
        }

        // High Impact Highlight check (>= 100 citations)
        let impactBadgeHtml = '';
        if (pub.citations >= 100) {
          li.classList.add('high-impact');
          impactBadgeHtml = `<span class="pub-impact-badge" title="Highly cited publication (100+ citations)">
            <svg viewBox="0 0 24 24" width="10" height="10" style="margin-right: 4px; fill: currentColor;"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            High Impact
          </span>`;
        }

        // Cite (BibTeX copy) Button
        const citeCopyBtnHtml = `<button class="pub-copy-btn" title="Copy BibTeX Citation">
          <svg viewBox="0 0 24 24" width="12" height="12"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          <span class="copy-btn-text">Cite</span>
        </button>`;

        // Venue details
        const venueHtml = pub.venue ? `<span class="pub-venue">${pub.venue}</span>` : '';

        li.innerHTML = `
          <div class="pub-body">
            ${titleHtml}
            <div class="pub-authors">${highlightedAuthors}</div>
            <div class="pub-meta">
              ${venueHtml}
              ${citeBadgeHtml}
              ${impactBadgeHtml}
              ${citeCopyBtnHtml}
            </div>
          </div>
        `;
        pubList.appendChild(li);

        // Bind citation copy click handler
        const copyBtn = li.querySelector('.pub-copy-btn');
        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            const bibtex = generateBibtex(pub);
            navigator.clipboard.writeText(bibtex).then(() => {
              const textSpan = copyBtn.querySelector('.copy-btn-text');
              if (textSpan) {
                textSpan.textContent = 'Copied!';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                  textSpan.textContent = 'Cite';
                  copyBtn.classList.remove('copied');
                }, 2000);
              }
            }).catch(err => {
              console.error('Could not copy BibTeX:', err);
            });
          });
        }
      });

      contentDiv.appendChild(pubList);
      groupDiv.appendChild(contentDiv);
      wrapper.appendChild(groupDiv);

      // Accordion Event Listener
      headerBtn.addEventListener('click', () => {
        const isExpanded = headerBtn.getAttribute('aria-expanded') === 'true';
        headerBtn.setAttribute('aria-expanded', !isExpanded);
        
        if (isExpanded) {
          contentDiv.classList.remove('expanded');
          contentDiv.style.maxHeight = null;
        } else {
          contentDiv.classList.add('expanded');
          contentDiv.style.maxHeight = contentDiv.scrollHeight + 'px';
        }
      });
    });
  }

  function highlightAuthorSelf(authorsStr) {
    if (!authorsStr) return '';
    // Highlight variations of your name in bold
    const regex = /(V\.\s*K\.\s*Krishnakumar|V\.\s*Krishnakumar|V\s*Krishnakumar|Vivek\s+Krishnakumar|Krishnakumar\s+V)/gi;
    return authorsStr.replace(regex, '<strong>$&</strong>');
  }

  function initCvAccordion() {
    const headers = document.querySelectorAll('.cv-company-header');
    headers.forEach(header => {
      const toggleBtn = header.querySelector('.cv-block-toggle');
      const details = header.nextElementSibling;
      if (!toggleBtn || !details) return;

      header.addEventListener('click', (e) => {
        // Ignore clicks on anchor links
        if (e.target.closest('a')) {
          return;
        }

        const currentlyExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', !currentlyExpanded);

        if (currentlyExpanded) {
          details.classList.remove('expanded');
          details.style.maxHeight = null;
        } else {
          details.classList.add('expanded');
          details.style.maxHeight = details.scrollHeight + 'px';
        }
      });

      // Keyboard support for Enter/Space keypress
      header.addEventListener('keydown', (e) => {
        if (e.target.closest('a')) {
          return;
        }
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          header.click();
        }
      });
    });

    // Recalculate dynamic maxHeight of all expanded blocks
    function updateHeights() {
      const expandedDetails = document.querySelectorAll('.cv-block-details.expanded');
      expandedDetails.forEach(details => {
        details.style.maxHeight = details.scrollHeight + 'px';
      });
    }

    // Recalculate on resize
    window.addEventListener('resize', updateHeights);

    // Recalculate when navigating to CV tab (since scrollHeights are 0 when hidden)
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#cv') {
        setTimeout(updateHeights, 100);
      }
    });

    // Check if initial hash is #cv
    if (window.location.hash === '#cv') {
      setTimeout(updateHeights, 100);
    }
  }

  // Run App Initialization
  initApp();
});
