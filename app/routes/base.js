"use strict"

module.exports = {
  routes : []
  , add : function(name, opts) {
    this.routes.push([name, opts])
    return this
  }
}
