// // new code here
// // Dynamic Menu Generation for Products
// // Fetches category/brand order from API and renders menus accordingly

// async function updateProductMenu() {
//   try {
//      const [categoriesRes, brandsRes, catOrderRes, brandOrderRes, hideCatRes, hideBrandRes] = await Promise.all([
//       fetch(`${API_CONFIG.API_BASE}/products/categories`),
//       fetch(`${API_CONFIG.API_BASE}/products/brands`),
//       fetch(`${API_CONFIG.API_BASE}/menu-order/category`),
//       fetch(`${API_CONFIG.API_BASE}/menu-order/brand`),
//       fetch(`${API_CONFIG.API_BASE}/menu-hide/category`),
//       fetch(`${API_CONFIG.API_BASE}/menu-hide/brand`),
//     ]);

//     const allCategories = await categoriesRes.json();
//     const allBrands = await brandsRes.json();
//     const savedCatOrder = await catOrderRes.json();
//     const savedBrandOrder = await brandOrderRes.json();
//      const hiddenCategories = await hideCatRes.json();
//     const hiddenBrands = await hideBrandRes.json();

//     // Apply saved order: saved items first (if still exist), then any new ones
//      const orderedCategories = [
//       ...savedCatOrder.filter((c) => allCategories.includes(c)),
//       ...allCategories.filter((c) => !savedCatOrder.includes(c)),
//     ];
//    const orderedBrands = [
//       ...savedBrandOrder.filter((b) => allBrands.includes(b)),
//       ...allBrands.filter((b) => !savedBrandOrder.includes(b)),
//     ];

//      // Filter out hidden items
//     const categories = orderedCategories.filter((c) => !hiddenCategories.includes(c));
//     const brands = orderedBrands.filter((b) => !hiddenBrands.includes(b));

//     updateDesktopMenu(categories, brands);
//     updateMobileMenu(categories, brands);
//   } catch (error) {
//     console.error("Error updating product menu:", error);
//   }
// }

// function buildCategoryLabel(category) {
//   return category
//     .split("-")
//     .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//     .join(" ");
// }

// function rebuildSubmenu(submenu, items, paramKey, labelFn) {
//   // Clear ALL existing static and dynamic items
//   submenu.innerHTML = "";

//   items.forEach((item) => {
//     const li = document.createElement("li");
//     li.innerHTML = `<a href="products.html?${paramKey}=${item}">${labelFn(item)}</a>`;
//     submenu.appendChild(li);
//   });
// }

// function updateDesktopMenu(categories, brands) {
//   const desktopMenu = document.querySelector(".main-menu > ul");
//   if (!desktopMenu) return;

//   const productsLi = Array.from(desktopMenu.children).find((li) => {
//     const link = li.querySelector('a[href*="products.html"]');
//     return link && !link.href.includes("?");
//   });
//   if (!productsLi) return;

//   const mainSubmenu = productsLi.querySelector(".sub-menu");
//   if (!mainSubmenu) return;

//   // Glyptic Special (categories)
//   const glypticLi = Array.from(mainSubmenu.children).find((li) => {
//     const link = li.querySelector("a");
//     return link && link.textContent.trim().includes("Glyptic Special");
//   });
//   if (glypticLi) {
//     const sub = glypticLi.querySelector(".sub-menu");
//     if (sub) rebuildSubmenu(sub, categories, "category", buildCategoryLabel);
//   }

//   // Authorize Partners (brands)
//   const authorizeLi = Array.from(mainSubmenu.children).find((li) => {
//     const link = li.querySelector("a");
//     return link && link.textContent.trim().includes("Authorize Partners");
//   });
//   if (authorizeLi) {
//     const sub = authorizeLi.querySelector(".sub-menu");
//     if (sub) rebuildSubmenu(sub, brands, "brand", (b) => b);
//   }
// }

// function updateMobileMenu(categories, brands) {
//   const mobileMenu = document.querySelector(".th-mobile-menu > ul");
//   if (!mobileMenu) return;

//   const productsLi = Array.from(mobileMenu.children).find((li) => {
//     const link = li.querySelector('a[href*="products.html"]');
//     return link && !link.href.includes("?");
//   });
//   if (!productsLi) return;

