// ==UserScript==
// @name         typeRacerSound
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add countdown sound for the last 3 sec.
// @author       undg
// @match        https://play.typeracer.com/
// ==/UserScript==

;(function () {
    'use strict'

    const body = document.querySelector('body')

    const audioBeep = new Audio('https://github.com/undg/typeRacerAudio/raw/slave/assets/typeracer.wav')

    const config = {
        childList: true,
    }

    new MutationObserver((mutationrecordsBody) => {
        const timeNode = mutationrecordsBody[0]?.addedNodes[0]?.querySelector('.popupContent .time')
        if (timeNode) observeTimePopup(timeNode, config)
    }).observe(body, config)

    function observeTimePopup(timeNode, config) {
        const PopupObserver = new MutationObserver(playCountdownSound)
        PopupObserver.observe(timeNode, config)
    }

    function playCountdownSound(mutationrecordsPopup) {
        const cntDown = +mutationrecordsPopup[0]?.target?.innerText.replace(/:/, '')
        if (cntDown === 3) setTimeout(()=>audioBeep.play(), 400)
    }
})()
