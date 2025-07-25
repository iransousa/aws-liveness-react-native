# AWS Liveness Turbo Modules

[![npm version](https://badge.fury.io/js/aws-liveness-turbo-modules.svg)](https://badge.fury.io/js/aws-liveness-turbo-modules)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

React Native Turbo Module for AWS Amplify Face Liveness Detection with multi-language support and secure credential management.

## 🚀 Quick Start

### Installation

```bash
npm install aws-liveness-turbo-modules
# or
yarn add aws-liveness-turbo-modules
```

**✨ Auto-Configuration**: The package automatically configures your Android project during installation. No manual setup required!

### Basic Usage

```typescript
import AwsLivenessTurboModules from 'aws-liveness-turbo-modules';
import { DeviceEventEmitter } from 'react-native';

// Start face liveness detection
const startLiveness = async () => {
  try {
    const result = await AwsLivenessTurboModules.startFaceLivenessDetection(
      'session-id',
      'access-key-id',
      'secret-key',
      'session-token',
      'expiration-date'
    );
    console.log('Liveness started:', result);
  } catch (error) {
    console.error('Liveness error:', error);
  }
};

// Listen for results
DeviceEventEmitter.addListener('FaceLivenessComplete', (data) => {
  console.log('Liveness completed:', data);
});

DeviceEventEmitter.addListener('FaceLivenessError', (error) => {
  console.error('Liveness error:', error);
});
```

## ✨ Features

- 🔐 **AWS Amplify Integration** - Native integration with AWS Amplify Face Liveness
- 🌍 **Multi-language Support** - Portuguese and English interfaces
- 📱 **React Native Turbo Module** - High-performance native implementation
- 🎨 **Jetpack Compose UI** - Modern Android interface with dark mode support
- 🔒 **Secure Credential Management** - Built-in credential rotation support
- 📋 **Permission Handling** - Automatic camera permission management
- 🎯 **TypeScript Support** - Full TypeScript definitions included

## 📋 Requirements

- React Native >= 0.70.0
- React >= 18.0.0
- Android API Level >= 24
- AWS Amplify account with Face Liveness enabled

## 🔧 Setup

### Automatic Configuration ✅

The package automatically configures your Android project during installation:

- ✅ Adds required permissions to `AndroidManifest.xml`
- ✅ Adds AWS Amplify dependencies to `build.gradle`
- ✅ Copies native Kotlin files to your project
- ✅ Updates `MainApplication.java` to include the module

### Manual Configuration (if needed)

If automatic configuration fails, run:

```bash
npm run setup-manual
```

This will show you step-by-step instructions for manual setup.

### Android Configuration (Manual)

1. **Add permissions to `android/app/src/main/AndroidManifest.xml`:**
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.INTERNET" />
```

2. **Add dependencies to `android/app/build.gradle`:**
```gradle
dependencies {
    implementation 'com.amplifyframework:aws-auth-cognito:2.0.0'
    implementation 'com.amplifyframework:aws-predictions:2.0.0'
    implementation 'androidx.compose.ui:ui:1.5.0'
    implementation 'androidx.compose.material3:material3:1.1.0'
}
```

3. **Configure AWS Amplify in your app**

### iOS Configuration

1. **Add camera permission to `ios/YourApp/Info.plist`:**
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access for face liveness detection</string>
```

2. **Install AWS Amplify iOS dependencies**

## 📚 Documentation

- **[Complete Documentation (PT)](README_FACE_LIVENESS.md)** - Documentação completa em Português
- **[Complete Documentation (EN)](README_FACE_LIVENESS_EN.md)** - Complete documentation in English
- **[Integration Guide](INTEGRATION_GUIDE.md)** - How to integrate into existing projects
- **[Security Guide](SECURITY_GUIDE.md)** - Secure credential rotation and management
- **[Documentation Index](DOCUMENTATION.md)** - Index of all available documentation

## 🔐 Security

This module includes built-in support for secure AWS credential rotation. See the [Security Guide](SECURITY_GUIDE.md) for implementation details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/aws-liveness-turbo-modules/issues)
- **Documentation**: See the documentation files above
- **Community**: React Native community forums

## 🔗 Links

- [AWS Amplify Face Liveness](https://ui.docs.amplify.aws/android/connected-components/liveness)
- [React Native Native Modules](https://reactnative.dev/docs/native-modules-android)
- [Jetpack Compose](https://developer.android.com/jetpack/compose)

---

**Made with ❤️ for the React Native community**
