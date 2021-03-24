// ==UserScript==
// @name         redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  redirect
// @author       undg
// @match        http://jenkins/*
// ==/UserScript==

;(function () {
    'use strict'
    const l = window.location
    if (l.hostname === 'jenkins' && +l.port !== 90) l.port = 90
})()
