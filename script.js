document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const apiKeyModal = document.getElementById("apiKeyModal")
  const appContainer = document.getElementById("appContainer")
  const apiKeyInput = document.getElementById("apiKeyInput")
  const saveApiKeyBtn = document.getElementById("saveApiKey")
  const settingsBtn = document.getElementById("settingsButton")
  const settingsModal = document.getElementById("settingsModal")
  const closeSettingsBtn = document.getElementById("closeSettings")
  const apiKeySettings = document.getElementById("apiKeySettings")
  const updateApiKeyBtn = document.getElementById("updateApiKey")
  const darkModeToggle = document.getElementById("darkModeToggle")
  const messageInput = document.getElementById("messageInput")
  const sendMessageBtn = document.getElementById("sendMessage")
  const chatMessages = document.getElementById("chatMessages")
  const clearChatBtn = document.getElementById("clearChat")
  const voiceInputBtn = document.getElementById("voiceInput")
  const fileUploadBtn = document.getElementById("fileUpload")
  const fileInput = document.getElementById("fileInput")

  // Create mobile menu elements
  let mobileMenuButton = null
  let sidebarOverlay = null
  let isMobileMenuOpen = false

  function createMobileElements() {
    // Create mobile menu button
    if (!mobileMenuButton) {
      mobileMenuButton = document.createElement("button")
      mobileMenuButton.className = "mobile-menu-button"
      mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>'
      mobileMenuButton.setAttribute("aria-label", "Toggle menu")
      mobileMenuButton.setAttribute("type", "button")
      document.body.appendChild(mobileMenuButton)
    }

    // Create sidebar overlay
    if (!sidebarOverlay) {
      sidebarOverlay = document.createElement("div")
      sidebarOverlay.className = "sidebar-overlay"
      sidebarOverlay.setAttribute("aria-hidden", "true")
      document.body.appendChild(sidebarOverlay)
    }
  }

  function toggleMobileMenu() {
    const sidebar = document.querySelector(".sidebar")

    if (!sidebar) return

    isMobileMenuOpen = !isMobileMenuOpen

    console.log("Toggling menu:", isMobileMenuOpen) // Debug log

    if (isMobileMenuOpen) {
      sidebar.classList.add("mobile-open")
      sidebarOverlay.classList.add("active")
      mobileMenuButton.innerHTML = '<i class="fas fa-times"></i>'
      document.body.style.overflow = "hidden"
    } else {
      sidebar.classList.remove("mobile-open")
      sidebarOverlay.classList.remove("active")
      mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>'
      document.body.style.overflow = ""
    }
  }

  function closeMobileMenu() {
    if (isMobileMenuOpen) {
      toggleMobileMenu()
    }
  }

  function setupMobileMenu() {
    if (!mobileMenuButton || !sidebarOverlay) return

    // Remove existing listeners
    mobileMenuButton.replaceWith(mobileMenuButton.cloneNode(true))
    mobileMenuButton = document.querySelector(".mobile-menu-button")

    sidebarOverlay.replaceWith(sidebarOverlay.cloneNode(true))
    sidebarOverlay = document.querySelector(".sidebar-overlay")

    // Add click listeners
    mobileMenuButton.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("Menu button clicked") // Debug log
      toggleMobileMenu()
    })

    sidebarOverlay.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("Overlay clicked") // Debug log
      closeMobileMenu()
    })
  }

  function handleResize() {
    // Adjust main content for mobile input positioning
    const mainContent = document.querySelector(".main-content")
    if (window.innerWidth <= 768 && mainContent) {
      mainContent.style.paddingBottom = "80px" // Space for fixed input
    } else if (mainContent) {
      mainContent.style.paddingBottom = "0"
    }
  }

  // Initial setup
  handleResize()
  window.addEventListener("resize", handleResize)

  // Check if API key exists in localStorage
  const apiKey = localStorage.getItem("openRouterApiKey")

  // Check for dark mode preference
  const darkModePreference = localStorage.getItem("darkMode") === "true"
  if (darkModePreference) {
    document.body.classList.add("dark-mode")
    darkModeToggle.checked = true
  }

  // Show appropriate screen based on API key existence
  if (apiKey) {
    apiKeyModal.classList.remove("active")
    appContainer.classList.add("active")
    apiKeySettings.value = "••••••••••••••••"
  } else {
    apiKeyModal.classList.add("active")
    appContainer.classList.remove("active")
  }

  // Save API Key
  saveApiKeyBtn.addEventListener("click", () => {
    const key = apiKeyInput.value.trim()
    if (key) {
      localStorage.setItem("openRouterApiKey", key)
      apiKeyModal.classList.remove("active")
      appContainer.classList.add("active")
      apiKeySettings.value = "••••••••••••••••"
    } else {
      shakeElement(apiKeyInput)
    }
  })

  // Update API Key
  updateApiKeyBtn.addEventListener("click", () => {
    const key = apiKeySettings.value.trim()
    if (key && key !== "••••••••••••••••") {
      localStorage.setItem("openRouterApiKey", key)
      apiKeySettings.value = "••••••••••••••••"
      showToast("API key updated successfully")
    } else {
      shakeElement(apiKeySettings)
    }
  })

  // Settings Modal
  settingsBtn.addEventListener("click", () => {
    settingsModal.classList.add("active")
  })

  closeSettingsBtn.addEventListener("click", () => {
    settingsModal.classList.remove("active")
  })

  // Dark Mode Toggle
  darkModeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", darkModeToggle.checked)
    localStorage.setItem("darkMode", darkModeToggle.checked)
  })

  // Auto-resize textarea
  messageInput.addEventListener("input", () => {
    messageInput.style.height = "auto"
    messageInput.style.height = messageInput.scrollHeight + "px"
  })

  // Send message on Enter (but allow Shift+Enter for new line)
  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  })

  // Send Message Button
  sendMessageBtn.addEventListener("click", sendMessage)

  // Clear Chat
  clearChatBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      chatMessages.innerHTML = ""
      addSystemMessage("Chat history cleared.")
    }
  })

  // Voice Input
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  voiceInputBtn.addEventListener("click", () => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true

      recognition.onstart = () => {
        voiceInputBtn.innerHTML = '<i class="fas fa-stop"></i>'
        voiceInputBtn.classList.add("active")
        showToast("Listening...")
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        messageInput.value = transcript
        messageInput.dispatchEvent(new Event("input"))
      }

      recognition.onend = () => {
        voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i>'
        voiceInputBtn.classList.remove("active")
      }

      recognition.start()
    } else {
      showToast("Speech recognition is not supported in your browser")
    }
  })

  // File Upload
  fileUploadBtn.addEventListener("click", () => {
    fileInput.click()
  })

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      showToast(`File selected: ${file.name}`)
      addUserMessage(`[Attached file: ${file.name}]`)
      fileInput.value = ""
    }
  })

  // Sidebar menu items
  const sidebarItems = document.querySelectorAll(".sidebar-item")
  sidebarItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Remove active class from all items
      sidebarItems.forEach((i) => i.classList.remove("active"))
      // Add active class to clicked item
      item.classList.add("active")

      // Handle tool switching
      const tool = item.getAttribute("data-tool")
      if (tool) {
        document.querySelector(".chat-header h2").textContent = tool.charAt(0).toUpperCase() + tool.slice(1)
      }
    })
  })

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.remove("active")
    }
  })

  // Send message function
  function sendMessage() {
    const message = messageInput.value.trim()
    if (!message) return

    addUserMessage(message)
    messageInput.value = ""
    messageInput.style.height = "auto"
    showTypingIndicator()

    const apiKey = localStorage.getItem("openRouterApiKey")

    if (!apiKey) {
      removeTypingIndicator()
      addSystemMessage("API key not found. Please add your OpenRouter API key in settings.")
      settingsModal.classList.add("active")
      return
    }

    callAI(message, apiKey)
  }

  function addUserMessage(message) {
    const messageGroup = document.createElement("div")
    messageGroup.className = "message-group user"

    const messageEl = document.createElement("div")
    messageEl.className = "message"
    messageEl.innerHTML = `<p>${formatMessage(message)}</p>`

    messageGroup.appendChild(messageEl)
    chatMessages.appendChild(messageGroup)
    scrollToBottom()
  }

  function addAssistantMessage(message) {
    const messageGroup = document.createElement("div")
    messageGroup.className = "message-group assistant"

    const messageEl = document.createElement("div")
    messageEl.className = "message"
    messageEl.innerHTML = `<p>${formatMessage(message)}</p>`

    messageGroup.appendChild(messageEl)
    chatMessages.appendChild(messageGroup)
    scrollToBottom()
  }

  function addSystemMessage(message) {
    const messageGroup = document.createElement("div")
    messageGroup.className = "message-group system"

    const messageEl = document.createElement("div")
    messageEl.className = "message"
    messageEl.innerHTML = `<p>${message}</p>`

    messageGroup.appendChild(messageEl)
    chatMessages.appendChild(messageGroup)
    scrollToBottom()
  }

  function showTypingIndicator() {
    const typingIndicator = document.createElement("div")
    typingIndicator.className = "message-group assistant"
    typingIndicator.id = "typingIndicator"

    const indicator = document.createElement("div")
    indicator.className = "typing-indicator"

    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div")
      dot.className = "typing-dot"
      indicator.appendChild(dot)
    }

    typingIndicator.appendChild(indicator)
    chatMessages.appendChild(typingIndicator)
    scrollToBottom()
  }

  function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typingIndicator")
    if (typingIndicator) {
      typingIndicator.remove()
    }
  }

  function formatMessage(text) {
    if (text.includes("```")) {
      text = text.replace(/```(\w*)\n([\s\S]*?)```/g, (match, language, code) => {
        const languageTitle = language ? language : "code"
        let highlightedCode = code

        if (language === "javascript" || language === "js") {
          highlightedCode = highlightJavaScript(code)
        } else if (language === "python" || language === "py") {
          highlightedCode = highlightPython(code)
        } else if (language === "html") {
          highlightedCode = highlightHTML(code)
        } else if (language === "css") {
          highlightedCode = highlightCSS(code)
        }

        return `
          <div class="terminal-code">
            <div class="terminal-header">
              <div class="terminal-buttons">
                <div class="terminal-button terminal-close"></div>
                <div class="terminal-button terminal-minimize"></div>
                <div class="terminal-button terminal-maximize"></div>
              </div>
              <div class="terminal-title">${languageTitle}</div>
            </div>
            <div class="terminal-body">
              <span class="terminal-prompt">$</span> ${highlightedCode}
              <span class="terminal-cursor"></span>
            </div>
          </div>
        `
      })
    }

    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>")
    text = text.replace(/\n/g, "<br>")

    return text
  }

  function highlightJavaScript(code) {
    code = code.replace(
      /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await)\b/g,
      '<span class="terminal-keyword">$1</span>',
    )
    code = code.replace(/(["'`])(.*?)\1/g, '<span class="terminal-string">$1$2$1</span>')
    code = code.replace(/\/\/(.*)/g, '<span class="terminal-comment">//$1</span>')
    code = code.replace(/(\w+)(\s*\()/g, '<span class="terminal-function">$1</span>$2')
    code = code.replace(
      /\b(const|let|var)\s+(\w+)/g,
      '<span class="terminal-keyword">$1</span> <span class="terminal-variable">$2</span>',
    )
    return code
  }

  function highlightPython(code) {
    code = code.replace(
      /\b(def|class|import|from|as|return|if|elif|else|for|while|in|try|except|finally|with|lambda)\b/g,
      '<span class="terminal-keyword">$1</span>',
    )
    code = code.replace(/(["'`])(.*?)\1/g, '<span class="terminal-string">$1$2$1</span>')
    code = code.replace(/#(.*)/g, '<span class="terminal-comment">#$1</span>')
    code = code.replace(/(\w+)(\s*\()/g, '<span class="terminal-function">$1</span>$2')
    return code
  }

  function highlightHTML(code) {
    code = code.replace(/(&lt;[/]?\w+)/g, '<span class="terminal-keyword">$1</span>')
    code = code.replace(/(\s\w+)=/g, '<span class="terminal-variable">$1</span>=')
    code = code.replace(/(["'])(.*?)\1/g, '<span class="terminal-string">$1$2$1</span>')
    return code
  }

  function highlightCSS(code) {
    code = code.replace(/([.#]\w+|\w+)(\s*\{)/g, '<span class="terminal-keyword">$1</span>$2')
    code = code.replace(/(\s+)(\w+-?\w+)(\s*:)/g, '$1<span class="terminal-variable">$2</span>$3')
    code = code.replace(/(:)(\s*)([\w#]+)/g, '$1$2<span class="terminal-string">$3</span>')
    return code
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  function showToast(message) {
    const toast = document.createElement("div")
    toast.className = "toast"
    toast.textContent = message

    Object.assign(toast.style, {
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      color: "white",
      padding: "10px 20px",
      borderRadius: "20px",
      zIndex: "1000",
      opacity: "0",
      transition: "opacity 0.3s",
    })

    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.opacity = "1"
    }, 10)

    setTimeout(() => {
      toast.style.opacity = "0"
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 3000)
  }

  function shakeElement(element) {
    element.classList.add("shake")
    setTimeout(() => {
      element.classList.remove("shake")
    }, 500)
  }

  async function callAI(message, apiKey) {
    try {
      const messages = [{ role: "user", content: message }]

      const response = await fetch("https://api.kluster.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "klusterai/Meta-Llama-3.1-8B-Instruct-Turbo",
          messages: messages,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      removeTypingIndicator()

      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content
        addAssistantMessage(content)

        setTimeout(() => {
          const terminalBodies = document.querySelectorAll(".terminal-body")
          terminalBodies.forEach((body) => {
            body.innerHTML = body.innerHTML.replace('<span class="terminal-cursor"></span>', "")
            const cursor = document.createElement("span")
            cursor.className = "terminal-cursor"
            body.appendChild(cursor)
          })
        }, 100)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error calling AI:", error)
      removeTypingIndicator()
      addSystemMessage(`Error: ${error.message || "Failed to get response from AI"}`)
    }
  }

  const style = document.createElement("style")
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
  `
  document.head.appendChild(style)

  function initParticles() {
    const particles = document.querySelectorAll(".particle")

    particles.forEach((particle, index) => {
      const randomX = Math.random() * window.innerWidth
      const randomY = Math.random() * window.innerHeight

      particle.style.left = `${randomX}px`
      particle.style.top = `${randomY}px`

      const size = 4 + Math.random() * 8
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`

      particle.style.opacity = 0.1 + Math.random() * 0.4
    })
  }

  initParticles()
  window.addEventListener("resize", initParticles)

  function setViewportHeight() {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty("--vh", `${vh}px`)
  }

  setViewportHeight()
  window.addEventListener("resize", setViewportHeight)
  window.addEventListener("orientationchange", () => {
    setTimeout(setViewportHeight, 100)
  })
})
