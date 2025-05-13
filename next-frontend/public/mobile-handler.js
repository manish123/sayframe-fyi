// Mobile handler for StayFrame
// This script adds mobile-specific functionality to the application

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on a mobile device
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // Create the desktop recommendation notice
    createDesktopNotice();
    
    // Add mobile export buttons
    addMobileExportButtons();
    
    // Hide the third column (right sidebar)
    hideThirdColumn();
    
    // Adjust the layout for mobile
    adjustLayoutForMobile();
  }
  
  // Listen for window resize events
  window.addEventListener('resize', function() {
    const newIsMobile = window.innerWidth <= 768;
    
    // Only take action if the mobile state has changed
    if (newIsMobile !== isMobile) {
      if (newIsMobile) {
        createDesktopNotice();
        addMobileExportButtons();
        hideThirdColumn();
        adjustLayoutForMobile();
      } else {
        removeDesktopNotice();
        removeMobileExportButtons();
        showThirdColumn();
        resetLayoutForDesktop();
      }
    }
  });
});

// Create and show the desktop recommendation notice
function createDesktopNotice() {
  // Check if notice already exists
  if (document.querySelector('.desktop-notice')) {
    return;
  }
  
  // Create the notice container
  const notice = document.createElement('div');
  notice.className = 'desktop-notice';
  
  // Create the notice content
  const content = document.createElement('div');
  content.className = 'desktop-notice-content';
  
  // Add the icon
  const icon = document.createElement('div');
  icon.className = 'desktop-notice-icon';
  icon.textContent = '💻';
  content.appendChild(icon);
  
  // Add the title
  const title = document.createElement('h2');
  title.className = 'desktop-notice-title';
  title.textContent = 'Best Experienced on Desktop';
  content.appendChild(title);
  
  // Add the text
  const text = document.createElement('p');
  text.className = 'desktop-notice-text';
  text.textContent = 'StayFrame works best on a desktop or laptop computer due to its drag-and-drop interface and editing features. While you can continue on mobile, we recommend switching to a larger screen for the best experience.';
  content.appendChild(text);
  
  // Add the button
  const button = document.createElement('button');
  button.className = 'desktop-notice-button';
  button.textContent = 'Continue on Mobile Anyway';
  button.addEventListener('click', function() {
    removeDesktopNotice();
  });
  content.appendChild(button);
  
  // Add content to notice
  notice.appendChild(content);
  
  // Add notice to the body
  document.body.appendChild(notice);
}

// Remove the desktop recommendation notice
function removeDesktopNotice() {
  const notice = document.querySelector('.desktop-notice');
  if (notice) {
    document.body.removeChild(notice);
  }
}

// Add mobile-specific export buttons
function addMobileExportButtons() {
  // Check if buttons already exist
  if (document.querySelector('.mobile-export-buttons')) {
    return;
  }
  
  // Find the canvas wrapper
  const canvasWrapper = document.querySelector('.canvas-wrapper');
  if (!canvasWrapper) {
    return;
  }
  
  // Create the buttons container
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'mobile-export-buttons';
  
  // Create the export button
  const exportButton = document.createElement('button');
  exportButton.innerHTML = '<span>🖼️</span> Export Image';
  exportButton.addEventListener('click', function() {
    // Find and click the desktop export button
    const desktopExportButton = document.querySelector('.action-buttons .btn-primary');
    if (desktopExportButton) {
      desktopExportButton.click();
    }
  });
  buttonsContainer.appendChild(exportButton);
  
  // Create the copy button
  const copyButton = document.createElement('button');
  copyButton.innerHTML = '<span>📋</span> Copy to Clipboard';
  copyButton.addEventListener('click', function() {
    // Find and click the desktop copy button
    const desktopCopyButton = document.querySelector('.action-buttons .btn-accent');
    if (desktopCopyButton) {
      desktopCopyButton.click();
    }
  });
  buttonsContainer.appendChild(copyButton);
  
  // Add the buttons after the canvas wrapper
  canvasWrapper.parentNode.insertBefore(buttonsContainer, canvasWrapper.nextSibling);
}

