import { execSync } from 'node:child_process';
import path from 'node:path';

function getAllInstalledAppNames(): string[] {
  const appNames = execSync(
    'find /Applications -iname "*.app" -prune -not -path "*/.*" 2>/dev/null ||true'
  )
    .toString()
    .trim()
    .split('\n')
    .map((appPath) => path.parse(appPath).name);

  return appNames;
}

export { getAllInstalledAppNames };
