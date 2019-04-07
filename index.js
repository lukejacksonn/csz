import stylis from './stylis.js'

// Keep track of which styles have been added
// (keyed by hash of a rule set or file path)
const cache = {}

// The global stylesheet that rules get added to
const sheet = document.createElement('style')
document.head.appendChild(sheet)

export default (strings, ...values) => {
  // ---------------------------------------
  // A file path was provided
  // ---------------------------------------

  if (strings[0].startsWith('/')) {
    // Use the file name as the uid
    const className = '.csz-' + hash(strings[0])
    if (!cache[className]) {
      fetch(strings[0])
        .then(res => res.text())
        .then(str => {
          cache[className] = true
          // Prefix every rule in the file with the uid and append style
          sheet.innerHTML += stylis()(className, str)
        })
    }
    return className.slice(1)
  }

  // ---------------------------------------
  // A rule set was supplied
  // ---------------------------------------

  // Zip constant string parts with any interpolated dynamic values
  const str = strings.reduce(
    (acc, string, i) => (acc += string + (values[i] == null ? '' : values[i])),
    ''
  )

  // Use a hash of the ruleset as the uid
  const className = '.csz-' + hash(str)
  if (!cache[className]) {
    cache[className] = true
    // Prefix the rule set with the uid and append style
    sheet.innerHTML += stylis()(className, str)
  }
  return className.slice(1)
}

// ---------------------------------------
// Hashing functions
// ---------------------------------------

function pad(hash, len) {
  while (hash.length < len) {
    hash = '0' + hash
  }
  return hash
}

function fold(hash, text) {
  var i
  var chr
  var len
  if (text.length === 0) {
    return hash
  }
  for (i = 0, len = text.length; i < len; i++) {
    chr = text.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return hash < 0 ? hash * -2 : hash
}

function foldObject(hash, o, seen) {
  return Object.keys(o)
    .sort()
    .reduce(foldKey, hash)
  function foldKey(hash, key) {
    return foldValue(hash, o[key], key, seen)
  }
}

function foldValue(input, value, key, seen) {
  var hash = fold(fold(fold(input, key), toString(value)), typeof value)
  if (value === null) {
    return fold(hash, 'null')
  }
  if (value === undefined) {
    return fold(hash, 'undefined')
  }
  if (typeof value === 'object') {
    if (seen.indexOf(value) !== -1) {
      return fold(hash, '[Circular]' + key)
    }
    seen.push(value)
    return foldObject(hash, value, seen)
  }
  return fold(hash, value.toString())
}

function toString(o) {
  return Object.prototype.toString.call(o)
}

function hash(o) {
  return pad(foldValue(0, o, '', []).toString(16), 8)
}
