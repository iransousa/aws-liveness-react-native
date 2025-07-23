# AWS Liveness Turbo Modules

This is a [**React Native**](https://reactnative.dev) project that implements AWS Amplify Face Liveness Detection using Turbo Modules, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## 🚀 AWS Face Liveness Detection Module

This project includes a complete React Native module for face liveness detection using AWS Amplify FaceLivenessDetector, featuring:

- ✅ **Face Liveness Detection**: Complete integration with AWS Amplify FaceLivenessDetector
- ✅ **Modern Interface**: Clean and responsive UI with dark mode support
- ✅ **Permission Management**: Automatic camera permission requests
- ✅ **Multi-language Support**: Portuguese and English with dynamic switching
- ✅ **Visual Feedback**: Loading, success, and error states
- ✅ **Real-time Events**: Bidirectional communication between React Native and native code
- ✅ **Flexible AWS Credentials**: Support for temporary credentials

## 📚 Documentation

- **[README_FACE_LIVENESS.md](README_FACE_LIVENESS.md)** - Complete documentation in Portuguese
- **[README_FACE_LIVENESS_EN.md](README_FACE_LIVENESS_EN.md)** - Complete documentation in English

## 🏗️ Project Structure

```
AwsLivenessTurboModules/
├── android/
│   └── app/src/main/java/com/awslivenessturbomodules/
│       ├── FaceLivenessModule.kt      # React Native module
│       ├── FaceDetector.kt            # Face Liveness Activity
│       ├── FaceLivenessPackage.kt     # Module package
│       └── MainActivity.kt            # Main activity
├── src/
│   └── AwsLivenessTurboModules.ts     # TypeScript interface
├── App.tsx                            # Main UI with multi-language support
└── README_FACE_LIVENESS.md            # Portuguese documentation
```

## 🛠️ Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

### Prerequisites

- React Native 0.76
- Kotlin 1.9.24
- Android Studio with Android SDK
- AWS Account with Amplify configured

### Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

### Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

#### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

#### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

### Step 3: Using the Face Liveness Module

1. Configure your AWS backend following the [AWS documentation](https://ui.docs.amplify.aws/android/connected-components/liveness)
2. Update the credentials in `App.tsx` with your AWS session information
3. Run the app and test the face liveness detection

## 🔧 Quick Start - Face Liveness

```typescript
import AwsLivenessTurboModules from './src';

// Start liveness detection
const handleStartLiveness = async () => {
  try {
    const result = await AwsLivenessTurboModules.startFaceLivenessDetection(
      'your-session-id',
      'your-access-key-id',
      'your-secret-key',
      'your-session-token',
      '2025-12-31T23:59:59Z'
    );
    
    console.log('Face Liveness started:', result);
  } catch (error) {
    console.error('Face Liveness Error:', error);
  }
};
```

## 🎨 Features

### User Interface
- **Language Selector**: Switch between Portuguese and English
- **Permission Status**: Visual indicator of camera permission status
- **Permission Button**: Request permission if denied
- **Loading States**: Visual feedback during verification
- **Verification Result**: Display success or failure with timestamp
- **Reset Button**: Allow new verification
- **Dark Mode**: Automatic system theme support

### Technical Features
- **Jetpack Compose Integration**: Modern Android UI framework
- **Permission Management**: Runtime camera permission handling
- **Event System**: Real-time communication between native and React Native
- **AWS Credentials**: Flexible credential management
- **Multi-language**: Complete internationalization support

## 🔐 Permissions

The app requires camera permission for face liveness detection:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="true" />
<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
```

## 🚀 Next Steps

1. **Configure Backend**: Create API to generate Face Liveness sessions
2. **Test Module**: Run on device/emulator
3. **Implement iOS**: Add iOS support
4. **Security**: Implement secure credential rotation
5. **Testing**: Implement unit and integration tests
6. **Analytics**: Add usage and performance metrics

## 🔧 Troubleshooting

### Common Issues
- **Activity not available**: Verify MainActivity inherits from ComponentActivity
- **Credentials error**: Verify AWS credentials are correct
- **Camera permission**: Verify permissions in AndroidManifest.xml
- **Compose compilation**: Verify Kotlin and Compose versions

### Debug
- Use `console.log` in React Native for debugging
- Check Android Studio logs for native errors
- Test permissions manually on device

## 📚 Learn More

### React Native Resources
- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

### AWS Resources
- [AWS Amplify Face Liveness Documentation](https://ui.docs.amplify.aws/android/connected-components/liveness)
- [Amazon Rekognition Face Liveness](https://docs.aws.amazon.com/rekognition/latest/dg/face-liveness.html)
- [Jetpack Compose](https://developer.android.com/jetpack/compose)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
