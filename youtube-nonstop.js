// ==UserScript==
// @name         Youtube-nonstop
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skip Still watching popup
// @author       undg
// @match        *.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @require      file:////home/undg/Code/tampermonkey/youtube-nonstop.js
// ==/UserScript==

(function() {
    "use strict";
    const root = document.querySelector("body");

    const mt = new MutationObserver((mutations, observe) => {
        const youthere = document.querySelector('.ytmusic-you-there-renderer a')
        youthere && youthere.click()

        // trial popup on youtube music
        const ytMusicPromo = document.querySelector(
            "ytmusic-mealbar-promo-renderer"
        );

        if (ytMusicPromo) ytMusicPromo.remove();

        const popupPrePause = document.querySelector("#toast");
        if (
            popupPrePause &&
            popupPrePause.innerText.includes("Still watching? Video will pause soon")
        )
            popupPrePause.querySelector("a").click();

        const popupPaused = document.querySelector("ytmusic-popup-container");
        if (
            popupPaused &&
            popupPaused.innerText.includes("Video paused. Continue watching?")
        )
            popupPaused.querySelector("a").click();
    });

    mt.observe(root, {
        childList: true,
        attributes: true,
        characterData: false,
        subtree: false,
        attributeFilter: [],
        attributeOldValue: false,
        characterDataOldValue: false,
    });
})();
