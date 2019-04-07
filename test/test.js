import { React, ReactDOM } from 'https://unpkg.com/es-react'
import css from '../index.js'
import htm from 'https://unpkg.com/htm?module'
const html = htm.bind(React.createElement)

const App = () => {
  const [toggle, setToggle] = React.useState(true)
  return html`
    <div
      className=${toggle
        ? css`
            background: blue;
            & button {
              background: hotpink;
            }
          `
        : css`/test/index.css`}
    >
      <h1>Hello World!</h1>
      <button className="btn" onClick=${e => setToggle(!toggle)}>Toggle</button>
    </div>
  `
}

ReactDOM.render(React.createElement(App), document.body)
