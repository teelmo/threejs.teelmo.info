# threejs.teelmo.info

A 360° panorama viewer built with three.js — drag/orbit around garden and pool photos, with Previous/Next buttons to switch between scenes.

An earlier, unused alternate scene (a static mountain/cloud composition) is kept in `src/jsx/MountainScene.jsx`, commented out in `App.jsx` — swap it back in by uncommenting the import if wanted.

**Live**: https://teelmo.github.io/threejs.teelmo.info/

## Tech stack

- [Vite](https://vitejs.dev/) + React 19
- [Biome](https://biomejs.dev/) for formatting/linting
- [@teelmo/web-styles](https://github.com/teelmo/web-tools) for the shared CSS reset/basics
- [three.js](https://threejs.org/) with `OrbitControls`, driven in `src/jsx/AnotherScene.jsx`

## Development

```
npm install
npm start
```

Opens at http://localhost:8080.

## Build

```
npm run build
```

## Deploy

```
npm run push            # push to GitHub
npm run sync-gh-pages   # publish dist/ to the gh-pages branch
```
