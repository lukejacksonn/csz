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
  const classPrefix = strings[0].startsWith('.') ? strings[0].substring(1, strings[0].indexOf(' ')) : "csz-"
  const key = strings[0].startsWith('/')
    ? strings[0]
    : strings.reduce(
      (acc, string, i) =>
        (acc += string + (values[i] == null ? '' : values[i])),
      ''
    )

  if (cache[key]) return cache[key].className

  const className = (classPrefix.charAt(--classPrefix.length) === '-' ? classPrefix : classPrefix + '-') + cszCounter++
  const append = process(key)(className)

  if (key.startsWith('/')) {
    hide(className)
    fetch(key)
      .then(res => res.text())
      .then(append)
  } else if (key.startsWith('.')) {
    // Below supports both csz`.my-class { background: blue; }` Or csz`.my-class background: blue;`
    const ruleStart = key.indexOf(' ') === key.replace(' ', '').indexOf('{') ? key.indexOf('{') : key.indexOf(' ')
    const ruleEnd = key.trim().lastIndexOf('}') === key.length - 1 ? key.lastIndexOf('}') : key.length
    append(key.substring(ruleStart + 1, ruleEnd))
  } else append(key)

  return className
}
