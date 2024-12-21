import { AppName, apps } from "@config/apps";
import { Command } from "@tauri-apps/api/shell";

export function openApp(
  appName: AppName,
  url: string,
  isAlt?: boolean,
  isShift?: boolean,
): void {
  const selectedApp = apps[appName];

  const convertedUrl =
    "convertUrl" in selectedApp ? selectedApp.convertUrl(url) : url;

  const openArguments: string[] = [
    "-a",
    appName,
    isAlt ? "--background" : [],
    isShift && "privateArg" in selectedApp
      ? ["--new", "--args", selectedApp.privateArg]
      : [],
    // In order for private/incognito mode to work the URL needs to be passed
    // in last, _after_ the respective app.privateArg flag
    convertedUrl,
  ]
    .filter(Boolean)
    .flat();

  try {
    new Command("open-app", openArguments).execute();
  } catch (e) {
    console.error("error opening app: ", e);
  }
}
