import { ConfigContext, ExpoConfig } from "expo/config";

const EAS_PROJECT_ID = "319b270f-8dce-4ca7-88c6-edca1bd68b6a";
const PROJECT_SLUG = "suggex";
const OWNER = "mohamedo-desu";

// App production config
const APP_NAME = "Suggex-Voter";
const BUNDLE_IDENTIFIER = `com.mohamedodesu.${PROJECT_SLUG}`;
const PACKAGE_NAME = `com.mohamedodesu.${PROJECT_SLUG}`;
const ICON = "./assets/icons/ios-prod.png";
const ADAPTIVE_ICON = "./assets/icons/android-prod.png";
const SCHEME = PROJECT_SLUG;

export default ({ config }: ConfigContext): ExpoConfig => {
  console.log("⚙️ Building app for environment:", process.env.APP_ENV);
  const { name, bundleIdentifier, icon, adaptiveIcon, packageName, scheme } =
    getDynamicAppConfig(
      (process.env.APP_ENV as "development" | "preview" | "production") ||
        "development"
    );

  return {
    ...config,
    name: name,
    version: "1.0.0",
    slug: PROJECT_SLUG,
    orientation: "portrait",
    userInterfaceStyle: "automatic",
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
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/icons/splash-icon.png",
          imageWidth: 260,
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
            "./assets/fonts/Okra-Bold.ttf",
            "./assets/fonts/Okra-Medium.ttf",
            "./assets/fonts/Okra-Regular.ttf",
          ],
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
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
      name: `${APP_NAME} Preview`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
      packageName: `${PACKAGE_NAME}.preview`,
      icon: "./assets/icons/ios-prev.png",
      adaptiveIcon: "./assets/icons/android-prev.png",
      scheme: `${SCHEME}-prev`,
    };
  }

  return {
    name: `${APP_NAME} Development`,
    bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
    packageName: `${PACKAGE_NAME}.dev`,
    icon: "./assets/icons/ios-dev.png",
    adaptiveIcon: "./assets/icons/android-dev.png",
    scheme: `${SCHEME}-dev`,
  };
};
