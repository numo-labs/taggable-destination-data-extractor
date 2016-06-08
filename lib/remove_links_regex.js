var link_regex = /(<\/?a(|\s+[^>]+)>)/g;

function remove_links (text) {
  return text.replace(link_regex, '');
}
module.exports = remove_links;
