# React tempate

**[中文文档](./README_zh.md) | English**

🎉 react template based on CRA, support antd, less, decorator and webpack alias.

😁 Happy coding

## Start up

1. Clone template

```bash
git clone https://github.com/Gu-Miao/react-template.git
```

2. Remove useless files and config

If you don't use antd, you could remove it, if you don't use uuid, you could remove it too. Do what ever you want.

3. Add dependencies

```bash
npm install

# or use Yarn
yarn
```

4. Start dev server

```bash
npm start

# or use Yarn
yarn start
```

Wait a moment, you could see your page on https://localhost:5000.

## Config

### Use antd-mobile

Remove `antd` and add `antd-mobile`

```bash
npm uninstall antd
npm install antd-mobile -S

# or use Yarn
yarn remove antd
yarn add antd-mobile
```

change `libraryName` from `antd` to `antd-mobile` in `.cracorc.js`.

> If you neither use `antd` nor `antd-mobile`, you can directly remove import plugin in `.cracorc.js` and uninstall it.

### Modify webpack alias

See `.cracorc.js` and `jsconfig.json`.

### Change dev server port

Set `PORT` in `.env`.

### Add source map for production build

Set `GENERATE_SOURCEMAP` in `.env` to `false`.

### Set proxy

see `src/setupProxy.js`。

## Advanced

### Set webpack

We use `craco` to customize webpack, eslint and babel, if you need advanced usage, please read its official document.

### config router

We use a simple router config, the config file is `src/router.js`, see `src/App.js`, you could now how it render routes. Though it is easy to read, but it still have something to pay your attention:

1. No nesting supported.
2. You could add when to use cache route, it is based on [eact-router-cache-route](https://github.com/CJY0208/react-router-cache-route).
3. Key `component` has a prefix `@pages/`.
4. Key `title` is use to modify `document.title` when `Route` rendered.

### Why not use a status management library?

You could do what ever you want, so, we'd like to give it to you.

## License

MIT
