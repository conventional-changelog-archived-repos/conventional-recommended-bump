'use strict';
var bump = require('../presets/simple').whatBump;
var commitParser = require('conventional-commits-parser');
var concat = require('concat-stream');
var streamify = require('stream-array');

var presetName = 'simple';

function bumpTest(commits, expectedLevel, done) {
  streamify(commits)
    .pipe(commitParser())
    .pipe(concat(function(parsed) {
      var release = bump(parsed);
      if (release.level !== expectedLevel) {
        throw new Error('Expected commits\n' + commits.join('\n') +
          '\nto bump at level ' + expectedLevel + '\nbut got\n' +
          JSON.stringify(release, null, 2));
      }
      done();
    }));
}

describe('preset', function() {
  describe(presetName, function() {
    describe('simple cases', function() {
      it('should not bump chores', function(done) {
        var commits = [
          'chore(test): just a test'
        ];
        bumpTest(commits, undefined, done);
      });

      it('does not care for regular messages', function(done) {
        var commits = [
          'just a test',
          'added a feature',
          'did something else',
        ];
        bumpTest(commits, undefined, done);
      });

      it('should bump fixes', function(done) {
        var commits = [
          'chore(test): just a test',
          'fix(test): fixed it!'
        ];
        bumpTest(commits, 2, done);
      });

      it('should bump features', function(done) {
        var commits = [
          'feat(test): new test added'
        ];
        bumpTest(commits, 1, done);
      });
    });

    describe('combinations', function() {
      it('feature wins over fix', function(done) {
        var commits = [
          'fix(test): fixed it!',
          'feat(test): new test added'
        ];
        bumpTest(commits, 1, done);
      });

      it('breaking wins over everything', function(done) {
        var commits = [
          'big changes\n\nBREAKING CHANGE something broke',
          'fix(test): fixed it!',
          'feat(test): new test added'
        ];
        bumpTest(commits, 0, done);
      });
    });
  });
});
