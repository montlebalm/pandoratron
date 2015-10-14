# Pandoratron

Streaming audio on OS X

## Tasks

[ ] Refactor React components
[ ] Style UI
  [ ] Style login
  [ ] Style stations
  [ ] Style current song
  [ ] Style controls
[ ] Implement "Keep me logged in"
[ ] Preload next song
[ ] Track played songs
[ ] Implement skip
[ ] Implement thumbs up, thumbs down
[ ] Enable media keys
[ ] Package as executable
[ ] Allow executable to auto-update

## Install

Install dependencies.

```bash
$ npm install
```

## Run

```bash
npm run hot-server
npm run start-hot
```

## Package

```bash
npm run package
```

#### Options

- --name, -n: Application name (default: ElectronReact)
- --version, -v: Electron version (default: latest version)
- --asar, -a: [asar](https://github.com/atom/asar) support (default: false)
- --icon, -i: Application icon
- --all: pack for all platforms

Use `electron-packager` to pack your app with `--all` options for darwin (osx), linux and win32 (windows) platform. After build, you will find them in `release` folder. Otherwise, you will only find one for your os.

`test`, `tools`, `release` folder and devDependencies in `package.json` will be ignored by default.

#### Default Ignore modules

We add some module's `peerDependencies` to ignore option as default for application size reduction.

- `babel-core` is required by `babel-loader` and its size is ~19 MB
- `node-libs-browser` is required by `webpack` and its size is ~3MB.

> **Note:** If you want to use any above modules in runtime, for example: `require('babel/register')`, you should move them form `devDependencies` to `dependencies`.

#### Building windows apps from non-windows platforms

Please checkout [Building windows apps from non-windows platforms](https://github.com/maxogden/electron-packager#building-windows-apps-from-non-windows-platforms).
