# fxhash-r3f-template

This is a quickstart template based on `create-react-app` for creating [`fxhash`](https://www.fxhash.xyz) tokens using [`react-three-fiber`](https://github.com/pmndrs/react-three-fiber) + `typescript`.

![image](https://user-images.githubusercontent.com/5009316/142333930-565052ab-a860-4081-b6b5-3c174e5a17a9.png)

## Development

`npm i` or `yarn` to install dependencies.

`npm run start` - begin live-reload local development

### fxhash

The fxhash host exposes two useful functions, `fxhash` and `fxrand`, which are easily accessed via `fxhash.ts` which exports `fxhash()` and `fxrand()`.

See the [fxhash guide](https://www.fxhash.xyz/articles/guide-mint-generative-token).

We also expose a method to register features of your token via `registerFeatures({"feat-a": true})` in the same module.

### index.html

The root `html` file (located in the `public/` folder) can be edited freely so long as you preserve the `fxhash` snippet and the filepaths.

## Packaging + Release

`npm run release` will build & package into `fxhash-release.zip`, ready to upload to the site.

Noteable hashes:

Floral Delicacy
ookGiPKemj1SzfpuNvqbqAuE3dceMi4f9nDr9FGC9epciRK1oSz
oo64t5PwU5sP4YmnMKZWRWAQs9LfGs2AGWRsoZBfc57HXZDUjbh

Strawberry Theif
oogUuvjJXa6QAvw9Q8T3KKAkZSpbNaT7iyjR5oDJh8NJ7tcCG3e

Mystic Forest
oouxjQUqJ5rJxgxPRixru2x1FPY2KMoedrV17JVviVdaeFQ5keb

Autumn Hike
ooNaiJ6AgtMQezqdqf2rFHFMES1jQRpWJ1QjSdAtnrxDfSuf57A
ooXXaX3LKJkkvkrciU3SuGLNxSVr3pUsVe8uo6LYf1FUKRtmYUd

Tropicana
ooS8MGUh3mesCnY2D4L1rrAhryUtvHVXxjBzPw5mmQbScZi76ag

Celestial Spectrum
ooQjntzzAAEU3ZnPD67D3Nip2UhMcEDsYFVFKetuqzfNBYPfaJu
