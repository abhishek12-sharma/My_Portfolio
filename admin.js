/* ============================================================
   admin.js — Portfolio Admin Panel Logic
   ============================================================ */

/* =============================================
   CREDENTIALS
   ============================================= */
const ADMIN_EMAIL    = 'amansharmaa43963114@gmail.com';
const ADMIN_PASSWORD = 'Aman@15464';
const SESSION_KEY    = 'portfolio_admin_session';
const DATA_KEY       = 'portfolio_data';

/* =============================================
   DEFAULT PORTFOLIO DATA
   ============================================= */
const DEFAULT_DATA = {
  profile: {
    name:      'Abhishek Sharma',
    title:     'Full-Stack Developer | ML Enthusiast',
    location:  'Fatehgarh, Uttar Pradesh 209601',
    phone:     '+91 6388762269',
    email:     'amansharmaa43963114@gmail.com',
    linkedin:  'https://www.linkedin.com/in/abhishek',
    github:    'https://github.com/abhishek12-sharma',
    instagram: 'https://www.instagram.com/_abhishek_sharma_12_/',
    photo:     null,          // base64 stored here
    photoPlaces: ['hero'],    // sections to show photo
  },
  projects: [
    {
      id: 'p1', title: 'Human Activity Recognition', category: 'ML / AI',
      dates: 'Jan 2026 – Jul 2026',
      desc: 'AI-powered recognition system using fine-tuned 3D ResNet-18 (R3D-18) model achieving 91% validation accuracy on UCF-101 dataset.',
      tech: 'Python, PyTorch, FastAPI, OpenCV, SQLite',
      github: 'https://github.com/abhishek12-sharma/Spatiotemoral-Human-Activity-Recongniser',
      live: '',
      highlights: '91% accuracy on UCF-101|JWT auth + RBAC with SQLite|Real-time video analytics via OpenCV|Apple MPS / CUDA / CPU support',
    },
    {
      id: 'p2', title: 'ShopEasy', category: 'Java App',
      dates: 'Jan 2026 – Jun 2026',
      desc: '2-tier Java Swing desktop e-commerce application with secure user authentication, dynamic cart management, and real-time order tracking.',
      tech: 'Java, Java Swing, XAMPP, MySQL, MVC',
      github: 'https://github.com/abhishek12-sharma/ShopEasyy',
      live: '',
      highlights: 'Secure authentication & session management|Dynamic cart & real-time order tracking|Category-based product filtering & search|JDBC + MySQL database backend',
    },
    {
      id: 'p3', title: 'Spotify Clone', category: 'Full-Stack',
      dates: 'Feb 2026 – Apr 2026',
      desc: 'Full-stack Spotify-inspired music streaming platform with secure authentication, dynamic playlist management, and real-time audio playback.',
      tech: 'PHP, MySQL, JavaScript, HTML5, CSS3',
      github: 'https://github.com/abhishek12-sharma/Spotify-Clone',
      live: '',
      highlights: 'Secure user authentication & sessions|Song upload & playlist management|Real-time audio playback integration|PHP + MySQL scalable media backend',
    },
  ],
  skills: {
    'Languages':       ['C++','Python','Java','SQL'],
    'Frameworks':      ['React.js','Node.js','Flask','FastAPI','PyTorch','OpenCV'],
    'Databases':       ['MySQL','SQLite'],
    'Tools':           ['Git','GitHub','Linux','HTML5','CSS3','REST APIs'],
    'Domain Skills':   ['DSA (C++)','DBMS','Operating Systems','OOP','Computer Networks'],
    'Soft Skills':     ['Problem Solving','Leadership','Adaptability','Decision Making','Professionalism'],
  },
  certificates: [
    { id:'c1', title:'Data Science 101',                issuer:'Cognitive AI', date:'Jun 2026', link:'https://drive.google.com/file/d/1tmqZP7_ROuDco0BA1pe8wB9URd2ofjaO/view?usp=drive_link', icon:'fa-chart-line' },
    { id:'c2', title:'SQL and Relational Databases 101', issuer:'Cognitive AI', date:'Jun 2026', link:'https://drive.google.com/file/d/1Kc6-ePkfF0_vXB00TDYhsd2rKIh2fl9h/view',         icon:'fa-database' },
    { id:'c3', title:'Java Programming',                 issuer:'iamNeo',      date:'Jun 2026', link:'https://drive.google.com/file/d/1Gt-LPZDkO_21JtMoyh4r03pck7lSyu9B/view',         icon:'fa-brands fa-java' },
    { id:'c4', title:'Data Analysis with Python',        issuer:'Cognitive AI', date:'Jun 2026', link:'https://drive.google.com/file/d/1p2oB0_UTeZPz7jUI0ohCy3-gbYVf38YT/view',         icon:'fa-brands fa-python' },
    { id:'c5', title:'Prompt Engineering for Everyone',  issuer:'Cognitive AI', date:'Jun 2026', link:'https://drive.google.com/file/d/11Gxetgcyp1gpNrv7-PVq-kUX6_PkFxZN/view',         icon:'fa-robot' },
  ],
  education: [
    { id:'e1', degree:'Master of Computer Applications (MCA)', inst:'Lovely Professional University',           period:'2025–2027', score:'8.15', scoreType:'CGPA',       location:'Phagwara, Punjab' },
    { id:'e2', degree:'Bachelor of Science (B.Sc.)',           inst:'Shri Sagar Singh Somwati Mahavidyalaya',   period:'2022–2025', score:'8.21', scoreType:'CGPA',       location:'Bahorikpur, Uttar Pradesh' },
    { id:'e3', degree:'Intermediate (12th Grade)',             inst:'Kendriya Vidyalaya RRC',                   period:'2021–2022', score:'83.20%', scoreType:'Percentage', location:'Fatehgarh, Uttar Pradesh' },
    { id:'e4', degree:'Matriculation (10th Grade)',            inst:'Kendriya Vidyalaya RRC',                   period:'2019–2020', score:'84%',   scoreType:'Percentage', location:'Fatehgarh, Uttar Pradesh' },
  ],
  hobbies: [
    { id:'h1', icon:'fa-cube',               title:"Rubik's Cube Solving", desc:'Speed-cubing enthusiast who loves cracking algorithms, both on screen and off.' },
    { id:'h2', icon:'fa-baseball-bat-ball',  title:'Playing Cricket',      desc:'Team player on the field, bringing the same strategic thinking to every project.' },
    { id:'h3', icon:'fa-film',               title:'Watching Movies',      desc:'Lover of great storytelling, whether on screen or in a well-crafted codebase.' },
    { id:'h4', icon:'fa-book-open-reader',   title:'Reading Epics',        desc:'Captivated by the wisdom in Ramayana, Mahabharata, and classical comics in free time.' },
  ],
};

