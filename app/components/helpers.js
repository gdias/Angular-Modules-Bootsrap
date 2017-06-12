"use strict"

module.exports.htmlSpecialChars = function(str) {

  var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };

  function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
  }

  return  (!str || typeof str === "string"
    ? str.replace(/[&<>]/g, replaceTag)
    : false)

}

module.exports.join = function(array) {
  return (typeof array != "undefined" && array.length != 0 ? array.join("") : false)

}
