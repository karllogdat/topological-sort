const csTopics = {
  subject1: {
    name: "Subject1",
    topics: ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"],
  },
  subject2: {
    name: "Subject2",
    topics: ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"],
  },
  subject3: {
    name: "Subject3",
    topics: ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"],
  },
  subject4: {
    name: "Subject4",
    topics: ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"],
  },
  subject5: {
    name: "Subject5",
    topics: ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"],
  },
}

let selectedTopic = null
let searchTerm = ""

document.addEventListener("DOMContentLoaded", () => {
  initializeSearch()
  animateLandingPage()
  renderAllTopics()
  manageFocus()
})

function animateLandingPage() {
  const elements = document.querySelectorAll(".hero-container > *")
  elements.forEach((element, index) => {
    element.style.opacity = "0"
    element.style.transform = "translateY(40px)"
    element.style.transition = `all 1s ease ${index * 0.3}s`
    setTimeout(() => {
      element.style.opacity = "1"
      element.style.transform = "translateY(0)"
    }, 100)
  })
}

function proceedToApp() {
  document.getElementById("landing-page").classList.add("hidden")
  document.getElementById("main-app").classList.remove("hidden")
  document.getElementById("main-app").classList.add("fade-in")
}

function backToLanding() {
  document.getElementById("main-app").classList.add("hidden")
  document.getElementById("landing-page").classList.remove("hidden")
  selectedTopic = null
  clearSelection()
}

function scrollToAbout() {
  document.getElementById("about-section").scrollIntoView({
    behavior: "smooth",
  })
}

function showHelp() {
  document.getElementById("help-modal").style.display = "block"
}

function closeHelp() {
  document.getElementById("help-modal").style.display = "none"
}

window.onclick = (event) => {
  const modal = document.getElementById("help-modal")
  if (event.target === modal) {
    modal.style.display = "none"
  }
}

function initializeSearch() {
  const searchInput = document.getElementById("topic-search")
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchTerm = this.value.toLowerCase()
      debouncedSearch()
    })
  }
}

function renderAllTopics() {
  const topicList = document.getElementById("topic-list")
  if (!topicList) return

  let html = ""

  Object.entries(csTopics).forEach(([subjectKey, subjectData]) => {
    html += `<div class="subject-header">${subjectData.name}</div>`

    subjectData.topics.forEach((topic, index) => {
      const topicId = `${subjectKey}-${index}`
      html += `
        <div class="topic-item" data-topic-id="${topicId}" data-topic-text="${topic}">
          • ${topic}
        </div>
      `
    })
  })

  topicList.innerHTML = html

  const topicItems = topicList.querySelectorAll(".topic-item")
  topicItems.forEach((item) => {
    item.addEventListener("click", function () {
      const topicId = this.getAttribute("data-topic-id")
      const topicText = this.getAttribute("data-topic-text")
      selectTopic(topicId, topicText)
    })
  })
}

function filterTopics() {
  const topicList = document.getElementById("topic-list")
  if (!topicList) return

  let html = ""

  Object.entries(csTopics).forEach(([subjectKey, subjectData]) => {
    let filteredTopics = subjectData.topics

    if (searchTerm) {
      filteredTopics = subjectData.topics.filter((topic) => topic.toLowerCase().includes(searchTerm))
    }

    if (filteredTopics.length > 0) {
      html += `<div class="subject-header">${subjectData.name}</div>`

      filteredTopics.forEach((topic) => {
        const originalIndex = subjectData.topics.indexOf(topic)
        const topicId = `${subjectKey}-${originalIndex}`
        html += `
          <div class="topic-item" data-topic-id="${topicId}" data-topic-text="${topic}">
            • ${topic}
          </div>
        `
      })
    }
  })

  topicList.innerHTML = html

  const topicItems = topicList.querySelectorAll(".topic-item")
  topicItems.forEach((item) => {
    item.addEventListener("click", function () {
      const topicId = this.getAttribute("data-topic-id")
      const topicText = this.getAttribute("data-topic-text")
      selectTopic(topicId, topicText)
    })
  })
}

function selectTopic(topicId, topicText) {
  const selectedTopics = document.querySelectorAll(".topic-item.selected")
  selectedTopics.forEach((topic) => topic.classList.remove("selected"))

  const currentTopic = document.querySelector(`[data-topic-id="${topicId}"]`)
  if (currentTopic) {
    currentTopic.classList.add("selected")
  }

  selectedTopic = topicText
  updateSelectedTopicDisplay(topicText)
}

function updateSelectedTopicDisplay(topicText = null) {
  const selectedTopicElement = document.getElementById("selected-topic")

  if (topicText) {
    selectedTopicElement.innerHTML = `<strong>Selected Topic:</strong> ${topicText}`
    selectedTopicElement.style.borderLeftColor = "#3b82f6"
  } else {
    selectedTopicElement.innerHTML = "Select a Computer Science topic to generate your learning path"
    selectedTopicElement.style.borderLeftColor = "#d1d5db"
  }
}

function clearSelection() {
  const selectedTopics = document.querySelectorAll(".topic-item.selected")
  selectedTopics.forEach((topic) => topic.classList.remove("selected"))
}

document.addEventListener("keydown", (event) => {
 
  if (event.key === "Escape") {
    closeHelp()
  }

  if ((event.ctrlKey || event.metaKey) && event.key === "k") {
    event.preventDefault()
    const searchInput = document.getElementById("topic-search")
    if (searchInput && !document.getElementById("main-app").classList.contains("hidden")) {
      searchInput.focus()
    }
  }
})

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in")
    }
  })
}, observerOptions)

document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(".feature-card, .about-section, .footer-section")
  animateElements.forEach((el) => observer.observe(el))
})

window.addEventListener("resize", () => {
  const sidebar = document.querySelector(".sidebar")
  const mainContent = document.querySelector(".main-content")

  if (window.innerWidth <= 768) {
    if (sidebar && mainContent) {
      sidebar.style.maxHeight = "400px"
    }
  } else {
    if (sidebar) {
      sidebar.style.maxHeight = "none"
    }
  }
})

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const debouncedSearch = debounce(() => {
  filterTopics()
}, 300)

function manageFocus() {
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )

  focusableElements.forEach((element) => {
    element.addEventListener("focus", () => {
      element.classList.add("focused")
    })

    element.addEventListener("blur", () => {
      element.classList.remove("focused")
    })
  })
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    proceedToApp,
    backToLanding,
    showHelp,
    closeHelp,
    selectTopic,
    csTopics,
  }
}
