document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const eventNameElement = document.getElementById('event-name');
  const yearsElement = document.getElementById('years');
  const monthsElement = document.getElementById('months');
  const daysElement = document.getElementById('days');
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');
  const millisecondsElement = document.getElementById('milliseconds');
  
  const settingsButton = document.getElementById('settings-button');
  const settingsModal = document.getElementById('settings-modal');
  const closeButton = document.querySelector('.close-button');
  const saveButton = document.getElementById('save-settings');
  
  const eventNameInput = document.getElementById('event-name-input');
  const targetDateInput = document.getElementById('target-date');
  const targetTimeInput = document.getElementById('target-time');
  
  // Ripple Effect Canvas
  const canvas = document.getElementById('rippleCanvas');
  const ctx = canvas.getContext('2d');
  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight;
  
  // Set canvas dimensions
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  // Ripple parameters
  const ripples = [];
  const maxRipples = 10;
  
  // Function to resize canvas
  function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }
  
  // Initialize ripple effect
  function initRippleEffect() {
    let lastRippleTime = 0;
    const rippleThreshold = 100; // ms between ripples
    
    // Listen for mouse movement
    document.addEventListener('mousemove', (e) => {
      const currentTime = Date.now();
      // Only create ripples occasionally and with minimal time between them
      if (Math.random() > 0.92 && currentTime - lastRippleTime > rippleThreshold) {
        addRipple(e.clientX, e.clientY);
        lastRippleTime = currentTime;
      }
    });
    
    // Also add ripples on click
    document.addEventListener('click', (e) => {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          addRipple(e.clientX, e.clientY);
        }, i * 50);
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Start animation loop
    animateRipples();
  }
  
  // Add a new ripple
  function addRipple(x, y) {
    // Create a new ripple
    const ripple = {
      x: x,
      y: y,
      radius: 0,
      maxRadius: Math.random() * 100 + 50,
      speed: Math.random() * 2 + 1,
      opacity: 0.7,
      color: getRandomRippleColor()
    };
    
    // Add to array, removing oldest if needed
    if (ripples.length >= maxRipples) {
      ripples.shift();
    }
    ripples.push(ripple);
  }
  
  // Get a random color for ripples
  function getRandomRippleColor() {
    const colors = [
      'rgba(142, 45, 226, 0.2)',  // var(--accent-1)
      'rgba(74, 0, 224, 0.2)',    // var(--accent-2)
      'rgba(255, 140, 0, 0.2)',   // var(--accent-3)
      'rgba(48, 43, 99, 0.2)',    // var(--primary-medium)
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  // Animate ripples
  function animateRipples() {
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw and update ripples
    for (let i = 0; i < ripples.length; i++) {
      const ripple = ripples[i];
      
      // Increase radius
      ripple.radius += ripple.speed;
      
      // Decrease opacity
      ripple.opacity = Math.max(0, 0.7 * (1 - ripple.radius / ripple.maxRadius));
      
      // Draw ripple
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.strokeStyle = ripple.color.replace(/[\d\.]+\)$/, ripple.opacity + ')');
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Remove ripples that have reached max size
      if (ripple.radius >= ripple.maxRadius) {
        ripples.splice(i, 1);
        i--;
      }
    }
    
    // Continue animation loop
    requestAnimationFrame(animateRipples);
  }
  
  // Initialize ripple effect
  initRippleEffect();
  
  // Default values
  let targetDate = new Date();
  targetDate.setFullYear(targetDate.getFullYear() + 1); // Default: 1 year from now
  let eventName = 'My Event';
  
  // Load saved settings
  loadSettings();
  
  // Update the countdown timer
  let animationFrameId;
  updateCountdown();
  
  // Settings Modal Functionality
  settingsButton.addEventListener('click', openModal);
  closeButton.addEventListener('click', closeModal);
  saveButton.addEventListener('click', saveSettings);
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      closeModal();
    }
  });
  
  // Helper Functions
  function updateCountdown() {
    const now = new Date();
    const timeDifference = targetDate - now;
    
    if (timeDifference <= 0) {
      // Target date reached
      displayTimeValues(0, 0, 0, 0, 0, 0, 0);
      eventNameElement.textContent = `${eventName} has arrived!`;
      return;
    }
    
    // Calculate time components
    const msInSecond = 1000;
    const msInMinute = msInSecond * 60;
    const msInHour = msInMinute * 60;
    const msInDay = msInHour * 24;
    
    // Calculate years, months, and days
    let remainingTime = timeDifference;
    
    // Using a more accurate calculation for years, months, and days
    const dateStart = new Date(now);
    const dateEnd = new Date(targetDate);
    
    let years = 0;
    let months = 0;
    
    // Calculate years
    years = dateEnd.getFullYear() - dateStart.getFullYear();
    
    // Adjust years if needed
    if (dateEnd.getMonth() < dateStart.getMonth() || 
        (dateEnd.getMonth() === dateStart.getMonth() && dateEnd.getDate() < dateStart.getDate())) {
      years--;
    }
    
    // Calculate months
    months = dateEnd.getMonth() - dateStart.getMonth();
    if (months < 0) months += 12;
    
    // Adjust months if needed
    if (dateEnd.getDate() < dateStart.getDate()) {
      months--;
      if (months < 0) months += 12;
    }
    
    // Calculate remaining days
    const monthStart = new Date(dateStart);
    monthStart.setFullYear(dateEnd.getFullYear());
    monthStart.setMonth(dateEnd.getMonth());
    
    let days = dateEnd.getDate() - dateStart.getDate();
    if (days < 0) {
      const lastMonthDate = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), 0);
      days += lastMonthDate.getDate();
    }
    
    // Calculate hours, minutes, seconds, milliseconds
    const timeOfDay = targetDate.getTime() % msInDay;
    const timeOfDayNow = now.getTime() % msInDay;
    
    let remainingMs = timeOfDay - timeOfDayNow;
    if (remainingMs < 0) {
      remainingMs += msInDay;
      days--;
      if (days < 0) {
        days = 0;
        months = 0;
        years = 0;
      }
    }
    
    const hours = Math.floor(remainingMs / msInHour);
    const minutes = Math.floor((remainingMs % msInHour) / msInMinute);
    const seconds = Math.floor((remainingMs % msInMinute) / msInSecond);
    const milliseconds = Math.floor(remainingMs % msInSecond);
    
    // Display values
    displayTimeValues(years, months, days, hours, minutes, seconds, milliseconds);
    
    // Update countdown every frame for smooth animation
    animationFrameId = requestAnimationFrame(updateCountdown);
  }
  
  function displayTimeValues(years, months, days, hours, minutes, seconds, milliseconds) {
    yearsElement.textContent = padNumber(years, 2);
    monthsElement.textContent = padNumber(months, 2);
    daysElement.textContent = padNumber(days, 2);
    hoursElement.textContent = padNumber(hours, 2);
    minutesElement.textContent = padNumber(minutes, 2);
    secondsElement.textContent = padNumber(seconds, 2);
    millisecondsElement.textContent = padNumber(milliseconds, 3);
    eventNameElement.textContent = eventName;
  }
  
  function padNumber(num, length) {
    return String(num).padStart(length, '0');
  }
  
  function openModal() {
    // Fill form with current values
    eventNameInput.value = eventName;
    
    // Format date for input
    const dateString = targetDate.toISOString().slice(0, 10);
    targetDateInput.value = dateString;
    
    // Format time for input (HH:MM)
    const hours = padNumber(targetDate.getHours(), 2);
    const minutes = padNumber(targetDate.getMinutes(), 2);
    targetTimeInput.value = `${hours}:${minutes}`;
    
    // Show modal
    settingsModal.style.display = 'block';
  }
  
  function closeModal() {
    settingsModal.style.display = 'none';
  }
  
  function saveSettings() {
    // Get values from form
    const newEventName = eventNameInput.value.trim() || 'My Event';
    const newDate = targetDateInput.value;
    const newTime = targetTimeInput.value || '00:00';
    
    // Create new target date
    const [year, month, day] = newDate.split('-').map(Number);
    const [hours, minutes] = newTime.split(':').map(Number);
    
    const newTargetDate = new Date(year, month - 1, day, hours, minutes);
    
    // Update values
    eventName = newEventName;
    targetDate = newTargetDate;
    
    // Save to storage
    saveToStorage();
    
    // Update UI
    closeModal();
    
    // Restart animation if it was stopped
    if (!animationFrameId) {
      updateCountdown();
    }
  }
  
  function saveToStorage() {
    const settings = {
      eventName,
      targetDate: targetDate.toISOString()
    };
    
    // Use appropriate storage API based on browser
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ 'countTillEndSettings': settings });
    } else if (typeof browser !== 'undefined' && browser.storage) {
      browser.storage.sync.set({ 'countTillEndSettings': settings });
    } else {
      // Fallback to localStorage
      localStorage.setItem('countTillEndSettings', JSON.stringify(settings));
    }
  }
  
  function loadSettings() {
    function onSettingsLoaded(result) {
      const settings = result?.countTillEndSettings;
      
      if (settings) {
        eventName = settings.eventName || 'My Event';
        targetDate = new Date(settings.targetDate) || new Date(new Date().getFullYear() + 1, 0, 1);
      } else {
        // If no settings found, set a default target date (New Year's Day)
        const currentYear = new Date().getFullYear();
        targetDate = new Date(currentYear + 1, 0, 1);
        eventName = 'New Year';
        saveToStorage(); // Save the defaults
      }
    }
    
    // Use appropriate storage API based on browser
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get('countTillEndSettings', onSettingsLoaded);
    } else if (typeof browser !== 'undefined' && browser.storage) {
      browser.storage.sync.get('countTillEndSettings').then(onSettingsLoaded);
    } else {
      // Fallback to localStorage
      const storedSettings = localStorage.getItem('countTillEndSettings');
      onSettingsLoaded(storedSettings ? { countTillEndSettings: JSON.parse(storedSettings) } : null);
    }
  }
}); 