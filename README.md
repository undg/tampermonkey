# [Tampermonkey](https://www.tampermonkey.net/) scripts

1. Enable access to file system for browser plugin (manage extensions -> Allow access to file URLs)
2. Use only header in plugin script editor with `@require` and `@match` rules.
    ```javascript
    // ==UserScript==
    // @name         typeRacerSound
    // @namespace    http://tampermonkey.net/
    // @version      0.1
    // @description  add countdown sound for the last 3 sec.
    // @author       undg
    // @match        https://play.typeracer.com/*
    // @require      file:////home/undg/Code/tampermonkey/typeRacerAudio.js
    // ==/UserScript==
    ```
    
3. Rest of the script can live in file.
    ```javascript
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
        console.log('hello world!')
    })()
    ```
