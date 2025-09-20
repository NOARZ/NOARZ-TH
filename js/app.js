// --- Main App ---
import { scripts, runners, allItems } from './data.js';
import { Modal } from './modal.js';
import { YouTubeConfig } from './youtubeConfig.js';

export class App {
  constructor() {
    // Initialize YouTube configuration
    this.youtubeConfig = new YouTubeConfig();
    
    // Elements
    this.scriptsGrid = document.getElementById('scriptsGrid');
    this.runnersRow = document.getElementById('runnersRow');
    this.input = document.getElementById('searchInput');
    this.emptyState = document.getElementById('emptyState');
    this.clearBtn = document.getElementById('clearBtn');
    
    // Route
    this.currentRoute = 'home';
    this.routes = ['home', 'scripts', 'runners'];

    // Modal
    this.modal = new Modal(
      document.getElementById('overlay'),
      {
        closeBtn: document.getElementById('closeBtn'),
        title: document.getElementById('mdlTitle'),
        meta: document.getElementById('mdlMeta'),
        desc: document.getElementById('mdlDesc'),
        tags: document.getElementById('mdlTags'),
        primary: document.getElementById('mdlPrimary'),
        secondary: document.getElementById('mdlSecondary')
      },
      {
        gallery: document.getElementById('gallery'),
        prev: document.getElementById('gprev'),
        next: document.getElementById('gnext'),
        dots: document.getElementById('gdots')
      }
    );

    // Event listeners
    this.setupEventListeners();
    this.handleInitialState();
  }

  setupEventListeners() {
    // Search + clear button
    this.input.addEventListener('input', () => {
      this.updateClearBtn();
      this.render(this.input.value);
    });

    this.input.addEventListener('keydown', (e) => {
      if(e.key === 'Escape') {
        this.input.value = '';
        this.updateClearBtn();
        this.render('');
      }
      if(e.key === 'Enter') {
        e.preventDefault();
        this.render(this.input.value);
      }
    });

    this.clearBtn.addEventListener('click', () => {
      this.input.value = '';
      this.input.focus();
      this.updateClearBtn();
      this.render('');
    });

    // Tabs -> hash
    document.querySelectorAll('.nav').forEach(btn => {
      btn.addEventListener('click', () => {
        location.hash = '#/' + btn.dataset.route;
      });
    });

    // Handle hash changes
    window.addEventListener('hashchange', () => this.handleHash());
  }

  handleInitialState() {
    this.handleHash();
    this.updateClearBtn();
  }

  updateClearBtn() {
    this.clearBtn.style.display = this.input.value.length ? 'flex' : 'none';
  }

  setRoute(route) {
    if(!this.routes.includes(route)) route = 'home';
    this.currentRoute = route;

    // Toggle sections
    const secScripts = document.getElementById('secScripts');
    const secRunners = document.getElementById('secRunners');
    if(secScripts) secScripts.style.display = (route === 'home' || route === 'scripts') ? 'block' : 'none';
    if(secRunners) secRunners.style.display = (route === 'home' || route === 'runners') ? 'block' : 'none';

    // Toggle active tab
    document.querySelectorAll('.nav').forEach(btn => {
      const active = btn.dataset.route === route;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-current', active ? 'page' : 'false');
    });

    this.render(this.input.value);
  }

  render(query = '') {
    const q = query.trim().toLowerCase();
    const filterFn = (item) => !q || 
      item.title.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q) || 
      item.tags.join(' ').toLowerCase().includes(q);

    // Cleanup existing cards
    this.scriptsGrid.querySelectorAll('.card').forEach(card => {
      if (card._cleanup) card._cleanup();
    });
    this.runnersRow.querySelectorAll('.card').forEach(card => {
      if (card._cleanup) card._cleanup();
    });

    this.scriptsGrid.innerHTML = '';
    this.runnersRow.innerHTML = '';

    if(this.currentRoute === 'home' || this.currentRoute === 'scripts') {
      scripts.filter(filterFn).forEach(i => this.scriptsGrid.appendChild(this.toCard(i)));
    }
    if(this.currentRoute === 'home' || this.currentRoute === 'runners') {
      runners.filter(filterFn).forEach(i => this.runnersRow.appendChild(this.toCard(i)));
    }

    let total = 0;
    if(this.currentRoute === 'home') {
      total = [...scripts, ...runners].filter(filterFn).length;
    }
    else if(this.currentRoute === 'scripts') {
      total = scripts.filter(filterFn).length;
    }
    else if(this.currentRoute === 'runners') {
      total = runners.filter(filterFn).length;
    }

    document.getElementById('resultCount').textContent =
      `พบ ${total} รายการ${this.currentRoute !== 'home' ? ` ในหมวด ${this.labelRouteThai(this.currentRoute)}` : ''} ที่ตรงกับคำค้นหา`;

