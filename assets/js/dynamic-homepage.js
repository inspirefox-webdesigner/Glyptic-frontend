// Dynamic Home Page Content Loader
class HomePageLoader {
  constructor() {
    this.apiBaseUrl = `${API_CONFIG.API_BASE}`;
    this.init();
  }

  async init() {
    try {
      await this.loadHomePageContent();
    } catch (error) {
      console.log("Backend not connected, using static content");
      this.loadStaticContent();
    }
  }

  async loadHomePageContent() {
    const response = await fetch(`${this.apiBaseUrl}/home-page`);
    if (!response.ok) throw new Error("Failed to fetch");

    const data = await response.json();
    this.renderHomePageContent(data);
  }

  loadStaticContent() {
    // Static fallback content - keep existing content as is
    console.log("Using static home page content");
  }

  renderHomePageContent(data) {
    const whoWeAre = data.whoWeAre;

    // Find the "Who We Are?" section by ID
    const aboutSection = document.querySelector("#about-sec");
    if (!aboutSection) return;

    // Update image
    if (whoWeAre.image) {
      const imageElement = aboutSection.querySelector(".img-box img");
      if (imageElement) {
        let imageUrl;
        if (
          whoWeAre.image.startsWith("/uploads") ||
          whoWeAre.image.startsWith("http") ||
          whoWeAre.image.startsWith("assets/")
        ) {
          imageUrl = whoWeAre.image.startsWith("/uploads")
            ? `${API_CONFIG.UPLOAD_BASE}${whoWeAre.image}`
            : whoWeAre.image;
        } else {
          imageUrl = `${API_CONFIG.UPLOAD_BASE}/uploads/home-page/${whoWeAre.image}`;
        }
        imageElement.src = imageUrl;
        imageElement.alt = whoWeAre.mainHeading;
      }
    }

    // Update main heading
    if (whoWeAre.mainHeading) {
      const headingElement = aboutSection.querySelector(".sub-title.style2");
      if (headingElement) {
        headingElement.textContent = whoWeAre.mainHeading;
      }
    }

    // Update tagline
    if (whoWeAre.tagline) {
      const taglineElement = aboutSection.querySelector(".sec-title");
      if (taglineElement) {
        taglineElement.textContent = whoWeAre.tagline;
      }
    }

    // Update description
    if (whoWeAre.description) {
      const descriptionElements =
        aboutSection.querySelectorAll(".about-content p");
      if (descriptionElements.length > 0) {
        // Replace the first paragraph with the dynamic description
        descriptionElements[0].textContent = whoWeAre.description;
        // Hide other paragraphs if they exist
        for (let i = 1; i < descriptionElements.length - 1; i++) {
          descriptionElements[i].style.display = "none";
        }
      }
    }

    // Update partner text
    if (whoWeAre.partnerText) {
      const partnerElement = aboutSection.querySelector(
        ".about-content .fw-bold",
      );
      if (partnerElement) {
        partnerElement.textContent = whoWeAre.partnerText;
      }
    }

    // Update certified text
    if (whoWeAre.certifiedText) {
      const certifiedElements = aboutSection.querySelectorAll(
        ".about-feature-card .box-title",
      );
      if (certifiedElements.length > 0) {
        certifiedElements[0].textContent = whoWeAre.certifiedText;
      }
    }

    // Update quality text
    if (whoWeAre.qualityText) {
      const qualityElements = aboutSection.querySelectorAll(
        ".about-feature-card .box-title",
      );
      if (qualityElements.length > 1) {
        qualityElements[1].textContent = whoWeAre.qualityText;
      }
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new HomePageLoader();
});
