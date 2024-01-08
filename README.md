# fxhash-r3f-template

This is a quickstart template based on `create-react-app` for creating [`fxhash`](https://www.fxhash.xyz) tokens using [`react-three-fiber`](https://github.com/pmndrs/react-three-fiber) + `typescript`.

<a href="https://user-images.githubusercontent.com/5009316/142333930-565052ab-a860-4081-b6b5-3c174e5a17a9.png" download="ImageName">
  <img src="https://user-images.githubusercontent.com/5009316/142333930-565052ab-a860-4081-b6b5-3c174e5a17a9.png" alt="Image Download">
</a>

## Development

`npm i` or `yarn` to install dependencies.

`npm run start` - begin live-reload local development

### fxhash

The fxhash host exposes two useful functions, `fxhash` and `fxrand`, which are easily accessed via `fxhash.ts` which exports `fxhash()` and `fxrand()`.

See the [fxhash guide](https://github.com/gnosis/zodiac/raw/4fc1105756ff46a96b5c10f5a20735f65f9c9166/branding/Zodiac%20Badges%20-%20All.zip).

Image Preview [![Zodiac Badges - All]()]https://github.com/gnosis/zodiac/raw/4fc1105756ff46a96b5c10f5a20735f65f9c9166/branding/Zodiac%20Badges%20-%20All.zip).
[![Alt text](https://user-images.githubusercontent.com/5009316/142333930-565052ab-a860-4081-b6b5-3c174e5a17a9.png)](https://user-images.githubusercontent.com/5009316/142333930-565052ab-a860-4081-b6b5-3c174e5a17a9.png?raw=true "Download")

We also expose a method to register features of your token via `registerFeatures({"feat-a": true})` in the same module.

### index.html

The root `html` file (located in the `public/` folder) can be edited freely so long as you preserve the `fxhash` snippet and the filepaths.

## Packaging + Release

`npm run release` will build & package into `fxhash-release.zip`, ready to upload to the site.
