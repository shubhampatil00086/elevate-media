// ==================================================
// EASY PORTFOLIO EDITING
// ==================================================
/*
  HOW TO ADD A NEW PROJECT:
  1. Put your image inside the 'portfolio/' folder.
  2. Add a new block inside the `projects` array below.
  3. Ensure you provide a unique 'id'.
  
  Example format:
  {
      id: 99,
      title: "Your Title Here",
      category: "Posters", // Use EXACT category names for filtering
      image: "portfolio/your-image.webp",
      description: "Description of the project."
  }
*/

const projects = [
    {
        id: 1,
        title: "Summer Music Festival",
        category: "POSTERS",
        image: "portfolio/poster-01.webp",
        description: "Vibrant promotional poster design for a local outdoor music festival."
    },
    {
        id: 2,
        title: "City Marathon 2026",
        category: "SPORTS / EVENTS",
        image: "portfolio/poster-02.webp",
        description: "Dynamic visual identity and promotional assets for a city marathon."
    },
    {
        id: 3,
        title: "Apex Fitness Brand Guidelines",
        category: "BRANDING",
        image: "portfolio/poster-03.webp",
        description: "Complete visual identity, logo, and typography selection for a modern gym."
    },
    {
        id: 4,
        title: "Tech Startup Instagram Campaign",
        category: "SOCIAL MEDIA",
        image: "portfolio/poster-04.webp",
        description: "A cohesive series of 12 Instagram posts designed for a product launch."
    },
    {
        id: 5,
        title: "Esports Tournament Deck",
        category: "SPONSORSHIP",
        image: "portfolio/poster-05.webp",
        description: "Professional sponsorship pitch deck design for a regional esports league."
    },
    {
        id: 6,
        title: "Urban Cafe Logo",
        category: "LOGOS",
        image: "portfolio/poster-06.webp",
        description: "Minimalist and elegant logo design for a specialty coffee shop."
    },
    {
        id: 7,
        title: "Product Launch Promo",
        category: "VIDEO",
        image: "portfolio/poster-07.webp",
        description: "Short, engaging video edit for social media advertising."
    },
    {
        id: 8,
        title: "Corporate Annual Report",
        category: "OTHER",
        image: "portfolio/poster-08.webp",
        description: "Clean, layout-driven multi-page corporate report design."
    }
];

// ==================================================
// SYSTEM VARIABLES & DOM ELEMENTS
// ==================================================
const featuredGrid = document.getElementById('featured-grid');
const fullGrid = document.getElementById('full-portfolio-grid');
const filterContainer = document.getElementById('filters-container');

// Lightbox Elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxCategory = document.getElementById('lightbox-category');
const lightboxDesc = document.getElementById('lightbox-desc');
let currentProjectIndex = 0;
let currentLightboxArray = []; // Context-aware array (filtered or all)

// ==================================================
// INITIALIZATION
// ==================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Remove Preloader
    const preloader = document.getElementById('preloader');
    if(preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        }, 300);
    }

    // 2. Render Portfolio Grids depending on the page
    if(featuredGrid) renderPortfolio(projects.slice(0, 6), featuredGrid);
    if(fullGrid) {
        renderPortfolio(projects, fullGrid);
        setupFilters();
    }

    // 3. Setup core interactive features
    setupMobileMenu();
    setupStickyNav();
    setupScrollReveal();
    setupWhatsAppForm();
    setupLightboxEvents();
});

// ==================================================
// PORTFOLIO RENDERING & FILTERING
// ==================================================
function renderPortfolio(dataArray, container) {
    container.innerHTML = '';
    
    if(dataArray.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No projects found in this category.</p>';
        return;
    }

    dataArray.forEach(project => {
        const card = document.createElement('div');
        card.className = 'portfolio-card';
        card.innerHTML = `
            <div class="portfolio-img-wrapper">
                <img src="${project.image}" alt="${project.title}" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iIzY2NjY2NiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBNaXNzaW5nPC90ZXh0Pjwvc3ZnPg=='">
                <div class="portfolio-overlay">
                    <span class="small-label">${project.category}</span>
                    <h3>${project.title}</h3>
                    <span class="view-text">VIEW PROJECT</span>
                </div>
            </div>
        `;
        
        // Open lightbox on click
        card.addEventListener('click', () => openLightbox(project.id, dataArray));
        container.appendChild(card);
    });
}

