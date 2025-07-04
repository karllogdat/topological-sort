import { to_mermaid } from "./graph_renderers.js";
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

let limitCourse = document.getElementById("limit-course");
let isLimitCourse = limitCourse.checked;

let topics = new Map();

async function fetchTopic() {
  try {
    const res = await fetch("/graph");
    const data = await res.json();

    data.nodes.forEach((node) => {
      const match = node.id.match(/^\[(.+?)\]\s+(.+)$/);
      if (match) {
        const code = match[1];
        const topic = match[2];

        if (!topics.has(code)) {
          topics.set(code, []);
        }

        topics.get(code).push(topic);
      } else {
        console.log(`Invalid node/topic format: ${node.id}`);
      }
    });

    renderAllTopics(topics);
  } catch (error) {
    console.error("Failed to fetch data: ", error);
  }
}

let selectedTopic = null;
let searchTerm = "";

limitCourse.addEventListener("change", () => {
  isLimitCourse = limitCourse.checked;

  if (selectedTopic) {
    // render topic flowchart
    // Find the selected topic element to get its topicId and topicText
    const selectedElem = document.querySelector(".topic-item.selected");
    if (selectedElem) {
      const topicId = selectedElem.getAttribute("data-topic-id");
      const topicText = selectedElem.getAttribute("data-topic-text");
      selectTopic(topicId, topicText);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetchTopic();
  initializeSearch();
  animateLandingPage();
  manageFocus();
});

function animateLandingPage() {
  const elements = document.querySelectorAll(".hero-container > *");
  elements.forEach((element, index) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(40px)";
    element.style.transition = `all 1s ease ${index * 0.3}s`;
    setTimeout(() => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, 100);
  });
}

function proceedToApp() {
  document.getElementById("landing-page").classList.add("hidden");
  document.getElementById("main-app").classList.remove("hidden");
  document.getElementById("main-app").classList.add("fade-in");
}

function backToLanding() {
  document.getElementById("main-app").classList.add("hidden");
  document.getElementById("landing-page").classList.remove("hidden");
  selectedTopic = null;
  clearSelection();
}

function scrollToAbout() {
  document.getElementById("about-section").scrollIntoView({
    behavior: "smooth",
  });
}

function showHelp() {
  document.getElementById("help-modal").style.display = "block";
}

function closeHelp() {
  document.getElementById("help-modal").style.display = "none";
}

window.onclick = (event) => {
  const modal = document.getElementById("help-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

function initializeSearch() {
  const searchInput = document.getElementById("topic-search");
  searchInput.value = "";
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchTerm = this.value.toLowerCase();
      debouncedSearch();
    });
  }
}

function renderAllTopics(topics) {
  const topicList = document.getElementById("topic-list");
  if (!topicList) return;

  let html = "";

  topics.forEach((subjects, course) => {
    html += `<div class="subject-header">${course}</div>`;

    subjects.forEach((topic, index) => {
      const topicId = `${course}-${index}`;
      html += `
            <div class="topic-item" data-topic-id="${topicId}" data-topic-text="${topic}" data-topic="[${course}] ${topic}">
              ${topic}
            </div>
          `;
    });
  });

  topicList.innerHTML = html;

  const topicItems = topicList.querySelectorAll(".topic-item");
  topicItems.forEach((item) => {
    item.addEventListener("click", function () {
      const topicId = this.getAttribute("data-topic-id");
      const topicText = this.getAttribute("data-topic-text");
      selectTopic(topicId, topicText);
    });
  });
}

function filterTopics() {
  const topicList = document.getElementById("topic-list");
  if (!topicList) return;

  let html = "";

  topics.forEach((courseTopics, course) => {
    let filteredTopics = courseTopics;

    if (searchTerm) {
      filteredTopics = courseTopics.filter((topic) => {
        return topic.toLowerCase().includes(searchTerm);
      });
    }

    if (filteredTopics.length > 0) {
      html += `<div class="subject-header">${course}</div>`;

      filteredTopics.forEach((topic) => {
        const originalIndex = courseTopics.indexOf(topic);
        const topicId = `${course}-${originalIndex}`;

        html += `
          <div class="topic-item" data-topic-id="${topicId}" data-topic-text="${topic}" data-topic="[${course}] ${topic}">
            ${topic}
          </div>
        `;
      });
    }
  });

  topicList.innerHTML = html;

  const topicItems = topicList.querySelectorAll(".topic-item");
  topicItems.forEach((item) => {
    item.addEventListener("click", function () {
      const topicId = this.getAttribute("data-topic-id");
      const topicText = this.getAttribute("data-topic-text");
      selectTopic(topicId, topicText);
    });
  });
}

