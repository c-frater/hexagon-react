var Promise = require('bluebird')

var html = require('quantum-html')
var api = require('quantum-api')
var version = require('quantum-version')
var template = require('quantum-template')
var changelog = require('quantum-changelog')
var docs = require('quantum-docs')
var site = require('./docs/transforms')

var htmlTransforms = {
  html: html.transforms,
  api: api(),
  changelog: changelog.transforms(),
  docs: docs(),
  site: site
}

function pipeline () {
  return function (obj) {
    return Promise.resolve(obj)
      .then(template())
      .then(changelog())
      .then(version())
      .map(docs.populateTableOfContents())
      .map(html({ transforms: htmlTransforms }))
      .map(html.stringify())
      .map(html.htmlRenamer())
  }
}

module.exports = {
  pipeline: pipeline,
  pages: 'docs/pages/**/*.um',
  resourceDir: 'docs/resources',
  base: 'docs/pages',
  target: 'target',
  htmlTransforms: htmlTransforms,
  port: 5080
}
