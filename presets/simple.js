// simple convention
// BREAKING CHANGE - major (level 0)
// feat(*)  - minor (level 1)
// fix(*)   - patch (level 2)
// anything else - no bump
var presetOpts = {
  whatBump: function(commits) {
    var level;
    var breakings = 0;
    var features = 0;
    var fixes = 0;

    commits.forEach(function(commit) {
      if (commit.notes.length > 0) {
        breakings += commit.notes.length;
        level = 0;
      } else if (commit.type === 'feat') {
        features += 1;
        if (level === undefined || level === 2) {
          level = 1;
        }
      } else if (commit.type === 'fix') {
        fixes += 1;
        if (level === undefined) {
          level = 2;
        }
      }
    });

    return {
      level: level,
      reason: 'There are ' + breakings + ' BREAKING CHANGE(S), ' +
        features + ' feature(s) and ' + fixes + ' fix(es)'
    };
  },
  parserOpts: {
    headerPattern: /^(\w*)(?:\((.*)\))?\: (.*)$/,
    headerCorrespondence: [
      'type',
      'scope',
      'subject'
    ],
    noteKeywords: 'BREAKING CHANGE',
    revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
    revertCorrespondence: ['header', 'hash']
  }
};

module.exports = presetOpts;
