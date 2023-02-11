import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.dos.swquince.upsrj',
  appName: 'app_02',
  webDir: 'www',
  bundledWebRuntime: false,
  android: {
        allowMixedContent: true
  }
};

export default config;
