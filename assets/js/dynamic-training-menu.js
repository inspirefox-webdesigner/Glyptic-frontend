// Dynamic Training Menu - Admin માંથી create કરેલા training pages ને menu માં show કરવા માટે

// Static training pages (existing pages)
const staticTrainingPages = [
  { name: 'Training Calender', href: 'Training.html' },
  { name: 'Basic Fire Alarm Training', href: 'basic-fire-alarm-training.html' },
  { name: 'Advanced Fire Alarm Commissioning Training', href: 'advanced-fire-alarm-commissioning-training.html' },
  { name: 'Safety Related Training', href: 'safety-related-training.html' }
];

// Update training menu with dynamic pages
async function updateTrainingMenu() {
  try {
    // Fetch dynamic training pages from API
    const response = await fetch(`${API_CONFIG.API_BASE}/training-pages`);
    const dynamicPages = await response.json();

    // Filter only active pages
    const activePages = dynamicPages.filter(page => page.isActive);

    // Update desktop menu
    updateDesktopTrainingMenu(activePages);

    // Update mobile menu
    updateMobileTrainingMenu(activePages);

  } catch (error) {
    console.error('Error updating training menu:', error);
  }
}

// Update desktop training menu
function updateDesktopTrainingMenu(dynamicPages) {
  const desktopMenu = document.querySelector('.main-menu > ul');
  if (!desktopMenu) return;

  // Find Training menu item
  const trainingLi = Array.from(desktopMenu.children).find(li => {
    const link = li.querySelector('a[href*="Training.html"]');
    return link && link.textContent.trim() === 'Training';
  });

  if (!trainingLi) return;

  const trainingSubmenu = trainingLi.querySelector('.sub-menu');
  if (!trainingSubmenu) return;

  // Clear existing dynamic pages (keep only static ones)
  const existingItems = trainingSubmenu.querySelectorAll('li');
  existingItems.forEach(li => {
    const link = li.querySelector('a');
    if (link) {
      const href = link.getAttribute('href');
      // Remove if it's a dynamic page (training-page.html)
      if (href && href.includes('training-page.html')) {
        li.remove();
      }
    }
  });

  // Add dynamic pages
  dynamicPages.forEach(page => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="training-page.html?page=${page.slug}">${page.pageName}</a>`;
    trainingSubmenu.appendChild(li);
  });
}

// Update mobile training menu
function updateMobileTrainingMenu(dynamicPages) {
  const mobileMenu = document.querySelector('.th-mobile-menu > ul');
  if (!mobileMenu) return;

  // Find Training menu item
  const trainingLi = Array.from(mobileMenu.children).find(li => {
    const link = li.querySelector('a[href*="Training.html"]');
    return link && link.textContent.trim() === 'Training';
  });

  if (!trainingLi) return;

  const trainingSubmenu = trainingLi.querySelector('.sub-menu');
  if (!trainingSubmenu) return;

  // Clear existing dynamic pages (keep only static ones)
  const existingItems = trainingSubmenu.querySelectorAll('li');
  existingItems.forEach(li => {
    const link = li.querySelector('a');
    if (link) {
      const href = link.getAttribute('href');
      // Remove if it's a dynamic page (training-page.html)
      if (href && href.includes('training-page.html')) {
        li.remove();
      }
    }
  });

  // Add dynamic pages
  dynamicPages.forEach(page => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="training-page.html?page=${page.slug}">${page.pageName}</a>`;
    trainingSubmenu.appendChild(li);
  });
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateTrainingMenu);
} else {
  updateTrainingMenu();
}
