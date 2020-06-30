import path from 'path'
import type { StorybookConfig } from '@storybook/core/types'

const tsconfig = path.resolve(__dirname, '../../tsconfig.json')

const storybookConfig: StorybookConfig = {
  stories: ['../../src/components/**/*.stories.@(tsx|mdx)'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-toolbars',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
  ],
  typescript: {
    check: true,
    checkOptions: { tsconfig },
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      tsconfigPath: tsconfig,
      propFilter: (prop: { name: string }): boolean => !/^(testID)$/.test(prop.name),
      compilerOptions: {
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
      },
    },
  },
  webpackFinal: async config => {
    if (!config?.resolve) {
      return config
    }

    if (config.module) {
      config.module.rules.push({
        test: /\.js$/,
        include: [path.resolve(__dirname, '../../node_modules/react-native-vector-icons/')],
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: false,
            presets: [
              ['module:metro-react-native-babel-preset', { disableImportExportTransform: true }],
            ],
          },
        },
      })
    }

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Replace react-native dependencies with react-native-web
      'react-native$': 'react-native-web',
      // Replace @storybook/react-native with @storybook/react
      '@storybook/react-native': '@storybook/react',
      // Make react-native-svg work
      'react-native-svg': 'react-native-svg/lib/commonjs/ReactNativeSVG.web',
      // Mock react-native-safe-area-context
      'react-native-safe-area-context': path.resolve(
        __dirname,
        '../../src/storybook/utils/react-native-safe-area-context',
      ),
      // Mock react-native-screens
      'react-native-screens': path.resolve(
        __dirname,
        '../../src/storybook/utils/react-native-screens',
      ),
      // Mock @expo/vector-icons with react-native-vector-icons
      '@expo/vector-icons$': path.resolve(__dirname, '../../src/storybook/utils/expo-vector-icons'),
    }

    return config
  },
}

export default storybookConfig