// Remove mobile-specific export buttons
function removeMobileExportButtons() {
  const buttonsContainer = document.querySelector('.mobile-export-buttons');
  if (buttonsContainer) {
    buttonsContainer.parentNode.removeChild(buttonsContainer);
  }
}

// Hide the third column (right sidebar)
function hideThirdColumn() {
  // Find all elements that could be the third column
  const rightSidebar = document.querySelector('.right-sidebar');
  if (rightSidebar) {
    rightSidebar.style.display = 'none';
    rightSidebar.style.width = '0';
    rightSidebar.style.minWidth = '0';
    rightSidebar.style.maxWidth = '0';
    rightSidebar.style.padding = '0';
    rightSidebar.style.margin = '0';
    rightSidebar.style.overflow = 'hidden';
    rightSidebar.style.visibility = 'hidden';
  }
  
  // Also target elements with width: 25%
  const thirdColumnElements = document.querySelectorAll('div[style*="width: 25%"]');
  thirdColumnElements.forEach(element => {
    element.style.display = 'none';
    element.style.width = '0';
    element.style.minWidth = '0';
    element.style.maxWidth = '0';
    element.style.padding = '0';
    element.style.margin = '0';
    element.style.overflow = 'hidden';
    element.style.visibility = 'hidden';
  });
  
  // Target any div that contains .sidebar
  const sidebarContainers = document.querySelectorAll('div:has(> .sidebar)');
  sidebarContainers.forEach(element => {
    element.style.display = 'none';
    element.style.width = '0';
    element.style.minWidth = '0';
    element.style.maxWidth = '0';
    element.style.padding = '0';
    element.style.margin = '0';
    element.style.overflow = 'hidden';
    element.style.visibility = 'hidden';
  });
}

// Show the third column (right sidebar) again
function showThirdColumn() {
  // Find all elements that could be the third column
  const rightSidebar = document.querySelector('.right-sidebar');
  if (rightSidebar) {
    rightSidebar.style.display = 'flex';
    rightSidebar.style.width = '25%';
    rightSidebar.style.minWidth = '250px';
    rightSidebar.style.maxWidth = '';
    rightSidebar.style.padding = '';
    rightSidebar.style.margin = '';
    rightSidebar.style.overflow = '';
    rightSidebar.style.visibility = '';
  }
  
  // Also target elements with width: 25%
  const thirdColumnElements = document.querySelectorAll('div[style*="width: 25%"]');
  thirdColumnElements.forEach(element => {
    element.style.display = 'flex';
    element.style.width = '25%';
    element.style.minWidth = '250px';
    element.style.maxWidth = '';
    element.style.padding = '';
    element.style.margin = '';
    element.style.overflow = '';
    element.style.visibility = '';
  });
  
  // Target any div that contains .sidebar
  const sidebarContainers = document.querySelectorAll('div:has(> .sidebar)');
  sidebarContainers.forEach(element => {
    element.style.display = 'flex';
    element.style.width = '25%';
    element.style.minWidth = '250px';
    element.style.maxWidth = '';
    element.style.padding = '';
    element.style.margin = '';
    element.style.overflow = '';
    element.style.visibility = '';
  });
}

// Adjust the layout for mobile devices
function adjustLayoutForMobile() {
  // Make the app container use column layout
  const appContainer = document.querySelector('.app-container');
  if (appContainer) {
    appContainer.style.flexDirection = 'column';
  }
  
  // Make the left sidebar and main content full width
  const leftSidebar = document.querySelector('.left-sidebar');
  if (leftSidebar) {
    leftSidebar.style.width = '100%';
    leftSidebar.style.minWidth = '100%';
  }
  
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.style.width = '100%';
    mainContent.style.minWidth = '100%';
  }
}

// Reset the layout for desktop devices
function resetLayoutForDesktop() {
  // Reset the app container to row layout
  const appContainer = document.querySelector('.app-container');
  if (appContainer) {
    appContainer.style.flexDirection = 'row';
  }
  
  // Reset the left sidebar width
  const leftSidebar = document.querySelector('.left-sidebar');
  if (leftSidebar) {
    leftSidebar.style.width = '25%';
    leftSidebar.style.minWidth = '250px';
  }
  
  // Reset the main content width
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.style.width = '50%';
    mainContent.style.minWidth = '';
  }
}