/* =============================================
   DATA HELPERS  (Supabase + localStorage fallback)
   ============================================= */
async function loadData() {
  try {
    const stored = await window.portfolioDB.load();
    return deepMerge(DEFAULT_DATA, stored);
  } catch(e) {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

async function saveData(data) {
  const ok = await window.portfolioDB.save(data);
  showSaveIndicator(ok);
  return ok;
}

function deepMerge(defaults, overrides) {
  const result = JSON.parse(JSON.stringify(defaults));
  if (!overrides) return result;
  for (const key of Object.keys(overrides)) {
    if (overrides[key] !== null && typeof overrides[key] === 'object' && !Array.isArray(overrides[key])) {
      result[key] = deepMerge(defaults[key] || {}, overrides[key]);
    } else {
      result[key] = overrides[key];
    }
  }
  return result;
}

function uid() {
  return Math.random().toString(36).substr(2, 9);
}

let portfolioData = {}; // loaded async in initAdmin

/* =============================================
   AUTH
   ============================================= */
const loginScreen = document.getElementById('loginScreen');
const adminShell  = document.getElementById('adminShell');

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === 'active';
}
function login() {
  sessionStorage.setItem(SESSION_KEY, 'active');
  loginScreen.style.display = 'none';
  adminShell.style.display  = 'flex';
  initAdmin();
}
function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
}

// Check existing session
if (isLoggedIn()) {
  loginScreen.style.display = 'none';
  adminShell.style.display  = 'flex';
  initAdmin();
}

// Login Form
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;
  const errEl = document.getElementById('loginError');
  const btn   = document.getElementById('loginBtn');

  if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
    btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Success!</span>';
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
    setTimeout(login, 600);
  } else {
    errEl.style.display = 'flex';
    btn.style.animation = 'none';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> <span>Sign In</span>';
    }, 300);
  }
});

// Password toggle
document.getElementById('passEye').addEventListener('click', function() {
  const inp  = document.getElementById('loginPass');
  const icon = document.getElementById('passEyeIcon');
  if (inp.type === 'password') { inp.type = 'text'; icon.className = 'fa-solid fa-eye-slash'; }
  else                         { inp.type = 'password'; icon.className = 'fa-solid fa-eye'; }
});

document.getElementById('logoutBtn').addEventListener('click', () => logout());

/* =============================================
   SAVE INDICATOR
   ============================================= */
function showSaveIndicator(isCloud) {
  const el = document.getElementById('saveIndicator');
  el.innerHTML = isCloud
    ? '<i class="fa-solid fa-cloud-arrow-up"></i> Saved to Cloud'
    : '<i class="fa-solid fa-floppy-disk"></i> Saved Locally';
  el.style.display = 'flex';
  setTimeout(() => { el.style.display = 'none'; }, 3000);
}

/* =============================================
   TOAST
   ============================================= */
function showToast(msg, type = 'success') {
  const icons = { success:'fa-circle-check', error:'fa-circle-xmark', info:'fa-circle-info' };
  const tc = document.getElementById('toastContainer');
  const t  = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fa-solid ${icons[type]}"></i> ${msg}`;
  tc.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(20px)'; t.style.transition='.3s'; setTimeout(()=>t.remove(),300); }, 3000);
}

/* =============================================
   SIDEBAR / NAVIGATION
   ============================================= */
const sidebarEl = document.getElementById('sidebar');
document.getElementById('sidebarToggle').addEventListener('click', () => sidebarEl.classList.toggle('open'));
document.getElementById('sidebarClose').addEventListener('click', () => sidebarEl.classList.remove('open'));

document.querySelectorAll('.snav-item[data-section]').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const sec = item.getAttribute('data-section');
    goSection(sec);
    sidebarEl.classList.remove('open');
  });
});

function goSection(name) {
  document.querySelectorAll('.snav-item').forEach(i => i.classList.remove('active'));
  const navItem = document.querySelector(`.snav-item[data-section="${name}"]`);
  if (navItem) navItem.classList.add('active');
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(`sec-${name}`);
  if (sec) sec.classList.add('active');
  document.getElementById('breadcrumbSection').textContent = navItem?.querySelector('span')?.textContent || name;
}

