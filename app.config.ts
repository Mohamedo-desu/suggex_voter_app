import { ConfigContext, ExpoConfig } from "expo/config";

const EAS_PROJECT_ID = "319b270f-8dce-4ca7-88c6-edca1bd68b6a";
const PROJECT_SLUG = "suggex";
const OWNER = "mohamedo-desu";

// App production config
const APP_NAME = "Voting Box";
const BUNDLE_IDENTIFIER = `com.mohamedodesu.${PROJECT_SLUG}`;
const PACKAGE_NAME = `com.mohamedodesu.${PROJECT_SLUG}`;
const ICON = "./assets/icons/icon.png";
const ADAPTIVE_ICON = "./assets/icons/adaptive-icon.png";
const SCHEME = PROJECT_SLUG;

export default ({ config }: ConfigContext): ExpoConfig => {
  console.log("⚙️ Building app for environment:", process.env.APP_ENV);
  const { name, icon, adaptiveIcon, packageName, scheme } = getDynamicAppConfig(
    (process.env.APP_ENV as "development" | "preview" | "production") ||
      "preview"
  );

  return {
    ...config,
    name: name,
    version: "3.0.0",
    slug: PROJECT_SLUG,
    orientation: "portrait",
    newArchEnabled: true,
    icon: icon,
    scheme: scheme,
    android: {
      adaptiveIcon: {
        foregroundImage: adaptiveIcon,
        backgroundColor: "#ffffff",
      },
      package: packageName,
      softwareKeyboardLayoutMode: "pan",
      edgeToEdgeEnabled: true,
    },
    updates: {
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    extra: {
      eas: {
        projectId: EAS_PROJECT_ID,
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/icons/splash-icon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/icons/splash-icon.png",
          imageWidth: 150,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            image: "./assets/icons/splash-icon.png",
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "@sentry/react-native/expo",
        {
          organization: "mohamedo-apps-desu",
          project: PROJECT_SLUG,
        },
      ],
      [
        "expo-font",
        {
          fonts: [
            "./assets/fonts/Urbanist-Bold.ttf",
            "./assets/fonts/Urbanist-Medium.ttf",
            "./assets/fonts/Urbanist-Regular.ttf",
          ],
        },
      ],
      "expo-secure-store",
      "expo-web-browser",
    ],
    experiments: {
      typedRoutes: true,
      reactCanary: true,
      remoteBuildCache: {
        provider: "eas",
      },
    },
    owner: OWNER,
  };
};

export const getDynamicAppConfig = (
  environment: "development" | "preview" | "production"
) => {
  if (environment === "production") {
    return {
      name: APP_NAME,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      packageName: PACKAGE_NAME,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: SCHEME,
    };
  }

  if (environment === "preview") {
    return {
      name: `${APP_NAME}`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
      packageName: `${PACKAGE_NAME}.preview`,
      icon: "./assets/icons/icon.png",
      adaptiveIcon: "./assets/icons/adaptive-icon.png",
      scheme: `${SCHEME}-prev`,
    };
  }

  return {
    name: `${APP_NAME} Development`,
    bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
    packageName: `${PACKAGE_NAME}.dev`,
    icon: "./assets/icons/icon.png",
    adaptiveIcon: "./assets/icons/adaptive-icon.png",
    scheme: `${SCHEME}-dev`,
  };
};
