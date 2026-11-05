const jakartaTime = document.querySelector("#jakarta-time");
const jakartaFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23"
});

function updateJakartaTime() {
  const now = new Date();
  jakartaTime.textContent = jakartaFormatter.format(now);
  jakartaTime.dateTime = now.toISOString();
}

updateJakartaTime();
setInterval(updateJakartaTime, 1000);

const typewriter = document.querySelector(".typewriter");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const jobTitles = ["Data Analyst", "Data Scientist"];

if (typewriter && !prefersReducedMotion) {
  let titleIndex = 0;
  let characterIndex = typewriter.textContent.length;
  let deleting = false;

  function typeNextCharacter() {
    const title = jobTitles[titleIndex];
    typewriter.textContent = title.slice(0, characterIndex);

    if (!deleting && characterIndex === title.length) {
      deleting = true;
      window.setTimeout(typeNextCharacter, 1400);
      return;
    }

    if (deleting && characterIndex === 0) {
      deleting = false;
      titleIndex = (titleIndex + 1) % jobTitles.length;
    }

    characterIndex += deleting ? -1 : 1;
    window.setTimeout(typeNextCharacter, deleting ? 55 : 105);
  }

  window.setTimeout(typeNextCharacter, 1400);
}

const journeyCards = Array.from(document.querySelectorAll(".journey-card"));
let journeyUpdateScheduled = false;

function updateCurrentJourneyCard() {
  const activePanel = document.querySelector(".journey-panel:not([hidden])");
  const experienceSection = document.querySelector(".journey-section");
  const viewportCenter = window.innerHeight / 2;
  const sectionBounds = experienceSection.getBoundingClientRect();
  const centerWithinExperience = sectionBounds.top <= viewportCenter && sectionBounds.bottom >= viewportCenter;
  const visibleCards = centerWithinExperience
    ? Array.from(activePanel.querySelectorAll(".journey-card"))
    : [];
  const currentCard = visibleCards.reduce((closest, card) => {
    const bounds = card.getBoundingClientRect();
    const cardCenter = bounds.top + bounds.height / 2;
    const closestCenter = closest
      ? closest.getBoundingClientRect().top + closest.getBoundingClientRect().height / 2
      : Number.POSITIVE_INFINITY;
    return Math.abs(cardCenter - viewportCenter) < Math.abs(closestCenter - viewportCenter) ? card : closest;
  }, null);

  journeyCards.forEach((card) => {
    card.classList.toggle("is-current", card === currentCard);
  });
}

function scheduleJourneyUpdate() {
  if (journeyUpdateScheduled) {
    return;
  }

  journeyUpdateScheduled = true;
  window.setTimeout(() => {
    journeyUpdateScheduled = false;
    updateCurrentJourneyCard();
  }, 50);
}

window.addEventListener("scroll", scheduleJourneyUpdate, { passive: true });
window.addEventListener("resize", scheduleJourneyUpdate);
updateCurrentJourneyCard();

const journeyTabs = Array.from(document.querySelectorAll(".journey-tab"));

function activateJourneyTab(tab, moveFocus = false) {
  journeyTabs.forEach((journeyTab) => {
    const isActive = journeyTab === tab;
    journeyTab.classList.toggle("is-active", isActive);
    journeyTab.setAttribute("aria-selected", String(isActive));
    journeyTab.tabIndex = isActive ? 0 : -1;

    const panel = document.getElementById(journeyTab.getAttribute("aria-controls"));
    panel.hidden = !isActive;
  });

  updateCurrentJourneyCard();

  if (moveFocus) {
    tab.focus();
  }
}

journeyTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateJourneyTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextTab = journeyTabs[(index + direction + journeyTabs.length) % journeyTabs.length];
    activateJourneyTab(nextTab, true);
  });
});

document.querySelectorAll('.site-menu nav a[href="#experience"], .site-menu nav a[href="#organizations"]').forEach((link) => {
  link.addEventListener("click", () => {
    const tabId = link.hash === "#organizations" ? "#organizations-tab" : "#professional-tab";
    const tab = document.querySelector(tabId);
    if (tab) {
      activateJourneyTab(tab);
    }
  });
});

if (window.location.hash === "#organizations") {
  const organizationsTab = document.querySelector("#organizations-tab");
  if (organizationsTab) {
    activateJourneyTab(organizationsTab);
  }
}

const projectFilters = Array.from(document.querySelectorAll("[data-project-filter]"));
const projectItems = Array.from(document.querySelectorAll(".project-item"));
const projectCount = document.querySelector("#project-count");

projectFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.projectFilter;
    let visibleCount = 0;

    projectFilters.forEach((projectFilter) => {
      const isActive = projectFilter === filter;
      projectFilter.classList.toggle("is-active", isActive);
      projectFilter.setAttribute("aria-pressed", String(isActive));
    });

    projectItems.forEach((item) => {
      const isVisible = category === "all" || item.dataset.category === category;
      item.hidden = !isVisible;
      visibleCount += Number(isVisible);
    });

    if (projectCount) {
      projectCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "project" : "projects"}`;
    }
  });
});