/* =============================================
   INIT ADMIN
   ============================================= */
async function initAdmin() {
  // Show loading state
  document.getElementById('adminContent').style.opacity = '0.5';

  portfolioData = await loadData();

  document.getElementById('adminContent').style.opacity = '1';

  // DB status badge on dashboard
  const isCloud = window.portfolioDB.isCloud();
  const banner  = document.getElementById('dash-db-status');
  if (banner) {
    banner.innerHTML = isCloud
      ? '<i class="fa-solid fa-cloud" style="color:var(--a-green)"></i> Connected to <strong>Supabase</strong> — changes sync across all devices!'
      : '<i class="fa-solid fa-hard-drive" style="color:var(--a-gold)"></i> Using <strong>localStorage</strong> only. <a href="#" onclick="goSection(\"headings\")">Add Supabase credentials</a> in supabase-config.js to go cloud.';
    banner.style.borderColor = isCloud ? 'rgba(34,197,94,.3)' : 'rgba(245,158,11,.3)';
    banner.style.background  = isCloud ? 'rgba(34,197,94,.07)' : 'rgba(245,158,11,.07)';
  }

  loadProfileUI();
  loadPhotoUI();
  renderProjects();
  renderSkills();
  renderCertificates();
  renderEducation();
  renderHobbies();
  renderContactUI();
  loadVisionUI();
  renderHeadingsForm();
  updateDashStats();
}

/* =============================================
   PROFILE UI
   ============================================= */
function loadProfileUI() {
  const p = portfolioData.profile;
  document.getElementById('prof-name').value      = p.name      || '';
  document.getElementById('prof-title').value     = p.title     || '';
  document.getElementById('prof-location').value  = p.location  || '';
  document.getElementById('prof-phone').value     = p.phone     || '';
  document.getElementById('prof-email').value     = p.email     || '';
  document.getElementById('prof-linkedin').value  = p.linkedin  || '';
  document.getElementById('prof-github').value    = p.github    || '';
  document.getElementById('prof-instagram').value = p.instagram || '';
}

document.getElementById('saveProfileBtn').addEventListener('click', () => {
  portfolioData.profile.name      = document.getElementById('prof-name').value.trim();
  portfolioData.profile.title     = document.getElementById('prof-title').value.trim();
  portfolioData.profile.location  = document.getElementById('prof-location').value.trim();
  portfolioData.profile.phone     = document.getElementById('prof-phone').value.trim();
  portfolioData.profile.email     = document.getElementById('prof-email').value.trim();
  portfolioData.profile.linkedin  = document.getElementById('prof-linkedin').value.trim();
  portfolioData.profile.github    = document.getElementById('prof-github').value.trim();
  portfolioData.profile.instagram = document.getElementById('prof-instagram').value.trim();
  saveData(portfolioData);
  showToast('Profile saved successfully!');
});

/* =============================================
   PHOTO UI
   ============================================= */
function loadPhotoUI() {
  const p = portfolioData.profile;
  applyPhotoToUI(p.photo);

  // Placement checkboxes
  const places = p.photoPlaces || ['hero'];
  document.querySelectorAll('.placement-opt input[type="checkbox"]').forEach(cb => {
    cb.checked = places.includes(cb.value);
  });

  // Size slider — restore saved value
  const savedSize = p.photoSize || 225;
  sizeSlider.value = savedSize;
  updateSliderUI(savedSize);

  // Sync mini-preview
  syncSizePreviewPhoto(p.photo);
}

function applyPhotoToUI(src) {
  if (!src) return;
  // Sidebar avatar
  const sImg = document.getElementById('sidebarAvatarImg');
  sImg.src = src; sImg.style.display = 'block';
  document.getElementById('sidebarAvatarInitials').style.display = 'none';
  // Topbar avatar
  const tImg = document.getElementById('topbarAvatarImg');
  tImg.src = src; tImg.style.display = 'block';
  document.getElementById('topbarAvatarInitials').style.display = 'none';
  // Photo preview circle
  const pImg = document.getElementById('photoPreviewImg');
  pImg.src = src; pImg.style.display = 'block';
  document.getElementById('photoPreviewInitials').style.display = 'none';
}

// File upload
document.getElementById('photoFileInput').addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Photo too large (max 5MB)', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    portfolioData.profile.photo = e.target.result;
    saveData(portfolioData);
    applyPhotoToUI(e.target.result);
    syncSizePreviewPhoto(e.target.result);
    showToast('Photo uploaded! Click "Save Photo Settings" to apply.');
  };
  reader.readAsDataURL(file);
});

document.getElementById('removePhotoBtn').addEventListener('click', () => {
  portfolioData.profile.photo = null;
  saveData(portfolioData);
  document.getElementById('photoPreviewImg').style.display = 'none';
  document.getElementById('photoPreviewInitials').style.display = 'flex';
  document.getElementById('sidebarAvatarImg').style.display = 'none';
  document.getElementById('sidebarAvatarInitials').style.display = 'flex';
  document.getElementById('topbarAvatarImg').style.display = 'none';
  document.getElementById('topbarAvatarInitials').style.display = 'flex';
  showToast('Photo removed.', 'info');
});

/* ── Size Slider ── */
const sizeSlider    = document.getElementById('photoSizeSlider');
const sizeLabel     = document.getElementById('sizeValueLabel');
const sizeCircle    = document.getElementById('sizePreviewCircle');
const sizePreviewImg= document.getElementById('sizePreviewImg');
const presetBtns    = document.querySelectorAll('.preset-btn');

