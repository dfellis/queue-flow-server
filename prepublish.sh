#!/bin/bash

# Lint the code
jshint ./bin/queue-flow-server.js
jshint ./lib/main.js
jshint ./lib/server.js
jshint ./lib/client.js
jshint ./lib/cluster.js

# Run the tests
npm test

# Build documentation
docco ./bin/queue-flow-server.js
docco ./lib/main.js
docco ./lib/server.js
docco ./lib/client.js
docco ./lib/cluster.js

# Build the index page
md2jekyllhtml readme.md
touch new-index.html
echo --- >> new-index.html
echo layout: site >> new-index.html
echo title: winthrop >> new-index.html
echo subtitle: git repo generator for node modules >> new-index.html
echo --- >> new-index.html
cat readme.html >> new-index.html
rm readme.html
git stash

# Put the documentation in the gh-pages branch
mv docs docs-new
git checkout gh-pages
rm -rf docs
rm -rf index.html
mv docs-new docs
mv new-index.html index.html
git commit -am "Automatic documentation for version $npm_package_version"
git checkout master
git stash pop

# Commit the changes to master
git commit -am "Automatic commit for version $npm_package_version"
git tag $npm_package_version
git push
git push --tags
