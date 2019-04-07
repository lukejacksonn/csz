import stylis from './stylis.js'

const cache = {}
const hash = () =>
  Math.random()
    .toString(36)
    .replace('0.', '')

const process = key => hash => rules => {
  sheet.innerHTML += (cache[key] = {
    hash,
    rules: stylis()(`.${hash}`, rules),
  }).rules
}

// The global stylesheet that rules get added to
const sheet = document.createElement('style')
document.head.appendChild(sheet)

export default (strings, ...values) => {
  const key = strings[0].startsWith('/')
    ? strings[0]
    : strings.reduce(
        (acc, string, i) =>
          (acc += string + (values[i] == null ? '' : values[i])),
        ''
      )

  console.log(cache[key] && cache[key].hash)

  if (cache[key]) return cache[key].hash

  const className = 'csz-' + hash()
  const append = process(key)(className)

  if (key.startsWith('/')) {
    fetch(key)
      .then(res => res.text())
      .then(append)
  } else append(key)

  return className
}