function updateSliderUI(val) {
  const min = parseInt(sizeSlider.min);
  const max = parseInt(sizeSlider.max);
  const pct = ((val - min) / (max - min) * 100).toFixed(1) + '%';
  sizeSlider.style.setProperty('--pct', pct);

  // Label
  sizeLabel.textContent = val;

  // Mini preview circle — scale between 60px (min) and 120px (max)
  const previewSize = Math.round(60 + ((val - min) / (max - min)) * 60);
  sizeCircle.style.width  = previewSize + 'px';
  sizeCircle.style.height = previewSize + 'px';

  // Highlight matching preset
  presetBtns.forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.size) === val);
  });
}

sizeSlider.addEventListener('input', () => {
  updateSliderUI(parseInt(sizeSlider.value));
});

// Preset buttons
presetBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = parseInt(btn.dataset.size);
    sizeSlider.value = val;
    updateSliderUI(val);
  });
});

// Sync mini-preview image when photo is loaded
function syncSizePreviewPhoto(src) {
  if (src) {
    sizePreviewImg.src = src;
    sizePreviewImg.style.display = 'block';
    document.getElementById('sizePreviewInitials').style.display = 'none';
  } else {
    sizePreviewImg.style.display = 'none';
    document.getElementById('sizePreviewInitials').style.display = 'flex';
  }
}

document.getElementById('savePhotoBtn').addEventListener('click', () => {
  const places = [];
  document.querySelectorAll('.placement-opt input[type="checkbox"]').forEach(cb => {
    if (cb.checked) places.push(cb.value);
  });
  portfolioData.profile.photoPlaces = places;
  portfolioData.profile.photoSize   = parseInt(sizeSlider.value);
  saveData(portfolioData);
  showToast('✅ Photo settings saved! Reload portfolio to see changes.');
});

/* =============================================
   PROJECTS
   ============================================= */
function renderProjects() {
  const list = document.getElementById('projectsList');
  const projects = portfolioData.projects;
  if (!projects.length) { list.innerHTML = '<p style="color:var(--a-text2);text-align:center;padding:2rem">No projects yet. Add your first project!</p>'; return; }
  const badgeMap = { 'ML / AI':'badge-ml', 'Java App':'badge-java', 'Full-Stack':'badge-web' };
  list.innerHTML = projects.map(p => `
    <div class="item-card" id="proj-card-${p.id}">
      <div class="item-card-icon"><i class="fa-solid fa-code-branch"></i></div>
      <div class="item-card-info">
        <h4>${esc(p.title)}</h4>
        <p>${esc(p.dates)} &bull; ${esc(p.tech.split(',').slice(0,3).join(', '))}…</p>
        <span class="badge ${badgeMap[p.category]||'badge-web'}">${esc(p.category)}</span>
      </div>
      <div class="item-card-actions">
        <button class="btn-admin btn-edit btn-sm" onclick="openProjectModal('${p.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="btn-admin btn-danger btn-sm" onclick="deleteProject('${p.id}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `).join('');
  document.getElementById('badge-projects').textContent = projects.length;
  document.getElementById('ds-num-projects').textContent = projects.length;
}

document.getElementById('addProjectBtn').addEventListener('click', () => openProjectModal(null));

function openProjectModal(id) {
  const proj = id ? portfolioData.projects.find(p => p.id === id) : null;
  document.getElementById('modalTitle').textContent = proj ? 'Edit Project' : 'Add Project';
  document.getElementById('modalBody').innerHTML = `
    <div class="field-group"><label>Project Title *</label><input id="m-ptitle" value="${esc(proj?.title||'')}"/></div>
    <div class="field-group"><label>Category</label>
      <select id="m-pcat">
        ${['ML / AI','Java App','Full-Stack','Other'].map(c=>`<option ${proj?.category===c?'selected':''}>${c}</option>`).join('')}
      </select></div>
    <div class="field-group"><label>Date Range</label><input id="m-pdates" value="${esc(proj?.dates||'')}" placeholder="Jan 2025 – Dec 2025"/></div>
    <div class="field-group"><label>Description *</label><textarea id="m-pdesc">${esc(proj?.desc||'')}</textarea></div>
    <div class="field-group"><label>Tech Stack (comma-separated)</label><input id="m-ptech" value="${esc(proj?.tech||'')}"/></div>
    <div class="field-group"><label>GitHub URL</label><input id="m-pgit" value="${esc(proj?.github||'')}"/></div>
    <div class="field-group"><label>Live Demo URL (optional)</label><input id="m-plive" value="${esc(proj?.live||'')}"/></div>
    <div class="field-group"><label>Highlights (one per line)</label>
      <textarea id="m-phigh">${(proj?.highlights||'').split('|').join('\n')}</textarea></div>
  `;
  openModal(() => {
    const title = document.getElementById('m-ptitle').value.trim();
    const desc  = document.getElementById('m-pdesc').value.trim();
    if (!title || !desc) { showToast('Title and description are required.', 'error'); return false; }
    const data = {
      id: id || uid(), title, category: document.getElementById('m-pcat').value,
      dates:  document.getElementById('m-pdates').value.trim(),
      desc,
      tech:   document.getElementById('m-ptech').value.trim(),
      github: document.getElementById('m-pgit').value.trim(),
      live:   document.getElementById('m-plive').value.trim(),
      highlights: document.getElementById('m-phigh').value.trim().split('\n').filter(Boolean).join('|'),
    };
    if (id) {
      const idx = portfolioData.projects.findIndex(p => p.id === id);
      portfolioData.projects[idx] = data;
    } else {
      portfolioData.projects.push(data);
    }
    saveData(portfolioData);
    renderProjects();
    showToast(id ? 'Project updated!' : 'Project added!');
    return true;
  });
}

