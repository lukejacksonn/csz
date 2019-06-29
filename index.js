import stylis from './stylis.js'

const cache = {}
let cszCounter = 0

const sheet = document.createElement('style')
document.head.appendChild(sheet)

const none = className => `.${className}{display:none}`
const hide = className => (sheet.innerHTML = none(className) + sheet.innerHTML)
const show = className => (sheet.innerHTML = sheet.innerHTML.replace(none(className), ''))

const process = key => className => rules => {
  if (key.startsWith('/')) show(className)
  sheet.innerHTML += (cache[key] = {
    className,
    rules: stylis()(`.${className}`, rules),
  }).rules
}

export default (strings, ...values) => {
  const [, classSubstr, classPrefix] = strings[0].match(/^(\.(\S+)\s*)?.+/)
  const className = [(classPrefix || "csz"), '-', cszCounter++].join('')
  const rules = [classPrefix ? strings[0].substring(classSubstr.length) : strings[0]].concat(strings.slice(1))
  const key = strings[0].startsWith('/')
    ? strings[0]
    : rules.reduce(
      (acc, string, i) =>
        (acc += string + (values[i] == null ? '' : values[i])),
      ''
    )

  if (cache[key]) return cache[key].className
  const append = process(key)(className)

  if (key.startsWith('/')) {
    hide(className)
    fetch(key)
      .then(res => res.text())
      .then(append)
  } else append(key)

  return className
}
