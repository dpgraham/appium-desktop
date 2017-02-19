/* eslint-disable no-console */
var token = process.env.GITHUB_REPO_TOKEN; // TODO: Change this to the AppVeyor token
var tag = '1.0.0-beta'; // TODO: Change this to process.env.APPVEYOR_TAG
var vTag = 'v' + tag;
var fs = require('fs');
var filename = 'Appium Setup :tag.exe'.replace(':tag', tag);
var github = require('octonode');
var _ = require('lodash');

// Get the client
var client = github.client(token);
var appiumDesktopRepo = client.repo('dpgraham/appium-desktop');

// Get existing releases
appiumDesktopRepo.releases(function (err, releases) {
  if (err) {
    console.error('Could not get releases', err);
    process.exit(1);
  }
  // Find the release that matches the given tag
  releases = _.keyBy(releases, 'tag_name');
  console.log('Releases', releases);
  var release = releases[vTag];
  if (!release) {
    console.error('Could not find asset ' + vTag);
    process.exit(1);
  }
  release = client.release('dpgraham/appium-desktop', release.id);
  release.uploadAssets(fs.readFileSync('release/:filename'.replace(':filename', filename)), {
    name: filename,
    contentType: 'application/x-msdownload',
    uploadHost: 'uploads.github.com',
  }, function (err, response) {
    if (err) {
      console.log('Could not upload exe', err.body.errors);
      process.exit(1);
    }
    console.log(err, response);
  });
});