function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  portfolioData.projects = portfolioData.projects.filter(p => p.id !== id);
  saveData(portfolioData);
  renderProjects();
  showToast('Project deleted.', 'info');
}

/* =============================================
   SKILLS
   ============================================= */
function renderSkills() {
  const container = document.getElementById('skillsManager');
  const skills = portfolioData.skills;
  container.innerHTML = Object.entries(skills).map(([cat, list]) => `
    <div class="skills-cat-card">
      <div class="scat-header">
        <div class="scat-title"><i class="fa-solid fa-tags"></i>${esc(cat)}</div>
        <span style="font-size:.75rem;color:var(--a-muted)">${list.length} skills</span>
      </div>
      <div class="skill-tags-admin" id="stags-${slugify(cat)}">
        ${list.map(s => `
          <span class="skill-tag-admin">
            ${esc(s)}
            <button class="skill-tag-remove" onclick="removeSkill('${esc(cat)}','${esc(s)}')" title="Remove">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </span>`).join('')}
      </div>
      <div class="scat-add">
        <input type="text" id="sinput-${slugify(cat)}" placeholder="Add skill…" onkeydown="if(event.key==='Enter')addSkill('${esc(cat)}')"/>
        <button class="btn-admin btn-primary btn-sm" onclick="addSkill('${esc(cat)}')"><i class="fa-solid fa-plus"></i></button>
      </div>
    </div>
  `).join('') + `
    <div class="skills-cat-card" style="border-style:dashed;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.6rem;flex-direction:column;" onclick="addSkillCategory()">
      <i class="fa-solid fa-plus" style="font-size:1.5rem;color:var(--a-accent)"></i>
      <span style="font-size:.85rem;font-weight:600;color:var(--a-text2)">Add Category</span>
    </div>
  `;
  updateSkillCount();
}

function addSkill(cat) {
  const input = document.getElementById(`sinput-${slugify(cat)}`);
  const val = input.value.trim();
  if (!val) return;
  if (!portfolioData.skills[cat]) portfolioData.skills[cat] = [];
  if (portfolioData.skills[cat].includes(val)) { showToast('Skill already exists!','error'); return; }
  portfolioData.skills[cat].push(val);
  saveData(portfolioData);
  input.value = '';
  renderSkills();
  showToast(`"${val}" added to ${cat}!`);
}

function removeSkill(cat, skill) {
  portfolioData.skills[cat] = portfolioData.skills[cat].filter(s => s !== skill);
  saveData(portfolioData);
  renderSkills();
  showToast(`"${skill}" removed.`, 'info');
}

function addSkillCategory() {
  const name = prompt('Enter new skill category name:');
  if (!name) return;
  if (portfolioData.skills[name]) { showToast('Category already exists!','error'); return; }
  portfolioData.skills[name] = [];
  saveData(portfolioData);
  renderSkills();
  showToast(`Category "${name}" added!`);
}

function updateSkillCount() {
  const total = Object.values(portfolioData.skills).reduce((a,b)=>a+b.length,0);
  document.getElementById('ds-num-skills').textContent = total;
}

/* =============================================
   CERTIFICATES
   ============================================= */
function renderCertificates() {
  const list = document.getElementById('certsList');
  const certs = portfolioData.certificates;
  if (!certs.length) { list.innerHTML='<p style="color:var(--a-text2);text-align:center;padding:2rem">No certificates yet.</p>'; return; }
  list.innerHTML = certs.map(c => `
    <div class="item-card" id="cert-card-${c.id}">
      <div class="item-card-icon"><i class="fa-solid fa-certificate"></i></div>
      <div class="item-card-info">
        <h4>${esc(c.title)}</h4>
        <p>${esc(c.issuer)} &bull; ${esc(c.date)}</p>
        ${c.link ? `<a href="${esc(c.link)}" target="_blank" style="font-size:.75rem;color:var(--a-cyan);display:inline-flex;align-items:center;gap:.3rem;margin-top:.3rem"><i class="fa-solid fa-external-link-alt"></i> View Certificate</a>` : ''}
      </div>
      <div class="item-card-actions">
        <button class="btn-admin btn-edit btn-sm" onclick="openCertModal('${c.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="btn-admin btn-danger btn-sm" onclick="deleteCert('${c.id}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `).join('');
  document.getElementById('badge-certs').textContent = certs.length;
  document.getElementById('ds-num-certs').textContent = certs.length;
}

document.getElementById('addCertBtn').addEventListener('click', () => openCertModal(null));