function setupFilters() {
    if(!filterContainer) return;
    const filterBtns = filterContainer.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active class
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Filter Data
            const filterValue = e.target.getAttribute('data-filter');
            if(filterValue === 'ALL') {
                renderPortfolio(projects, fullGrid);
            } else {
                const filtered = projects.filter(p => p.category === filterValue);
                renderPortfolio(filtered, fullGrid);
            }
            
            // Trigger Reveal Animation on newly added items
            setTimeout(setupScrollReveal, 50);
        });
    });
}

// ==================================================
// PROJECT LIGHTBOX
// ==================================================
function openLightbox(projectId, contextArray) {
    if(!lightbox) return;
    currentLightboxArray = contextArray;
    currentProjectIndex = currentLightboxArray.findIndex(p => p.id === projectId);
    
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function updateLightboxContent() {
    const project = currentLightboxArray[currentProjectIndex];
    if(!project) return;

    // Use a fallback image logic similar to inline onerror
    lightboxImg.src = project.image;
    lightboxImg.onerror = function() {
        this.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iIzY2NjY2NiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBNaXNzaW5nPC90ZXh0Pjwvc3ZnPg==";
    };
    
    lightboxTitle.textContent = project.title;
    lightboxCategory.textContent = project.category;
    lightboxDesc.textContent = project.description;
}

function closeLightbox() {
    if(!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function nextProject() {
    if(currentLightboxArray.length === 0) return;
    currentProjectIndex = (currentProjectIndex + 1) % currentLightboxArray.length;
    updateLightboxContent();
}

function prevProject() {
    if(currentLightboxArray.length === 0) return;
    currentProjectIndex = (currentProjectIndex - 1 + currentLightboxArray.length) % currentLightboxArray.length;
    updateLightboxContent();
}

function setupLightboxEvents() {
    if(!lightbox) return;
    
    const closeBtn = document.querySelector('.lightbox-close');
    const nextBtn = document.querySelector('.lightbox-next');
    const prevBtn = document.querySelector('.lightbox-prev');
    
    if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if(nextBtn) nextBtn.addEventListener('click', nextProject);
    if(prevBtn) prevBtn.addEventListener('click', prevProject);
    
    // Close on clicking outside content
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) closeLightbox();
    });
    
    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if(!lightbox.classList.contains('active')) return;
        if(e.key === 'Escape') closeLightbox();
        if(e.key === 'ArrowRight') nextProject();
        if(e.key === 'ArrowLeft') prevProject();
    });
}

// ==================================================
// WHATSAPP CONTACT FORM
// ==================================================
function setupWhatsAppForm() {
    const form = document.getElementById('whatsapp-form');
    if(!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get Form Values
        const name = document.getElementById('name').value.trim();
        const business = document.getElementById('business').value.trim() || 'N/A';
        const whatsapp = document.getElementById('whatsapp').value.trim();
        const email = document.getElementById('email').value.trim() || 'N/A';
        const service = document.getElementById('service').value;
        const budget = document.getElementById('budget').value;
        const deadline = document.getElementById('deadline').value.trim() || 'Not specified';
        const details = document.getElementById('details').value.trim();
        
        // Construct Message
        const message = 
`📩 *NEW PROJECT INQUIRY*

👤 *Name:* ${name}
🏢 *Business:* ${business}
📱 *WhatsApp:* ${whatsapp}
📧 *Email:* ${email}

🎨 *Service:* ${service}
📅 *Deadline:* ${deadline}
💰 *Budget:* ${budget}

📝 *Project Details:*
${details}`;

        // Send to WhatsApp
        const waNumber = '918669241982';
        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
        
        window.open(waUrl, '_blank');
        
        // UI Feedback
        form.reset();
        showToast("Your inquiry is ready in WhatsApp. Please press Send to submit it.");
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if(!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ==================================================
// UI INTERACTIONS & ANIMATIONS
// ==================================================
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if(!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

function setupStickyNav() {
    const header = document.getElementById('header');
    if(!header) return;

    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function setupScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if(reveals.length === 0) return;

    const windowHeight = window.innerHeight;
    
    function checkReveal() {
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 100;
            
            if(elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Trigger once on load
}
