// ==UserScript==
// @name         monkeyuser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You(Me?)
// @match        https://www.monkeyuser.com/index.xml?custom-random
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monkeyuser.com
// @grant        none
// ==/UserScript==


function getRssXmlString() {
    // Assuming the XML content is directly within the document body
    return new XMLSerializer().serializeToString(document.body);
}

function getRandomLink(xmlString) {
    // Parse the XML string into a DOM object
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Get all the 'item' elements
    const items = xmlDoc.getElementsByTagName('item');

    // Choose a random index
    const randomIndex = Math.floor(Math.random() * items.length);

    // Get the 'link' element from the randomly chosen 'item'
    const link = items[randomIndex].getElementsByTagName('link')[0].textContent;

    return link;
}


(function () {
  "use strict";
  // @TODO (undg) 2024-01-30: replace with something interesting for this half a seccond flash
  document.body.style.opacity = '0.9'

  window.location.href = getRandomLink(getRssXmlString());
})();