function openCertModal(id) {
  const cert = id ? portfolioData.certificates.find(c => c.id === id) : null;
  document.getElementById('modalTitle').textContent = cert ? 'Edit Certificate' : 'Add Certificate';
  document.getElementById('modalBody').innerHTML = `
    <div class="field-group"><label>Certificate Title *</label><input id="m-ctitle" value="${esc(cert?.title||'')}"/></div>
    <div class="field-group"><label>Issued By *</label><input id="m-cissuer" value="${esc(cert?.issuer||'')}"/></div>
    <div class="field-group"><label>Date</label><input id="m-cdate" value="${esc(cert?.date||'')}" placeholder="Jun 2026"/></div>
    <div class="field-group"><label>Certificate Link (Google Drive / URL)</label><input id="m-clink" value="${esc(cert?.link||'')}" placeholder="https://drive.google.com/…"/></div>
    <div class="field-group"><label>Font Awesome Icon class</label><input id="m-cicon" value="${esc(cert?.icon||'fa-certificate')}" placeholder="e.g. fa-chart-line"/></div>
  `;
  openModal(() => {
    const title  = document.getElementById('m-ctitle').value.trim();
    const issuer = document.getElementById('m-cissuer').value.trim();
    if (!title || !issuer) { showToast('Title and issuer required.','error'); return false; }
    const data = { id: id||uid(), title, issuer, date: document.getElementById('m-cdate').value.trim(), link: document.getElementById('m-clink').value.trim(), icon: document.getElementById('m-cicon').value.trim()||'fa-certificate' };
    if (id) { const idx=portfolioData.certificates.findIndex(c=>c.id===id); portfolioData.certificates[idx]=data; }
    else     { portfolioData.certificates.push(data); }
    saveData(portfolioData);
    renderCertificates();
    showToast(id ? 'Certificate updated!' : 'Certificate added!');
    return true;
  });
}

function deleteCert(id) {
  if (!confirm('Delete this certificate?')) return;
  portfolioData.certificates = portfolioData.certificates.filter(c => c.id !== id);
  saveData(portfolioData);
  renderCertificates();
  showToast('Certificate deleted.','info');
}

/* =============================================
   EDUCATION
   ============================================= */
function renderEducation() {
  const list = document.getElementById('eduList');
  const edu  = portfolioData.education;
  if (!edu.length) { list.innerHTML='<p style="color:var(--a-text2);text-align:center;padding:2rem">No education entries.</p>'; return; }
  list.innerHTML = edu.map(e => `
    <div class="item-card" id="edu-card-${e.id}">
      <div class="item-card-icon"><i class="fa-solid fa-graduation-cap"></i></div>
      <div class="item-card-info">
        <h4>${esc(e.degree)}</h4>
        <p>${esc(e.inst)} &bull; ${esc(e.period)}</p>
        <p style="font-size:.75rem;color:var(--a-accent);margin-top:.2rem">${esc(e.scoreType)}: ${esc(e.score)}</p>
      </div>
      <div class="item-card-actions">
        <button class="btn-admin btn-edit btn-sm" onclick="openEduModal('${e.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="btn-admin btn-danger btn-sm" onclick="deleteEdu('${e.id}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `).join('');
  document.getElementById('ds-num-edu').textContent = edu.length;
}

document.getElementById('addEduBtn').addEventListener('click', () => openEduModal(null));

function openEduModal(id) {
  const edu = id ? portfolioData.education.find(e => e.id === id) : null;
  document.getElementById('modalTitle').textContent = edu ? 'Edit Education' : 'Add Education';
  document.getElementById('modalBody').innerHTML = `
    <div class="field-group"><label>Degree / Course *</label><input id="m-edeg" value="${esc(edu?.degree||'')}"/></div>
    <div class="field-group"><label>Institution *</label><input id="m-einst" value="${esc(edu?.inst||'')}"/></div>
    <div class="field-group"><label>Period (e.g. 2022–2025)</label><input id="m-eperiod" value="${esc(edu?.period||'')}"/></div>
    <div class="field-group"><label>Location</label><input id="m-eloc" value="${esc(edu?.location||'')}"/></div>
    <div class="field-group"><label>Score / Grade</label><input id="m-escore" value="${esc(edu?.score||'')}"/></div>
    <div class="field-group"><label>Score Type</label>
      <select id="m-esctype">
        ${['CGPA','Percentage','Grade'].map(t=>`<option ${edu?.scoreType===t?'selected':''}>${t}</option>`).join('')}
      </select></div>
  `;
  openModal(() => {
    const degree = document.getElementById('m-edeg').value.trim();
    const inst   = document.getElementById('m-einst').value.trim();
    if (!degree || !inst) { showToast('Degree and institution required.','error'); return false; }
    const data = { id: id||uid(), degree, inst, period: document.getElementById('m-eperiod').value.trim(), location: document.getElementById('m-eloc').value.trim(), score: document.getElementById('m-escore').value.trim(), scoreType: document.getElementById('m-esctype').value };
    if (id) { const idx=portfolioData.education.findIndex(e=>e.id===id); portfolioData.education[idx]=data; }
    else     { portfolioData.education.push(data); }
    saveData(portfolioData);
    renderEducation();
    showToast(id ? 'Education updated!' : 'Education entry added!');
    return true;
  });
}

function deleteEdu(id) {
  if (!confirm('Delete this education entry?')) return;
  portfolioData.education = portfolioData.education.filter(e => e.id !== id);
  saveData(portfolioData);
  renderEducation();
  showToast('Entry deleted.','info');
}

/* =============================================
   HOBBIES
   ============================================= */
const HOBBY_ICONS = ['fa-cube','fa-baseball-bat-ball','fa-film','fa-book-open-reader','fa-music','fa-palette','fa-gamepad','fa-camera','fa-bicycle','fa-plane','fa-chess','fa-dumbbell','fa-guitar','fa-leaf','fa-paw','fa-code'];

