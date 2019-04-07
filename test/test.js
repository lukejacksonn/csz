import { React, ReactDOM } from 'https://unpkg.com/es-react'
import css from '../index.js'
import htm from 'https://unpkg.com/htm?module'
const html = htm.bind(React.createElement)

const style = {
  inline: css`
    background: blue;
    & button {
      background: hotpink;
    }
  `,
  file: css`/test/index.css`,
}

const App = () => {
  const [toggle, setToggle] = React.useState(false)
  return html`
    <div className=${toggle ? style.inline : style.file}>
      <h1>Hello World!</h1>
      <button className="btn" onClick=${e => setToggle(!toggle)}>Toggle</button>
    </div>
  `
}

ReactDOM.render(React.createElement(App), document.body)
