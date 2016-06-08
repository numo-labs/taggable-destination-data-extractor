var assert = require('assert');
var remove_links = require('../lib/remove_links_regex');

describe('remove_links (regex)', function () {
  it('Removes <a href="anything"> from text without removing the link text', function () {
    var example = 'Hello <a href=""{res:14947}"">Miami Beach</a> world!';
    var expected = 'Hello Miami Beach world!'
    var actual = remove_links(example);
    // console.log(expected === actual, expected, '===', actual);
    assert.equal(expected, actual);
  });
});
