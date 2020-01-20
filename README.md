# csz

> Runtime CSS modules with SASS like preprocessing

A framework agnostic css-in-js solution that uses [stylis](https://github.com/thysultan/stylis.js) to parse styles from tagged template literals and append them to the head of the document at runtime. Loading in stylesheets dynamically – from .css files – is supported out of the box, so you can write your styles in `.css` files and import them via url without having to worry about flashes of unstyled content.

## Features

- Efficient caching of styles
- Import styles from regular `.css` files
- Available as an ES module (from [unpkg.com](https://unpkg.com/csz))
- Styles scoped under unique namespaces `.csz-lur7p80ssnq`
- Global style injection `:global(selector)`
- Nested selectors `a { &:hover {} }`
- Vendor prefixing `-moz-placeholder`
- Flat stylesheets `color: red; h1 { color: red; }`
- Minification of appended styles
- Keyframe and animation namespacing

## Usage

The package is designed to be used as an ES module. You can import it directly from [unpkg.com](https://unpkg.com/csz/):

```js
import css from 'https://unpkg.com/csz';

// static
const inlined = css`background: blue;`; // generate class name for ruleset

// dynamic (from stylesheet)
const relative = css`/index.css`; // generate class name for file contents
const absolute = css`https://example.com/index.css`; // generate class name for file contents
```

Both variations (static and dynamic) are sync and return a string in a format similar to `csz-b60d61b8`. If a ruleset is provided as a string then it is processed immediately but if a filepath is provided then processing is deferred until the contents of the file has been fetched and parsed.

> **NOTE:** File paths starting with `/` must be relative to the current hostname, so if you are running your app on `example.com` and require `/styles/index.css` then csz will try fetch it from `example.com/styles/index.css`.

Styles imported from a file are inevitably going to take some amount of time to download. Whilst the stylesheet is being downloaded a temporary ruleset is applied to the element which hides it (using `display: none`) until the fetched files have been processed. This was implemented to prevent flashes of unstyled content.

See below for an example of what a raw ruleset might look like and how it looks like after processing.

<details>
  <summary>Example stylesheet (unprocessed)</summary>
  
  ```scss
  font-size: 2em;

  // line comments
  /* block comments */

  :global(body) {background:red}

  h1 {
    h2 {
      h3 {
        content:'nesting'
      }
    }
  }

  @media (max-width: 600px) {
    & {display:none}
  }

  &:before {
    animation: slide 3s ease infinite
  }

  @keyframes slide {
    from { opacity: 0}
    to { opacity: 1}
  }

  & {
    display: flex
  }

  &::placeholder {
    color:red
  }
  ```

</details>

<details>
  <summary>Example stylesheet (processed)</summary>

  ```scss
    .csz-a4B7ccH9 {font-size: 2em;}

    body {background:red}
    h1 h2 h3 {content: 'nesting'}

    @media (max-width: 600px) {
      .csz-a4B7ccH9 {display:none}
    }

    .csz-a4B7ccH9:before {
      -webkit-animation: slide-id 3s ease infinite;
      animation: slide-id 3s ease infinite;
    }


    @-webkit-keyframes slide-id {
      from { opacity: 0}
      to { opacity: 1}
    }
    @keyframes slide-id {
      from { opacity: 0}
      to { opacity: 1}
    }

    .csz-a4B7ccH9 {
      display:-webkit-box;
      display:-webkit-flex;
      display:-ms-flexbox;
      display:flex;
    }

    .csz-a4B7ccH9::-webkit-input-placeholder {color:red;}
    .csz-a4B7ccH9::-moz-placeholder {color:red;}
    .csz-a4B7ccH9:-ms-input-placeholder {color:red;}
    .csz-a4B7ccH9::placeholder {color:red;}
  ```
</details>

## Example

This library is framework agnostic but here is a contrived example of how you can style a React component conditionally based upon some state; demonstrating switching between static and dynamic styles on the fly.

```jsx
import css from 'https://unpkg.com/csz';

export default () => {
  const [toggle, setToggle] = React.useState(false);
  return (
    <div
      className={toggle
        ? css`/index.css`
        : css`background: blue;`}
    >
      <h1>Hello World!</h1>
      <button onClick={e => setToggle(!toggle)}>Toggle</button>
    </div>
  );
};
```

## Implementation

I was inspired by [emotion](https://github.com/emotion-js/emotion) and [styled-components](https://github.com/styled-components/styled-components) but unfortunately neither of these packages expose an es module compatible build and come with quite a lot of extraneous functionality that isn't required when the scope of the project is restricted to runtime only class name generation and ruleset isolation.
