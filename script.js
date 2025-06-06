document.addEventListener("DOMContentLoaded", () => {
  // Add these elements after the existing DOM elements
  const mobileMenuButton = document.createElement("button")
  mobileMenuButton.className = "mobile-menu-button"
  mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>'
  mobileMenuButton.style.display = "none"
  document.body.appendChild(mobileMenuButton)

  const sidebarOverlay = document.createElement("div")
  sidebarOverlay.className = "sidebar-overlay"
  document.body.appendChild(sidebarOverlay)

  // Mobile menu functionality
  let isMobileMenuOpen = false

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen
    const sidebar = document.querySelector(".sidebar")

    if (isMobileMenuOpen) {
      sidebar.classList.add("mobile-open")
      sidebarOverlay.classList.add("active")
      mobileMenuButton.innerHTML = '<i class="fas fa-times"></i>'
    } else {
      sidebar.classList.remove("mobile-open")
      sidebarOverlay.classList.remove("active")
      mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>'
    }
  }

  function closeMobileMenu() {
    if (isMobileMenuOpen) {
      toggleMobileMenu()
    }
  }

  // Mobile menu event listeners
  mobileMenuButton.addEventListener("click", toggleMobileMenu)
  sidebarOverlay.addEventListener("click", closeMobileMenu)

  // Show/hide mobile menu button based on screen size
  function handleResize() {
    if (window.innerWidth <= 768) {
      mobileMenuButton.style.display = "block"
    } else {
      mobileMenuButton.style.display = "none"
      closeMobileMenu()
    }
  }

  // Initial check and resize listener
  handleResize()
  window.addEventListener("resize", handleResize)

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
      // For now, just show a message that file was selected
      showToast(`File selected: ${file.name}`)

      // In a real app, you would handle file upload to the AI service
      // For this demo, we'll just add a message with the file name
      addUserMessage(`[Attached file: ${file.name}]`)

      // Reset the file input
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

      // Close mobile menu if open
      if (window.innerWidth <= 768) {
        closeMobileMenu()
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

    // Add user message to chat
    addUserMessage(message)

    // Clear input
    messageInput.value = ""
    messageInput.style.height = "auto"

    // Show typing indicator
    showTypingIndicator()

    // Get API key from localStorage
    const apiKey = localStorage.getItem("openRouterApiKey")

    if (!apiKey) {
      removeTypingIndicator()
      addSystemMessage("API key not found. Please add your OpenRouter API key in settings.")
      settingsModal.classList.add("active")
      return
    }

    // Call OpenRouter API
    callAI(message, apiKey)
  }

  // Add user message to chat
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

  // Add assistant message to chat
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

  // Add system message to chat
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

  // Show typing indicator
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

  // Remove typing indicator
  function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typingIndicator")
    if (typingIndicator) {
      typingIndicator.remove()
    }
  }

  // Format message (convert URLs to links, code blocks, etc.)
  function formatMessage(text) {
    // Check if the message contains code blocks
    if (text.includes("```")) {
      // Convert code blocks to terminal-like interface
      text = text.replace(/```(\w*)\n([\s\S]*?)```/g, (match, language, code) => {
        const languageTitle = language ? language : "code"

        // Apply syntax highlighting based on language
        let highlightedCode = code

        // Basic syntax highlighting for common languages
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

    // Convert URLs to links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')

    // Convert inline code
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>")

    // Handle line breaks
    text = text.replace(/\n/g, "<br>")

    return text
  }

  // Basic syntax highlighting functions
  function highlightJavaScript(code) {
    // Keywords
    code = code.replace(
      /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await)\b/g,
      '<span class="terminal-keyword">$1</span>',
    )

    // Strings
    code = code.replace(/(["'`])(.*?)\1/g, '<span class="terminal-string">$1$2$1</span>')

    // Comments
    code = code.replace(/\/\/(.*)/g, '<span class="terminal-comment">//$1</span>')

    // Functions
    code = code.replace(/(\w+)(\s*\()/g, '<span class="terminal-function">$1</span>$2')

    // Variables after const/let/var
    code = code.replace(
      /\b(const|let|var)\s+(\w+)/g,
      '<span class="terminal-keyword">$1</span> <span class="terminal-variable">$2</span>',
    )

    return code
  }

  function highlightPython(code) {
    // Keywords
    code = code.replace(
      /\b(def|class|import|from|as|return|if|elif|else|for|while|in|try|except|finally|with|lambda)\b/g,
      '<span class="terminal-keyword">$1</span>',
    )

    // Strings
    code = code.replace(/(["'`])(.*?)\1/g, '<span class="terminal-string">$1$2$1</span>')

    // Comments
    code = code.replace(/#(.*)/g, '<span class="terminal-comment">#$1</span>')

    // Functions
    code = code.replace(/(\w+)(\s*\()/g, '<span class="terminal-function">$1</span>$2')

    return code
  }

  function highlightHTML(code) {
    // Tags
    code = code.replace(/(&lt;[/]?\w+)/g, '<span class="terminal-keyword">$1</span>')

    // Attributes
    code = code.replace(/(\s\w+)=/g, '<span class="terminal-variable">$1</span>=')

    // Strings
    code = code.replace(/(["'])(.*?)\1/g, '<span class="terminal-string">$1$2$1</span>')

    return code
  }

  function highlightCSS(code) {
    // Selectors
    code = code.replace(/([.#]\w+|\w+)(\s*\{)/g, '<span class="terminal-keyword">$1</span>$2')

    // Properties
    code = code.replace(/(\s+)(\w+-?\w+)(\s*:)/g, '$1<span class="terminal-variable">$2</span>$3')

    // Values
    code = code.replace(/(:)(\s*)([\w#]+)/g, '$1$2<span class="terminal-string">$3</span>')

    return code
  }

  // Add a function to simulate typing effect for terminal code
  function simulateTyping(element, text, speed = 50) {
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i)
        i++
      } else {
        clearInterval(interval)
        // Add cursor at the end
        element.innerHTML += '<span class="terminal-cursor"></span>'
      }
    }, speed)
  }

  // Scroll chat to bottom
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  // Show toast notification
  function showToast(message) {
    const toast = document.createElement("div")
    toast.className = "toast"
    toast.textContent = message

    // Style the toast
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

    // Fade in
    setTimeout(() => {
      toast.style.opacity = "1"
    }, 10)

    // Fade out and remove
    setTimeout(() => {
      toast.style.opacity = "0"
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 3000)
  }

  // Shake element animation for validation errors
  function shakeElement(element) {
    element.classList.add("shake")
    setTimeout(() => {
      element.classList.remove("shake")
    }, 500)
  }

  // Call AI API
  async function callAI(message, apiKey) {
    try {
      // Get previous messages for context
      const messages = [{ role: "user", content: message }]

      // Call OpenRouter API
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

      // Remove typing indicator
      removeTypingIndicator()

      // Add assistant response to chat
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content
        addAssistantMessage(content)

        // If the response contains code, add animation effect
        setTimeout(() => {
          const terminalBodies = document.querySelectorAll(".terminal-body")
          terminalBodies.forEach((body) => {
            // Remove the cursor that was added by formatMessage
            body.innerHTML = body.innerHTML.replace('<span class="terminal-cursor"></span>', "")

            // Add a blinking cursor at the end
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

  // Add CSS animation for shake effect
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

  // Initialize floating particles
  function initParticles() {
    const particles = document.querySelectorAll(".particle")

    particles.forEach((particle, index) => {
      // Random starting positions
      const randomX = Math.random() * window.innerWidth
      const randomY = Math.random() * window.innerHeight

      particle.style.left = `${randomX}px`
      particle.style.top = `${randomY}px`

      // Random sizes
      const size = 4 + Math.random() * 8
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`

      // Random opacity
      particle.style.opacity = 0.1 + Math.random() * 0.4
    })
  }

  // Call the function to initialize particles
  initParticles()

  // Add window resize handler for particles
  window.addEventListener("resize", initParticles)
})
