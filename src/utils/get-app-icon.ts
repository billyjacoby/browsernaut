import { invoke } from "@tauri-apps/api";

export const getAppIcon = async (appName: string, size?: number) => {
  return await invoke<string>("retrieve_app_icon", {
    file: appName,
    size,
  });
};

export const getAppIcons = async (appNames: string[], size?: number) => {
  const reqs = appNames.map((name) => getAppIcon(name, size));

  const results = await Promise.allSettled(reqs);

  return results.map((item) => {
    if (item.status === "fulfilled") {
      return item.value;
    } else {
      return "";
    }
  });
};