function renderHobbies() {
  const list = document.getElementById('hobbiesList');
  const hobbies = portfolioData.hobbies;
  if (!hobbies.length) { list.innerHTML='<p style="color:var(--a-text2);text-align:center;padding:2rem;grid-column:1/-1">No hobbies yet.</p>'; return; }
  list.innerHTML = hobbies.map(h => `
    <div class="hobby-item-card" id="hobby-card-${h.id}">
      <div class="hobby-item-icon"><i class="fa-solid ${esc(h.icon)}"></i></div>
      <h4>${esc(h.title)}</h4>
      <p style="font-size:.78rem;color:var(--a-text2);margin-top:.3rem;line-height:1.4">${esc(h.desc)}</p>
      <div class="hobby-item-actions">
        <button class="btn-admin btn-edit btn-sm" onclick="openHobbyModal('${h.id}')"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-admin btn-danger btn-sm" onclick="deleteHobby('${h.id}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `).join('');
}

document.getElementById('addHobbyBtn').addEventListener('click', () => openHobbyModal(null));

function openHobbyModal(id) {
  const h = id ? portfolioData.hobbies.find(h => h.id === id) : null;
  document.getElementById('modalTitle').textContent = h ? 'Edit Hobby' : 'Add Hobby';
  document.getElementById('modalBody').innerHTML = `
    <div class="field-group"><label>Hobby Title *</label><input id="m-htitle" value="${esc(h?.title||'')}"/></div>
    <div class="field-group"><label>Description</label><textarea id="m-hdesc">${esc(h?.desc||'')}</textarea></div>
    <div class="field-group"><label>Icon (Font Awesome class)</label>
      <select id="m-hicon">
        ${HOBBY_ICONS.map(i=>`<option value="${i}" ${h?.icon===i?'selected':''}>${i.replace('fa-','')}</option>`).join('')}
      </select>
    </div>
  `;
  openModal(() => {
    const title = document.getElementById('m-htitle').value.trim();
    if (!title) { showToast('Title is required.','error'); return false; }
    const data = { id: id||uid(), title, desc: document.getElementById('m-hdesc').value.trim(), icon: document.getElementById('m-hicon').value };
    if (id) { const idx=portfolioData.hobbies.findIndex(h=>h.id===id); portfolioData.hobbies[idx]=data; }
    else     { portfolioData.hobbies.push(data); }
    saveData(portfolioData);
    renderHobbies();
    showToast(id ? 'Hobby updated!' : 'Hobby added!');
    return true;
  });
}

function deleteHobby(id) {
  if (!confirm('Delete this hobby?')) return;
  portfolioData.hobbies = portfolioData.hobbies.filter(h => h.id !== id);
  saveData(portfolioData);
  renderHobbies();
  showToast('Hobby deleted.','info');
}

/* =============================================
   CONTACT UI
   ============================================= */
function renderContactUI() {
  const p = portfolioData.profile;
  document.getElementById('contact-phone').value     = p.phone     || '';
  document.getElementById('contact-email').value     = p.email     || '';
  document.getElementById('contact-location').value  = p.location  || '';
  document.getElementById('contact-github').value    = p.github    || '';
  document.getElementById('contact-instagram').value = p.instagram || '';
  document.getElementById('contact-linkedin').value  = p.linkedin  || '';
}

document.getElementById('saveContactBtn').addEventListener('click', () => {
  portfolioData.profile.phone     = document.getElementById('contact-phone').value.trim();
  portfolioData.profile.email     = document.getElementById('contact-email').value.trim();
  portfolioData.profile.location  = document.getElementById('contact-location').value.trim();
  portfolioData.profile.github    = document.getElementById('contact-github').value.trim();
  portfolioData.profile.instagram = document.getElementById('contact-instagram').value.trim();
  portfolioData.profile.linkedin  = document.getElementById('contact-linkedin').value.trim();
  // Also sync to profile fields
  document.getElementById('prof-phone').value     = portfolioData.profile.phone;
  document.getElementById('prof-email').value     = portfolioData.profile.email;
  document.getElementById('prof-location').value  = portfolioData.profile.location;
  document.getElementById('prof-linkedin').value  = portfolioData.profile.linkedin;
  document.getElementById('prof-github').value    = portfolioData.profile.github;
  document.getElementById('prof-instagram').value = portfolioData.profile.instagram;
  saveData(portfolioData);
  showToast('Contact info saved! Reload portfolio to see changes.');
});

/* =============================================
   DASH STATS UPDATE
   ============================================= */
function updateDashStats() {
  document.getElementById('ds-num-projects').textContent = portfolioData.projects.length;
  document.getElementById('ds-num-certs').textContent    = portfolioData.certificates.length;
  document.getElementById('ds-num-edu').textContent      = portfolioData.education.length;
  const total = Object.values(portfolioData.skills).reduce((a,b)=>a+b.length,0);
  document.getElementById('ds-num-skills').textContent   = total;
}

/* =============================================
   MODAL HELPER
   ============================================= */
let modalCallback = null;
const modalOverlay = document.getElementById('modalOverlay');

function openModal(onSave) {
  modalCallback = onSave;
  modalOverlay.style.display = 'flex';
}
function closeModal() {
  modalOverlay.style.display = 'none';
  modalCallback = null;
  document.getElementById('modalBody').innerHTML = '';
}
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancelBtn').addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.getElementById('modalSaveBtn').addEventListener('click', () => {
  if (modalCallback && modalCallback()) closeModal();
});

/* =============================================
   UTILITY
   ============================================= */
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

console.log('%c🛡️ Admin Panel', 'color:#6c63ff;font-size:1.2rem;font-weight:bold;font-family:monospace;');

