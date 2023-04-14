import { checkUpdate } from '@tauri-apps/api/updater';
const update = await checkUpdate();
//? This will probably move to the about component

// export function getUpdateUrl(): string {
//   return `https://update.electronjs.org/will-stone/browserosaurus/darwin-${
//     process.arch
//   }/${app.getVersion()}`;
// }