//   const mainSubmenu = productsLi.querySelector(".sub-menu");
//   if (!mainSubmenu) return;

//   const glypticLi = Array.from(mainSubmenu.children).find((li) => {
//     const link = li.querySelector("a");
//     return link && link.textContent.trim().includes("Glyptic Special");
//   });
//   if (glypticLi) {
//     const sub = glypticLi.querySelector(".sub-menu");
//     if (sub) rebuildSubmenu(sub, categories, "category", buildCategoryLabel);
//   }

//   const authorizeLi = Array.from(mainSubmenu.children).find((li) => {
//     const link = li.querySelector("a");
//     return link && link.textContent.trim().includes("Authorize Partners");
//   });
//   if (authorizeLi) {
//     const sub = authorizeLi.querySelector(".sub-menu");
//     if (sub) rebuildSubmenu(sub, brands, "brand", (b) => b);
//   }
// }

// // Initialize on page load
// if (document.readyState === "loading") {
//   document.addEventListener("DOMContentLoaded", updateProductMenu);
// } else {
//   updateProductMenu();
// }











// // old code here

const predefinedCategories = [
  "fire-alarm",
  "digital-pa",
  "flame-smoke-camera",
  "dts-fo-lhs",
  "fire-suppression",
  "linear-heat-cable",
  "smoke-detector-tester",
];

// Predefined brands (Authorize Partners)
const predefinedBrands = [
  "Edwards",
  "Siemens",
  "Notifier",
  "Simplex",
  "TNA",
  "Farenhyt",
  "ESSER",
  "Honeywell",
  "Apollo",
  "Ansul",
  "Kidde",
  "Blazecut",
  "Kentec",
  "Wagner",
  "Bandweaver",
  "Securiton",
];

async function updateProductMenu() {
  try {
    // Fetch categories and brands from API
    const [categoriesRes, brandsRes] = await Promise.all([
      fetch(`${API_CONFIG.API_BASE}/products/categories`),
      fetch(`${API_CONFIG.API_BASE}/products/brands`),
    ]);

    const categories = await categoriesRes.json();
    const brands = await brandsRes.json();

    // Filter predefined items that still exist in API
    const existingPredefinedCategories = predefinedCategories.filter(
      (cat) => categories.includes(cat)
    );
    const existingPredefinedBrands = predefinedBrands.filter(
      (brand) => brands.includes(brand)
    );

    // Get new categories (not in predefined list)
    const newCategories = categories.filter(
      (cat) => !predefinedCategories.includes(cat)
    );

    // Get new brands (not in predefined list)
    const newBrands = brands.filter(
      (brand) => !predefinedBrands.includes(brand)
    );

    // Update desktop menu
    updateDesktopMenu(existingPredefinedCategories, existingPredefinedBrands, newCategories, newBrands);

    // Update mobile menu
    updateMobileMenu(existingPredefinedCategories, existingPredefinedBrands, newCategories, newBrands);
  } catch (error) {
    console.error("Error updating product menu:", error);
  }
}