/* =============================================
   VISION / ABOUT EDITOR
   ============================================= */
const DEFAULT_VISION = {
  p1: `Fueling innovation with every line of code, I am Abhishek Sharma, an MCA student from Lovely Professional University. My journey is deeply rooted in the exciting intersection of Artificial Intelligence, Machine Learning, and Data Analytics. I'm not just studying these fields; I'm actively building a robust foundation in programming, algorithms, databases, and system architecture, always eager to apply this knowledge to practical, real-world challenges.`,
  p2: `I thrive on harnessing the power of data to craft impactful solutions — from predictive modeling that anticipates future trends to AI-driven applications that redefine efficiency. My hands-on approach recently led me to develop a web application that seamlessly integrates AI models, a dynamic React-based UI, and robust backend services to automatically detect faces and mark student attendance.`,
  ambition: `My ambition is to evolve into a leading Data Scientist or AI Engineer, pioneering technology that leaves a lasting positive impact on the world.`,
};

const DEFAULT_ABOUT = {
  p1: `I'm Abhishek Sharma, an MCA student at Lovely Professional University (Phagwara, Punjab) with a strong foundation in computer science and a CGPA of 8.15.`,
  p2: `I enjoy crafting full-stack solutions that combine clean code with intelligent design. From building a 3D ResNet-18 powered activity recognition system to engineering a full Java Swing desktop app, I love tackling real-world problems with technology.`,
  p3: `When I'm not coding, I'm exploring research papers in deep learning, optimizing data pipelines, or participating in competitive programming challenges.`,
};

function loadVisionUI() {
  const v = portfolioData.visionText  || DEFAULT_VISION;
  const a = portfolioData.aboutText   || DEFAULT_ABOUT;
  document.getElementById('vision-p1').value       = v.p1       || DEFAULT_VISION.p1;
  document.getElementById('vision-p2').value       = v.p2       || DEFAULT_VISION.p2;
  document.getElementById('vision-ambition').value = v.ambition || DEFAULT_VISION.ambition;
  document.getElementById('about-p1').value        = a.p1       || DEFAULT_ABOUT.p1;
  document.getElementById('about-p2').value        = a.p2       || DEFAULT_ABOUT.p2;
  document.getElementById('about-p3').value        = a.p3       || DEFAULT_ABOUT.p3;
}

document.getElementById('saveVisionBtn').addEventListener('click', async () => {
  portfolioData.visionText = {
    p1:       document.getElementById('vision-p1').value.trim(),
    p2:       document.getElementById('vision-p2').value.trim(),
    ambition: document.getElementById('vision-ambition').value.trim(),
  };
  await saveData(portfolioData);
  showToast('✅ Vision saved! Reload portfolio to see changes.');
});

document.getElementById('saveAboutBtn').addEventListener('click', async () => {
  portfolioData.aboutText = {
    p1: document.getElementById('about-p1').value.trim(),
    p2: document.getElementById('about-p2').value.trim(),
    p3: document.getElementById('about-p3').value.trim(),
  };
  await saveData(portfolioData);
  showToast('✅ About section saved! Reload portfolio to see changes.');
});

/* =============================================
   SECTION HEADINGS EDITOR
   ============================================= */
const HEADING_FIELDS = [
  { id:'vision',   label:'My Vision',           defTag:'// professional summary', defTitle:'My Vision' },
  { id:'about',    label:'Who I Am',             defTag:'// about me',             defTitle:'Who I Am' },
  { id:'skills',   label:'Skills & Technologies',defTag:'// tech stack',           defTitle:'Skills & Technologies' },
  { id:'projects', label:'Featured Projects',    defTag:'// my work',              defTitle:'Featured Projects' },
  { id:'certs',    label:'Certificates',         defTag:'// achievements',         defTitle:'Certificates & Credentials' },
  { id:'edu',      label:'Education',            defTag:'// academic journey',     defTitle:'My Education' },
  { id:'hobbies',  label:'Hobbies & Interests',  defTag:'// beyond the screen',    defTitle:'Hobbies & Interests' },
  { id:'contact',  label:'Contact',              defTag:'// get in touch',         defTitle:"Let's Connect" },
];

function renderHeadingsForm() {
  const h   = portfolioData.headings || {};
  const el  = document.getElementById('headings-form');
  el.innerHTML = HEADING_FIELDS.map(f => `
    <div class="heading-editor-row">
      <div class="hrow-label">${esc(f.label)}</div>
      <div class="field-group">
        <label>Tag <small>(small line)</small></label>
        <input id="htag-${f.id}" value="${esc(h[f.id]?.tag || f.defTag)}"/>
      </div>
      <div class="field-group">
        <label>Title</label>
        <input id="htitle-${f.id}" value="${esc(h[f.id]?.title || f.defTitle)}"/>
      </div>
    </div>
  `).join('');
}

document.getElementById('saveHeadingsBtn').addEventListener('click', async () => {
  portfolioData.headings = {};
  HEADING_FIELDS.forEach(f => {
    portfolioData.headings[f.id] = {
      tag:   document.getElementById(`htag-${f.id}`).value.trim(),
      title: document.getElementById(`htitle-${f.id}`).value.trim(),
    };
  });
  await saveData(portfolioData);
  showToast('✅ Section headings saved! Reload portfolio to apply.');
});

/* =============================================
   UPDATE ALL SAVE HANDLERS TO ASYNC
   ============================================= */
// Patch all existing click handlers that call saveData to work with async
// (They already call await saveData internally after our change)

