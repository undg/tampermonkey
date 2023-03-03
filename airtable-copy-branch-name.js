// ==UserScript==
// @name         Airtable copy field
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://airtable.com/*
// @grant        none
// @require      file:////home/undg/Code/tampermonkey/airtable-copy-branch-name.js
// ==/UserScript==

(function() {
    "use strict";
    console.log("airtable script");

    document.querySelectorAll("[data-columntype='formula']").forEach(() => {
        console.log("airtable adding addEventListener");

        document.addEventListener("click", (e) => {
            const txt = "git checkout -b " + e.target.innerText;

            navigator.clipboard.writeText(txt);

            notifySend(e.target.innerText);

            console.log(txt);
        });
    });
})();

function notifySend(msg) {
    if (!("Notification" in window)) {
        // Check if the browser supports notifications
        console.log("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        // const notification = new Notification(msg);
        new Notification(msg);
    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                new Notification(msg);
            }
        });
    }
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
}
