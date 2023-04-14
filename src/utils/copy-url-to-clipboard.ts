import { clipboard, notification } from '@tauri-apps/api';

const copyUrlToClipboard = (string: string): boolean => {
  if (string) {
    clipboard.writeText(string);
    notification.sendNotification({
      body: 'URL copied to clipboard',
      title: 'Browsernaut',
    });
    return true;
  }

  return false;
};

export default copyUrlToClipboard;
