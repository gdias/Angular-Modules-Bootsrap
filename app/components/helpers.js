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