function updateDesktopMenu(existingPredefinedCategories, existingPredefinedBrands, newCategories, newBrands) {
  const desktopMenu = document.querySelector(".main-menu > ul");
  if (!desktopMenu) return;

  const productsLi = Array.from(desktopMenu.children).find((li) => {
    const link = li.querySelector('a[href*="products.html"]');
    return link && !link.href.includes("?");
  });

  if (!productsLi) return;

  const mainSubmenu = productsLi.querySelector(".sub-menu");
  if (!mainSubmenu) return;

  // Find Glyptic Special
  const glypticLi = Array.from(mainSubmenu.children).find((li) => {
    const link = li.querySelector("a");
    return link && link.textContent.includes("Glyptic Special");
  });

  if (glypticLi) {
    const glypticSubmenu = glypticLi.querySelector(".sub-menu");
    if (glypticSubmenu) {
      // Remove predefined items that no longer exist
      const existingItems = glypticSubmenu.querySelectorAll("li > a");
      existingItems.forEach((link) => {
        const href = link.getAttribute("href");
        const match = href?.match(/category=([^&]+)/);
        if (match) {
          const cat = match[1];
          if (predefinedCategories.includes(cat) && !existingPredefinedCategories.includes(cat)) {
            link.parentElement.remove();
          }
        }
      });

      // Add new categories
      newCategories.forEach((category) => {
        const li = document.createElement("li");
        const label = category
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        li.innerHTML = `<a href="products.html?category=${category}">${label}</a>`;
        glypticSubmenu.appendChild(li);
      });
    }
  }

  // Find Authorize Partners
  const authorizeLi = Array.from(mainSubmenu.children).find((li) => {
    const link = li.querySelector("a");
    return link && link.textContent.includes("Authorize Partners");
  });

  if (authorizeLi) {
    const authorizeSubmenu = authorizeLi.querySelector(".sub-menu");
    if (authorizeSubmenu) {
      // Remove predefined brands that no longer exist
      const existingItems = authorizeSubmenu.querySelectorAll("li > a");
      existingItems.forEach((link) => {
        const href = link.getAttribute("href");
        const match = href?.match(/brand=([^&]+)/);
        if (match) {
          const brandName = match[1];
          if (predefinedBrands.includes(brandName) && !existingPredefinedBrands.includes(brandName)) {
            link.parentElement.remove();
          }
        }
      });

      // Add new brands
      newBrands.forEach((brand) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="products.html?brand=${brand}">${brand}</a>`;
        authorizeSubmenu.appendChild(li);
      });
    }
  }
}

function updateMobileMenu(existingPredefinedCategories, existingPredefinedBrands, newCategories, newBrands) {
  const mobileMenu = document.querySelector(".th-mobile-menu > ul");
  if (!mobileMenu) return;

  const productsLi = Array.from(mobileMenu.children).find((li) => {
    const link = li.querySelector('a[href*="products.html"]');
    return link && !link.href.includes("?");
  });

  if (!productsLi) return;

  const mainSubmenu = productsLi.querySelector(".sub-menu");
  if (!mainSubmenu) return;

  // Find Glyptic Special
  const glypticLi = Array.from(mainSubmenu.children).find((li) => {
    const link = li.querySelector("a");
    return link && link.textContent.includes("Glyptic Special");
  });

  if (glypticLi) {
    const glypticSubmenu = glypticLi.querySelector(".sub-menu");
    if (glypticSubmenu) {
      // Remove predefined items that no longer exist
      const existingItems = glypticSubmenu.querySelectorAll("li > a");
      existingItems.forEach((link) => {
        const href = link.getAttribute("href");
        const match = href?.match(/category=([^&]+)/);
        if (match) {
          const cat = match[1];
          if (predefinedCategories.includes(cat) && !existingPredefinedCategories.includes(cat)) {
            link.parentElement.remove();
          }
        }
      });

      // Add new categories
      newCategories.forEach((category) => {
        const li = document.createElement("li");
        const label = category
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        li.innerHTML = `<a href="products.html?category=${category}">${label}</a>`;
        glypticSubmenu.appendChild(li);
      });
    }
  }

  // Find Authorize Partners
  const authorizeLi = Array.from(mainSubmenu.children).find((li) => {
    const link = li.querySelector("a");
    return link && link.textContent.includes("Authorize Partners");
  });

  if (authorizeLi) {
    const authorizeSubmenu = authorizeLi.querySelector(".sub-menu");
    if (authorizeSubmenu) {
      // Remove predefined brands that no longer exist
      const existingItems = authorizeSubmenu.querySelectorAll("li > a");
      existingItems.forEach((link) => {
        const href = link.getAttribute("href");
        const match = href?.match(/brand=([^&]+)/);
        if (match) {
          const brandName = match[1];
          if (predefinedBrands.includes(brandName) && !existingPredefinedBrands.includes(brandName)) {
            link.parentElement.remove();
          }
        }
      });

      // Add new brands
      newBrands.forEach((brand) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="products.html?brand=${brand}">${brand}</a>`;
        authorizeSubmenu.appendChild(li);
      });
    }
  }
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateProductMenu);
} else {
  updateProductMenu();
}

