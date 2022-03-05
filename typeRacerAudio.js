// ==UserScript==
// @name         typeRacerSound
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add countdown sound for the last 3 sec.
// @author       undg
// @match        https://play.typeracer.com/*
// ==/UserScript==

;(function () {
    'use strict'

    const body = document.querySelector('body')

    const audioBeep = new Audio('https://github.com/undg/typeRacerAudio/raw/slave/assets/typeracer.wav')
    
    const volume = localStorage.getItem('volume') ?? 4

    const titleElement = document.getElementsByClassName('title')[0]
    const volElement = document.createElement('span')

    volElement.id = 'volElement'
    volElement.innerText = volumeText(volume)
    volElement.style.padding = '10px'
    volElement.style.backgroundColor = '#444'
    volElement.style.borderRadius = '20px'

    // Events
    volElement.onwheel = volChange
    volElement.addEventListener('click', e => {
        e.preventDefault()
        setAudio(audioBeep)
        audioBeep.play()
    })

    titleElement.appendChild(volElement)

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
        setAudio(audioBeep)
        if (cntDown === 3) setTimeout(()=>audioBeep.play(), 400)
    }

    /*
     * @param {HTMLAudioElement} audioBeep
     */
    function setAudio(audioBeep) {
        const volume = localStorage.getItem('volume') ?? 4
        localStorage.setItem('volume', volume)
        audioBeep.volume = volume / 10
    }

    /*
     * @param {(number|string|undefined)} volume
     */

    function volumeText(volume) {
        volume = +volume
        if(volume === 0)
            return "🔇 "
        if(volume > 0)
            return "🔈 " + volume.toString() + "0%"
        if(volume > 4)
            return "🔉 " + volume.toString() + "0%"
        if(volume > 7)
            return "🔊 " + volume.toString() + "0%"
        if(volume === 10)
            return "🔊 MAX"
        return "🔊 " + volume.toString() + "0%"
    }

    /*
     * @param {WheelEvent} event
     * 
     * @return void
     */
    function volChange(event) {
        event.preventDefault()

        const element = document.getElementById('volElement')

        let volume = +localStorage.getItem('volume')
        if(event.deltaY < 0 && volume < 10) 
            volume++
        if(event.deltaY > 0 && volume > 0) 
            volume--

        element.innerText = volumeText(volume)
        localStorage.setItem('volume', volume)
        setAudio(audioBeep)
    }
})()
