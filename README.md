# csz
> Super lightweight CSS module like behavior at runtime

A rudimentary, framework agnostic css-in-js solution that takes styles from a tagged template literal and hashes them to create a unique key which is used as a class name when appending the ruleset to a global stylesheet in the document head at runtime - no build step necessary. It also provides means of importing styles dynamically (an experimental feature) so that you can write your rules in `.css` files as per usual.

## Features

- Super light weight and dependency free
- Available as an ES module (imported directly from [unpkg.com](https://unpkg.com/csz))
- Import styles from a regular `.css` file

## Usage

The package is designed to be used as an ES module. You can import it directly from [unpkg.com](https://unpkg.com):

```js
import css from 'https://unpkg.com/csz';

const static = css`background: blue` // generate class name from string
const dynamic = css`/index.css` // generate class name from file
```

Both variations (static and dynamic) are sync and return a string of the form `csz-b60d61b8`. When using the static method write _naked_ rule sets – no need to wrap the rules in braces or assign an identifier.

When importing rules from a file then write your rules as you would do normally – with some kind of identifier followed by a rule set wrapped in curly braces. All the rules in the file will be scoped under the hash of the file name. For example:

```css
h1 { background: red; }
.btn { background: blue; }
```

If your css file looks like the above then it will be appended to the stylesheet like below:

```css
.csz-b60d61b8 h1 { background: red; }
.csz-b60d61b8 .btn { background: blue; }
```

Because the supplied file path is used as the key it will only ever be fetched once.

## Example

Here is an example of how you can style a (react) component conditionally based upon some state.

```js
import css from 'https://unpkg.com/csz';

export default () => {
  const [toggle, setToggle] = React.useState(false)
  return html`
    <div className=${toggle ? css`/index.css` : css`background: blue`}>
      <h1>Hello World!</h1>
      <button onClick=${e => setToggle(!toggle)}>Toggle</button>
    </div>
  `
}
```

> All file paths must start with a `/` and be absolute (relative to the window location) so if you are running your app on `example.com` and require `/styles/index.css` then csz will try fetch it from `example.com/styles/index.css`.

## Implementation

I was inspired by [emotion](https://github.com/emotion-js/emotion) and [styled-components](https://github.com/styled-components/styled-components) but unfortunately neither of these packages expose an es module compatible build and come with quite a lot of extraneous functionality that isn't required when the scope of the project is restricted to runtime only class name generation with a (very) simple caching mechanism with no cleanup strategy.

There is a lot about this implementation that is not _optimal_. It is a proof of concept more than anything.
