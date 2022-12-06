// ==UserScript==
// @name         monkeyuser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You(Me?)
// @match        https://www.monkeyuser.com/custom-random
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monkeyuser.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  window.location.pathname =
    window.globalThis.posts[
      Math.floor(Math.random() * window.globalThis.posts.length)
    ];
})();
