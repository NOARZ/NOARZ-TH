// --- Modal Management ---
import { Gallery } from './gallery.js';
import { allItems } from './data.js';

export class Modal {
  constructor(overlayEl, elements, galleryElements) {
    this.overlay = overlayEl;
    this.elements = elements;
    this.gallery = new Gallery(
      galleryElements.gallery,
      galleryElements.prev,
      galleryElements.next,
      galleryElements.dots
    );
    this.currentScriptWindow = null;
    this.currentScriptContent = '';

    // Add custom styles for the close button
    const style = document.createElement('style');
    style.textContent = `
      .modal .close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 12px;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(10px);
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }
      .modal .close:hover {
        background: rgba(0,0,0,0.7);
        transform: scale(1.1) rotate(90deg);
      }
      .modal .close:active {
        transform: scale(0.95) rotate(90deg);
      }
      .modal .close svg {
        width: 20px;
        height: 20px;
        stroke: currentColor;
        stroke-width: 2;
        transition: all 0.3s ease;
      }
    `;
    document.head.appendChild(style);

    // Event listeners with enhanced close button
    this.overlay.addEventListener('click', (e) => {
      if(e.target === this.overlay) this.close();
    });
    
    // Add Escape key support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('open')) {
        this.close();
      }
    });

    this.elements.closeBtn.addEventListener('click', () => this.close());
  }

  open() {
    this.overlay.classList.add('open');
    this.overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  close() {
    // Add closing class to trigger animation
    this.overlay.classList.add('closing');
    
    // Clean gallery state without removing navigation
    if (this.gallery) {
      this.gallery.isAnimating = false;
      if (this.gallery.animationTimeout) {
        clearTimeout(this.gallery.animationTimeout);
        this.gallery.animationTimeout = null;
      }
      
      // Reset styles of existing slides
      if (this.gallery.gallery) {
        const slides = this.gallery.gallery.querySelectorAll('.slide');
        slides.forEach(slide => {
          slide.style.transition = '';
          slide.style.transform = '';
          slide.style.opacity = '';
          slide.style.visibility = '';
        });
        
        // Remove only slides, keeping navigation
        slides.forEach(slide => slide.remove());
      }
    }

    // Wait for animation to complete before removing classes
    setTimeout(() => {
      // Remove modal-specific classes
      this.overlay.classList.remove('open', 'closing', 'active');
      this.overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      
      // Clear any existing script window
      if (this.currentScriptWindow) {
        this.currentScriptWindow.remove();
        this.currentScriptWindow = null;
      }
      
      // Update URL without triggering new modal
      if(location.hash.startsWith('#/detail/')) {
        history.replaceState(null, '', '#');
      }
    }, 400); // Match the CSS animation duration
  }

  setContent(item) {
    // Set title with version if available
    this.elements.title.innerHTML = `
      <div class="title-content">
        <span class="title-text">${item.title}</span>
        ${item.version ? `<span class="version-badge">${item.version}</span>` : ''}
      </div>
    `;
    
    // Add custom styles for title
    const style = document.createElement('style');
    style.textContent = `
      .title-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .title-text {
        font-size: 28px;
        font-weight: 600;
        background: linear-gradient(135deg, #fff 60%, var(--primary));
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      .version-badge {
        padding: 4px 8px;
        border-radius: 8px;
        background: rgba(110, 168, 254, 0.1);
        border: 1px solid rgba(110, 168, 254, 0.2);
        color: var(--primary);
        font-size: 14px;
        font-weight: 500;
      }
    `;
    document.head.appendChild(style);
    
    // Set metadata with enhanced styling
    this.elements.meta.innerHTML = `
      <span class="meta-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        ${item.releaseDate || 'เร็วๆ นี้'}
      </span>
      <span class="meta-divider"></span>
      <span class="meta-item ${item.type === 'scripts' ? 'script-type' : 'runner-type'}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        ${this.labelOf(item.type)}
      </span>
    `;
    
    // Add custom styles for meta items
    style.textContent += `
      .meta-item {
        padding: 6px 12px;
        border-radius: 8px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        transition: all 0.2s ease;
      }
      .meta-item:hover {
        background: rgba(255,255,255,0.08);
        transform: translateY(-1px);
      }
      .script-type {
        background: rgba(126, 231, 135, 0.1);
        border-color: rgba(126, 231, 135, 0.2);
        color: #7ee787;
      }
      .runner-type {
        background: rgba(110, 168, 254, 0.1);
        border-color: rgba(110, 168, 254, 0.2);
        color: #6ea8fe;
      }
      .meta-divider {
        width: 4px;
        height: 4px;
        background: var(--muted);
        border-radius: 50%;
        opacity: 0.4;
      }
    `;

    // Set description with formatted HTML
    let descContent = `<p>${item.desc}</p>`;
    
    // Add changelog if available
    if (item.changelog && item.changelog.length) {
      descContent += `
        <h4>📋 Changelog</h4>
        <ul>
          ${item.changelog.map(log => `<li>${log}</li>`).join('')}
        </ul>
      `;
    }
    
    // Add features if available
    if (item.features && item.features.length) {
      descContent += `
        <h4>✨ Features</h4>
        <ul>
          ${item.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      `;
    }
    
    this.elements.desc.innerHTML = descContent;
    
    // Set tags
    this.elements.tags.innerHTML = '';
    item.tags.forEach(t => {
      const s = document.createElement('span');
      s.className = 'tag';
      s.textContent = t;
      this.elements.tags.appendChild(s);
    });

    // Set up buttons based on item type
    if (item.type === 'runners') {
      // For runners: show download button only
      this.elements.primary.textContent = 'ดาวน์โหลด';
      this.elements.secondary.style.display = 'none';
    } else {
      // For scripts: show both buttons
      this.elements.primary.textContent = 'เปิดสคริปต์';
      this.elements.secondary.textContent = 'คัดลอก';
      this.elements.secondary.style.display = 'inline-flex';
    }

    // Build gallery
    let galleryItems = [];
    
    // Add cover image if available
    if (item.coverImage) {
      galleryItems.push({
        img: item.coverImage,
        caption: 'ภาพปก'
      });
    }
    
    // Add gallery images
    if (item.gallery && item.gallery.length) {
      console.log('Adding gallery images:', item.gallery);
      galleryItems = galleryItems.concat(item.gallery);
    }
    
    // If no images, use gradient backgrounds
    if (galleryItems.length === 0) {
      galleryItems = [
        {h:item.coverHue, caption:'ภาพปก'},
        {h:(item.coverHue+30)%360, caption:'ตัวอย่างหน้าจอ 1'},
        {h:(item.coverHue+60)%360, caption:'ตัวอย่างหน้าจอ 2'}
      ];
    }
    
    console.log('Building gallery with items:', galleryItems);
    this.gallery.buildSlides(galleryItems);
    this.gallery.showSlide(0);

    // Set up button display and text based on item type
    if (item.type === 'runners') {
      // For runners: show only download button
      this.elements.primary.textContent = 'ดาวน์โหลด';
      this.elements.secondary.style.display = 'none';
    } else {
      // For scripts: show both script and copy buttons
      this.elements.primary.textContent = 'เปิดสคริปต์';
      this.elements.secondary.textContent = 'คัดลอก';
      this.elements.secondary.style.display = 'inline-flex';
    }

    this.setupPrimaryButton(item);
    this.setupSecondaryButton(item);
  }

  setupPrimaryButton(item) {
    this.elements.primary.onclick = () => {
      if (item.type === 'runners') {
        // For runners: open URL in new tab
        if (item.url) {
          window.open(item.url, '_blank');
        } else {
          alert('ไม่พบลิงค์สำหรับดาวน์โหลด');
        }
      } else {
        // For scripts: show script content in popup
        if (item.copyText) {
          const scriptWindow = document.createElement('div');
          this.currentScriptWindow = scriptWindow;
          scriptWindow.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--panel);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid var(--border);
            box-shadow: var(--shadow);
            z-index: 1000;
            width: 80%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
          `;
          
          const closeButton = document.createElement('button');
          closeButton.innerHTML = '✕';
          closeButton.style.cssText = `
            position: absolute;
            right: 10px;
            top: 10px;
            background: none;
            border: none;
            color: var(--muted);
            cursor: pointer;
            font-size: 20px;
            padding: 5px;
          `;
          closeButton.onclick = () => scriptWindow.remove();
          
          const content = document.createElement('textarea');
          content.style.cssText = `
            width: 100%;
            height: 300px;
            margin-top: 10px;
            padding: 10px;
            background: var(--bg);
            color: var(--fg);
            border: 1px solid var(--border);
            border-radius: 6px;
            font-family: monospace;
            resize: vertical;
          `;
          content.value = item.copyText;
          content.readOnly = false; // Allow text selection
          
          scriptWindow.appendChild(closeButton);
          scriptWindow.appendChild(content);
          document.body.appendChild(scriptWindow);
          
          // Focus and select all text
          content.focus();
          content.select();
          
          // Add keyboard shortcut listener for copy
          this.currentScriptContent = item.copyText;
          const handleKeyboard = async (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
              e.preventDefault();
              try {
                await navigator.clipboard.writeText(this.currentScriptContent);
                this.elements.secondary.textContent = 'คัดลอกแล้ว!';
                setTimeout(() => {
                  this.elements.secondary.textContent = 'คัดลอก';
                }, 2000);
              } catch (err) {
                alert('ไม่สามารถคัดลอกได้: ' + err);
              }
            }
          };
          
          scriptWindow.addEventListener('keydown', handleKeyboard);
          content.focus(); // Focus the content for keyboard shortcuts
          
          // Remove event listener when closing
          closeButton.onclick = () => {
            scriptWindow.removeEventListener('keydown', handleKeyboard);
            scriptWindow.remove();
          };
        } else if (item.url) {
          window.open(item.url, '_blank');
        }
      }
    };
  }

  setupSecondaryButton(item) {
    this.elements.secondary.onclick = async () => {
      try {
        // Use copyText if available, otherwise use default script content
        const textToCopy = item.copyText || this.getScriptContent(item.id);
        await navigator.clipboard.writeText(textToCopy);
        
        const originalText = this.elements.secondary.textContent;
        this.elements.secondary.textContent = 'คัดลอกแล้ว!';
        setTimeout(() => {
          this.elements.secondary.textContent = originalText;
        }, 2000);
      } catch (err) {
        alert('ไม่สามารถคัดลอกได้: ' + err);
      }
    };
  }

  getScriptContent(id) {
    // Return script content based on script ID
    const scripts = {
      'scr-auto-rename': `# Auto Rename Files

สคริปต์นี้ช่วยในการเปลี่ยนชื่อไฟล์จำนวนมากให้เป็นระเบียบ:

- เพิ่มคำนำหน้าอัตโนมัติ
- ใส่วันที่ในชื่อไฟล์
- จัดรูปแบบให้เป็นมาตรฐานเดียวกัน

วิธีใช้งาน:
1. เลือกโฟลเดอร์ที่ต้องการ
2. กำหนดรูปแบบการตั้งชื่อ
3. ดูตัวอย่างผลลัพธ์
4. กดยืนยันเพื่อเปลี่ยนชื่อ`,
      'scr-csv-json': `# CSV → JSON Converter

แปลงไฟล์ CSV เป็น JSON ได้ง่ายๆ:

- รองรับ CSV หลายรูปแบบ
- ปรับแต่ง delimiter ได้
- เลือก encoding ได้

ขั้นตอน:
1. เลือกไฟล์ CSV
2. ตั้งค่า delimiter
3. เลือก encoding
4. กดแปลงไฟล์`,
      'scr-img-resize': `# Image Resizer

ย่อขนาดรูปภาพแบบ batch:

- รองรับไฟล์หลายนามสกุล
- ปรับขนาดได้หลายรูปแบบ
- คงคุณภาพของรูป

การใช้งาน:
1. ลากรูปที่ต้องการย่อ
2. เลือกขนาดที่ต้องการ
3. กดเริ่มการย่อรูป`,
      'scr-web-scraper': `# Web Scraper

ดึงข้อมูลจากเว็บไซต์:

- ใช้ CSS Selector
- บันทึกเป็น CSV
- ตั้งเวลาดึงข้อมูลได้

วิธีใช้:
1. ใส่ URL เป้าหมาย
2. กำหนด CSS Selector
3. เลือกรูปแบบการบันทึก
4. เริ่มดึงข้อมูล`
    };

    return scripts[id] || `# ${item.title}\n\n${item.desc}`;
  }

  labelOf(type) {
    return type === 'scripts' ? 'Script' : 'ตัวรัน';
  }
}