function selectTopic(topicId, topicText) {
  const globalGraph = document.getElementById("graph");
  globalGraph.classList.add("hidden");

  const selectedTopics = document.querySelectorAll(".topic-item.selected");
  selectedTopics.forEach((topic) => topic.classList.remove("selected"));

  isLimitCourse = limitCourse.checked;
  console.log(`Limit to course: ${isLimitCourse}`);

  const currentTopic = document.querySelector(`[data-topic-id="${topicId}"]`);
  if (currentTopic) {
    currentTopic.classList.add("selected");

    const currentTopicData = currentTopic.dataset.topic;

    fetch(`/graph/subgraph?target=${encodeURIComponent(currentTopicData)}`)
      .then((res) => res.json())
      .then((data) => {
        const flowchartContainer = document.getElementById("flowchart");
        let mermaidCode = to_mermaid(data);

        if (isLimitCourse) {
          const courseCode = currentTopicData.match(/^\[(.+?)\]/)[1];

          // Remove nodes that do NOT start with the current course code
          data.nodes = data.nodes.filter((node) =>
            node.id.startsWith(`[${courseCode}]`)
          );
          data.links = data.links.filter(
            (link) =>
              link.source.startsWith(`[${courseCode}]`) &&
              link.target.startsWith(`[${courseCode}]`)
          );

          mermaidCode = to_mermaid(data);
        }

        flowchartContainer.textContent = mermaidCode;

        flowchartContainer.classList.remove("hidden");
        flowchartContainer.removeAttribute("data-processed");

        flowchartContainer.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        if (mermaidCode && mermaidCode.trim().length > 0) {
          mermaid.run({ nodes: [flowchartContainer] });
        }

        // Wait for Mermaid to render SVG, then apply svg-pan-zoom
        setTimeout(() => {
          const svg = flowchartContainer.querySelector("svg");
          if (svg) {
            svg.setAttribute("width", "800");
            svg.setAttribute("height", "600");
            svg.style.width = "1000px";
            svg.style.height = "600px";
            svg.style.maxWidth = "100%";
            svg.style.maxHeight = "100%";
          }
          if (svg && window.svgPanZoom) {
            window.svgPanZoom(svg, {
              zoomEnabled: true,
              controlIconsEnabled: true,
              fit: true,
              center: true,
              minZoom: 0.5,
              maxZoom: 10,
              zoomScaleSensitivity: 1,
            });
          }
        }, 500);
      });

    fetch(`/graph/tsort?target=${encodeURIComponent(currentTopicData)}`)
      .then((res) => res.json())
      .then((data) => {
        const tlist = document.getElementById("tlist");
        tlist.replaceChildren();

        if (isLimitCourse) {
          const courseCode = currentTopicData.match(/^\[(.+?)\]/)[1];

          data = data.filter((topic) => {
            return topic.startsWith(`[${courseCode}]`);
          });
        }

        data.forEach((item) => {
          const itemHTML = document.createElement("li");
          itemHTML.textContent = item;
          tlist.appendChild(itemHTML);
        });
      });
  }

  selectedTopic = topicText;
  updateSelectedTopicDisplay(topicText);
}

function updateSelectedTopicDisplay(topicText = null) {
  const selectedTopicElement = document.getElementById("selected-topic");

  if (topicText) {
    selectedTopicElement.innerHTML = `<strong>Selected Topic:</strong> ${topicText}`;
    selectedTopicElement.style.borderLeftColor = "#3b82f6";
  } else {
    selectedTopicElement.innerHTML =
      "Select a Computer Science topic to generate your learning path";
    selectedTopicElement.style.borderLeftColor = "#d1d5db";
  }
}

function clearSelection() {
  const selectedTopics = document.querySelectorAll(".topic-item.selected");
  selectedTopics.forEach((topic) => topic.classList.remove("selected"));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeHelp();
  }

  if ((event.ctrlKey || event.metaKey) && event.key === "k") {
    event.preventDefault();
    const searchInput = document.getElementById("topic-search");
    if (
      searchInput &&
      !document.getElementById("main-app").classList.contains("hidden")
    ) {
      searchInput.focus();
    }
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
    }
  });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(
    ".feature-card, .about-section, .footer-section"
  );
  animateElements.forEach((el) => observer.observe(el));
});

window.addEventListener("resize", () => {
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");

  if (window.innerWidth <= 768) {
    if (sidebar && mainContent) {
      sidebar.style.maxHeight = "400px";
    }
  } else {
    if (sidebar) {
      sidebar.style.maxHeight = "none";
    }
  }
});

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedSearch = debounce(() => {
  filterTopics();
}, 300);

function manageFocus() {
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  focusableElements.forEach((element) => {
    element.addEventListener("focus", () => {
      element.classList.add("focused");
    });

    element.addEventListener("blur", () => {
      element.classList.remove("focused");
    });
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    proceedToApp,
    backToLanding,
    showHelp,
    closeHelp,
    selectTopic,
    csTopics,
  };
}

window.proceedToApp = proceedToApp;
window.backToLanding = backToLanding;
window.showHelp = showHelp;
