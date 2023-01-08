// ==UserScript==
// @name         edclub-close-ad
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Close popup
// @author       You(Me?)
// @match        https://www.edclub.com/*
// @icon         https://static.typingclub.com/m/favicon.png
// @grant        none
// @require      file:////home/undg/Code/tampermonkey/edclub-close-ad.js
// ==/UserScript==

;(function () {
    'use strict'
    const root = document.querySelector('body')

    const mt = new MutationObserver((mutations, observe)=> {
        const xModal = document.querySelector('.edmodal-x')
        xModal && xModal.click()
    })


    mt.observe(root, {
        childList: true,
        attributes: true,
        characterData: false,
        subtree: false,
        attributeFilter: [],
        attributeOldValue: false,
        characterDataOldValue: false
    })
})()