    this.emptyState.hidden = total > 0;
  }

  handleHash() {
    const d = location.hash.match(/^#\/detail\/(script|runner)\/(.+)$/);
    if(d) {
      const [_, type, id] = d;
      const item = allItems.find(x => x.id === id && x.type === type);
      if(item) {
        this.modal.setContent(item);
        this.modal.open();
      }
      return;
    }
    const m = location.hash.match(/^#\/(home|scripts|runners)$/);
    if(m) {
      this.setRoute(m[1]);
    } else {
      this.setRoute('home');
    }
  }

  toCard(item) {
    const wrap = document.createElement('article');
    wrap.className = 'card';
    wrap.tabIndex = 0;
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('aria-label', `เปิดรายละเอียด ${item.title}`);
    wrap.dataset.type = item.type;
    wrap.dataset.id = item.id;

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    this.makeThumb(thumb, item);
    
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = this.labelOf(item.type);
    thumb.appendChild(badge);

    const content = document.createElement('div');
    content.className = 'content';
    
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = item.title;
    
    const desc = document.createElement('div');
    desc.className = 'desc';
    desc.textContent = item.desc;

    const tags = document.createElement('div');
    tags.className = 'tags';
    item.tags.forEach(t => {
      const s = document.createElement('span');
      s.className = 'tag';
      s.textContent = t;
      tags.appendChild(s);
    });

    const actions = document.createElement('div');
    actions.className = 'actions';
    const btn1 = document.createElement('button');
    btn1.className = 'btn primary';
    btn1.textContent = 'ดูรายละเอียด';
    actions.append(btn1);

    content.append(title, desc, tags, actions);
    wrap.append(thumb, content);

    // Create handler function that we can remove later
    const handleClick = (e) => {
      if (e.target.closest('.btn')) {
        e.stopPropagation();
      }
      this.openDetail(item.type, item.id);
    };

    const handleKeydown = (e) => {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openDetail(item.type, item.id);
      }
    };

    // Add event listeners with proper cleanup
    wrap.addEventListener('click', handleClick);
    wrap.addEventListener('keydown', handleKeydown);

    // Store handlers for cleanup
    wrap._cleanup = () => {
      wrap.removeEventListener('click', handleClick);
      wrap.removeEventListener('keydown', handleKeydown);
    };

    return wrap;
  }

  makeThumb(el, item) {
    let imageUrl = '';
    
    // Use coverImage if available
    if (item.coverImage) {
      imageUrl = item.coverImage;
    } 
    // Fallback to default images if no coverImage
    else if(item.type === 'script') {
      switch(item.id) {
        case 'scr-auto-rename':
          imageUrl = 'images/Screenshot 2025-09-18 215539.png';
          break;
        case 'scr-csv-json':
          imageUrl = 'images/491281045_1126591606161035_6001529318934245315_n.jpg';
          break;
        case 'scr-img-resize':
          imageUrl = 'images/516885807_4310757832541212_7928891630817145370_n.jpg';
          break;
        case 'scr-web-scraper':
          imageUrl = 'images/651102190127-Solo_Shop_Gaming-removebg-preview.png';
          break;
        case 'scr-new-script':
          imageUrl = 'images/Screenshot 2025-09-18 215539.png';
          break;
      }
    } else if(item.type === 'runner') {
      switch(item.id) {
        case 'run-ping-monitor':
          imageUrl = 'images/Screenshot 2025-09-18 215539.png';
          break;
        case 'run-sysinfo':
          imageUrl = 'images/411ce3ff-b8fe-495e-857f-fdb915a842dd.png';
          break;
      }
    }

    if(imageUrl) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = item.title;
      el.appendChild(img);
    } else {
      el.style.background = this.gradientBG(item.coverHue);
      el.innerHTML = `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden="true">
         <path d="M4 7h16M4 12h12M4 17h10" stroke="white" stroke-width="2" stroke-linecap="round" opacity=".9"/>
       </svg>`;
    }
  }

  gradientBG(h) {
    return `radial-gradient(80% 70% at 65% 20%, hsla(${h},80%,60%,.35), transparent 50%),
            linear-gradient(135deg, hsla(${h},75%,55%,.35), hsla(${(h+60)%360},75%,55%,.2))`;
  }

  labelOf(type) {
    return type === 'scripts' ? 'Script' : 'ตัวรัน';
  }

  labelRouteThai(r) {
    return r === 'scripts' ? 'สคริปต์' : r === 'runners' ? 'ตัวรัน' : 'ทั้งหมด';
  }

  openDetail(type, id) {
    const item = allItems.find(x => x.id === id && x.type === type);
    if(!item) return;
    location.hash = `#/detail/${type}/${id}`;
    this.modal.setContent(item);
    this.modal.open();
  }
}