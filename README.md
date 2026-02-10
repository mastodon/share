# share.joinmastodon.org

This repository contains the source for [share.joinmastodon.org](https://share.joinmastodon.org), the share widget for [Mastodon](https://github.com/mastodon).

## Development

To build and run the site locally, you'll need to have Node.js version 20 installed, which you can [download from the Node.js website](https://nodejs.org/download/release/v20.0.0/) or install via tools like `fnm` or `nvm`. For dependency management, `npm` is used.

### Installation

```sh
npm
npm run dev
```

See [`package.json`](./package.json) for more scripts.

### Contributing

All interactions with this and other repositories that are part of the Mastodon project are subject to the [Mastodon Code of Conduct](https://github.com/mastodon/.github/blob/main/CODE_OF_CONDUCT.md).

### Built with

- [Vite](https://vite.dev/)
- [Tailwind.css](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest/docs/react/adapters/react-query)
- [React Intl](https://formatjs.io/docs/react-intl/)

## Deployment

You can generate a static site with `npm run build`.
