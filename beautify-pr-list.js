// ==UserScript==
// @name         github beautify PR list
// @namespace    http://tampermonkey.net/
// @version      2026-01-15
// @description  try to take over the world!
// @author       You
// @match        https://github.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @require      file:////home/undg/Code/tampermonkey/beautify-pr-list.js
// @grant        none
// ==/UserScript==
(function () {
  "use strict";
  // ============================================================================
  // COLOR CONFIGURATION - Dark Mode Optimized
  // ============================================================================

  // Color palettes for PR states
  const PALETTE_GITHUB = {
    approved: "#238636", // GitHub green
    changesRequested: "#da3633", // GitHub red
    reviewRequired: "#6e7681", // GitHub gray
    textColor: "#ffffff", // White text for all states
  };
  const PALETTE_VIVID = {
    approved: "#10b981", // Emerald 500
    changesRequested: "#ef4444", // Red 500
    reviewRequired: "#8b5cf6", // Violet 500
    textColor: "#ffffff", // White text for all states
  };
  const PALETTE_MUTED = {
    approved: "#059669", // Emerald 600
    changesRequested: "#dc2626", // Red 600
    reviewRequired: "#67788f", // Slate 500
    textColor: "#ffffff", // White text for all states
  };

  // User highlight styling
  const USER_COLORS = {
    border: "#22c55e", // Green 500
    background: "rgba(34, 197, 94, 0.1)", // Subtle green glow
    textColor: "#ffffff", // White text
    textShadow:
      "0 0 2px rgba(0, 0, 0, 0.5), 1px 1px 1px rgba(0, 0, 0, 0.4), -1px -1px 1px rgba(0, 0, 0, 0.4), 1px -1px 1px rgba(0, 0, 0, 0.4), -1px 1px 1px rgba(0, 0, 0, 0.4)", // Subtle outline for readability
    borderWidth: "2px",
    borderRadius: "5px",
    padding: "0 5px",
  };

  // PR state base styling
  const STATE_STYLE = {
    borderRadius: "5px",
    padding: "0 5px",
    textShadow:
      "0 0 2px rgba(0, 0, 0, 0.5), 1px 1px 1px rgba(0, 0, 0, 0.4), -1px -1px 1px rgba(0, 0, 0, 0.4), 1px -1px 1px rgba(0, 0, 0, 0.4), -1px 1px 1px rgba(0, 0, 0, 0.4)", // Subtle outline for readability
  };

  // Active palette (change this to switch themes)
  // Options: PALETTE_GITHUB, PALETTE_VIVID, PALETTE_MUTED
  const ACTIVE_PALETTE = PALETTE_VIVID;

  // ============================================================================
  // USERNAME AUTO-DETECTION
  // ============================================================================

  /**
   * Auto-detect the logged-in GitHub username from the DOM
   * @returns {string|null} Username or null if detection fails
   */
  function getLoggedInUsername() {
    // Try meta tag first (most reliable)
    const metaUsername = document.querySelector(
      'meta[name="user-login"]'
    )?.content;
    if (metaUsername) return metaUsername;

    // Fallback: avatar image in header
    const avatarImg = document.querySelector("img.avatar-user");
    if (avatarImg?.alt) {
      return avatarImg.alt.replace("@", "");
    }

    // Last resort: return null and log warning
    console.warn("[GitHub PR Beautifier] Could not detect username");
    return null;
  }

  // Auto-detect logged-in GitHub username
  const MY_USERNAME = getLoggedInUsername();

  // Early exit if username detection failed
  if (!MY_USERNAME) {
    console.error(
      "[GitHub PR Beautifier] Failed to detect GitHub username. Script disabled."
    );
    return;
  }

  // ============================================================================
  // SCRIPT LOGIC
  // ============================================================================
  // Global observer reference
  let observer = null;
  let isObserving = false;
  // Debounce helper to avoid excessive processing
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
  // Check if we're on a Pull Requests page by title
  function isOnPullRequestsPage() {
    return document.title.startsWith("Pull requests · ");
  }
  // Apply all styling logic
  function applyStyles() {
    // Style user elements
    for (const $user of document.querySelectorAll(
      '[data-hovercard-type="user"]'
    )) {
      const userName = $user.innerText;
      if (userName === MY_USERNAME) {
        $user.classList.remove("Link--muted");
        $user.style.border = `${USER_COLORS.borderWidth} solid ${USER_COLORS.border}`;
        $user.style.background = USER_COLORS.background;
        $user.style.borderRadius = USER_COLORS.borderRadius;
        $user.style.padding = USER_COLORS.padding;
        $user.style.color = `${USER_COLORS.textColor}`;
        $user.style.textShadow = USER_COLORS.textShadow;
      }
    }
    // Style PR state elements
    for (const $state of document.querySelectorAll(
      'a[href*="#partial-pull-merging"]'
    )) {
      $state.classList.remove("Link--muted");
      $state.style.borderRadius = STATE_STYLE.borderRadius;
      $state.style.padding = STATE_STYLE.padding;
      $state.style.color = `${ACTIVE_PALETTE.textColor}`;
      $state.style.textShadow = STATE_STYLE.textShadow;
      switch ($state.innerText.trim()) {
        case "Approved":
          $state.style.background = ACTIVE_PALETTE.approved;
          break;
        case "Changes requested":
          $state.style.background = ACTIVE_PALETTE.changesRequested;
          break;
        case "Review required":
          $state.style.background = ACTIVE_PALETTE.reviewRequired;
          break;
      }
    }
  }

  // Debounced version of applyStyles (100ms)
  const debouncedApplyStyles = debounce(applyStyles, 100);
  // Start observing DOM changes
  function startObserving() {
    // Avoid starting multiple observers
    if (isObserving) {
      return;
    }
    const container =
      document.querySelector("#js-issues-search-results") || document.body;

    if (!observer) {
      observer = new MutationObserver(debouncedApplyStyles);
    }
    observer.observe(container, {
      childList: true,
      subtree: true,
    });
    isObserving = true;
  }
  // Stop observing DOM changes
  function stopObserving() {
    if (observer && isObserving) {
      observer.disconnect();
      isObserving = false;
    }
  }
  // Main handler for page changes (initial load + Turbo navigation)
  function handlePageChange() {
    // Early exit if not on PR list page
    if (!isOnPullRequestsPage()) {
      stopObserving();
      return;
    }
    // We're on PR list - apply styles and start observing
    applyStyles();
    startObserving();
  }
  // Initial page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handlePageChange);
  } else {
    handlePageChange();
  }
  // GitHub Turbo navigation events (SPA routing)
  document.addEventListener("turbo:load", handlePageChange);
  document.addEventListener("turbo:render", handlePageChange);
})();
