const knowledgeAreas = {
  AI: {
    name: "Artificial Intelligence",
    code: "AI",
    description: "Covers fundamental concepts in artificial intelligence, machine learning, and intelligent systems.",
  },
  AL: {
    name: "Algorithmic Foundations",
    code: "AL",
    description: "Focuses on algorithm design, analysis, and computational complexity theory.",
  },
  AR: {
    name: "Architecture and Organization",
    code: "AR",
    description: "Covers computer architecture, organization, and hardware-software interface.",
  },
  DM: {
    name: "Data Management",
    code: "DM",
    description: "Encompasses database systems, data modeling, and information management.",
  },
  FPL: {
    name: "Foundations of Programming Languages",
    code: "FPL",
    description: "Studies programming language design, implementation, and theoretical foundations.",
  },
  GIT: {
    name: "Graphics and Interactive Techniques",
    code: "GIT",
    description: "Covers computer graphics, visualization, and interactive system design.",
  },
  HCI: {
    name: "Human-Computer Interaction",
    code: "HCI",
    description: "Focuses on user interface design, usability, and human factors in computing.",
  },
  MSF: {
    name: "Mathematical and Statistical Foundations",
    code: "MSF",
    description: "Provides mathematical and statistical background for computer science.",
  },
  NC: {
    name: "Networking and Communication",
    code: "NC",
    description: "Covers network protocols, distributed systems, and communication technologies.",
  },
  OS: {
    name: "Operating Systems",
    code: "OS",
    description: "Studies operating system design, implementation, and system programming.",
  },
  PDC: {
    name: "Parallel and Distributed Computing",
    code: "PDC",
    description: "Focuses on parallel algorithms, distributed systems, and concurrent programming.",
  },
  SDF: {
    name: "Software Development Fundamentals",
    code: "SDF",
    description: "Covers fundamental programming concepts and software development practices.",
  },
  SE: {
    name: "Software Engineering",
    code: "SE",
    description: "Encompasses software design, development methodologies, and project management.",
  },
  SEC: {
    name: "Security",
    code: "SEC",
    description: "Covers cybersecurity, cryptography, and secure system design.",
  },
  SEP: {
    name: "Society, Ethics, and the Profession",
    code: "SEP",
    description: "Addresses ethical, legal, and social issues in computing.",
  },
  SF: {
    name: "Systems Fundamentals",
    code: "SF",
    description: "Covers fundamental concepts in computer systems and system design.",
  },
  SPD: {
    name: "Specialized Platform Development",
    code: "SPD",
    description: "Focuses on development for specific platforms and specialized environments.",
  },
}

// Global variables
let selectedKA = null

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeEventListeners()
  initializeSearch()
  animateLandingPage()
})

// Landing page animations
function animateLandingPage() {
  const elements = document.querySelectorAll(".landing-content > *")
  elements.forEach((element, index) => {
    element.style.opacity = "0"
    element.style.transform = "translateY(20px)"
    element.style.transition = `all 0.5s ease ${index * 0.1}s`

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
  selectedKA = null
  clearSelection()
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

function initializeEventListeners() {
  const kaItems = document.querySelectorAll(".ka-item")

  kaItems.forEach((item) => {
    item.addEventListener("click", function () {
      const kaCode = this.getAttribute("data-ka")
      selectKnowledgeArea(kaCode)
    })
  })
}

function selectKnowledgeArea(kaCode) {
  clearSelection()

  selectedKA = kaCode
  const kaElement = document.querySelector(`[data-ka="${kaCode}"]`)
  if (kaElement) {
    kaElement.classList.add("selected")
  }

  const selectedTopicElement = document.getElementById("selected-topic")
  const kaData = knowledgeAreas[kaCode]

  if (kaData) {
    selectedTopicElement.innerHTML = `
      <strong>Selected Knowledge Area:</strong> ${kaData.name} <span class="topic-category">(${kaData.code})</span>
      <br><small>${kaData.description}</small>
    `

    showLearningSteps()
  }
}

function clearSelection() {
  const selectedItems = document.querySelectorAll(".ka-item.selected")
  selectedItems.forEach((item) => {
    item.classList.remove("selected")
  })

  document.getElementById("selected-topic").textContent = "Select a Knowledge Area to view its learning path"
  clearLearningSteps()
}

function showLearningSteps() {
  const learningStepsSection = document.getElementById("learning-steps")
  const stepsContainer = document.getElementById("steps-container")

  stepsContainer.innerHTML = ""

  stepsContainer.innerHTML = `
    <div class="step-placeholder">
      <p>Learning sequence will be generated by the backend system.</p>
    </div>
  `

  learningStepsSection.style.display = "block"
}

function clearLearningSteps() {
  const learningStepsSection = document.getElementById("learning-steps")
  learningStepsSection.style.display = "none"
}

function initializeSearch() {
  const searchInput = document.getElementById("topic-search")
  const searchBtn = document.querySelector(".search-btn")

  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim()
    const kaItems = document.querySelectorAll(".ka-item")

    kaItems.forEach((item) => {
      const kaText = item.textContent.toLowerCase()
      const kaCode = item.getAttribute("data-ka")
      const kaData = knowledgeAreas[kaCode]

      const matches =
        kaText.includes(searchTerm) ||
        (kaData && kaData.description.toLowerCase().includes(searchTerm)) ||
        (kaData && kaData.name.toLowerCase().includes(searchTerm))

      if (searchTerm === "" || matches) {
        item.style.display = "flex"
      } else {
        item.style.display = "none"
      }
    })
  }

  searchInput.addEventListener("input", performSearch)
  searchBtn.addEventListener("click", performSearch)

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch()
    }
  })
}
