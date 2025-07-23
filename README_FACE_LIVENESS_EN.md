# AWS Face Liveness Detection - React Native Module

This project implements a complete React Native module for face liveness detection using AWS Amplify FaceLivenessDetector, featuring a modern user interface, permission management, and multi-language support.

## 🚀 Features

- ✅ **Face Liveness Detection**: Complete integration with AWS Amplify FaceLivenessDetector
- ✅ **Modern Interface**: Clean and responsive UI with dark mode support
- ✅ **Permission Management**: Automatic camera permission requests
- ✅ **Multi-language Support**: Portuguese and English with dynamic switching
- ✅ **Visual Feedback**: Loading, success, and error states
- ✅ **Real-time Events**: Bidirectional communication between React Native and native code
- ✅ **Flexible AWS Credentials**: Support for temporary credentials

## 📁 Project Structure

### Kotlin/Android Files
- **FaceLivenessModule.kt**: React Native module that exposes the `startFaceLivenessDetection` function
- **FaceDetector.kt**: Activity that implements FaceLivenessDetector using Jetpack Compose
- **FaceLivenessPackage.kt**: Package that registers the module in React Native
- **MainActivity.kt**: Main activity configured for Compose support

### TypeScript/React Native
- **src/AwsLivenessTurboModules.ts**: TypeScript interface for the module
- **App.tsx**: Main user interface with multi-language support

## ⚙️ Applied Configurations

### ✅ Android Dependencies
```gradle
// AWS Amplify Face Liveness
implementation 'com.amplifyframework.ui:liveness:1.5.0'

// Jetpack Compose
implementation 'androidx.compose.material3:material3:1.1.2'
implementation 'androidx.compose.ui:ui:1.5.4'
implementation 'androidx.activity:activity-compose:1.8.2'

// Java 8 Support
coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:1.1.5'
```

### ✅ Android Configurations
- **Jetpack Compose**: Enabled with `kotlinCompilerExtensionVersion '1.5.3'`
- **compileOptions**: Configured for Java 8
- **Permissions**: Camera added to AndroidManifest.xml
- **MainActivity**: Inherits from ComponentActivity for Compose support
- **FaceDetector Activity**: Registered in AndroidManifest.xml

### ✅ Amplify Initialization
- Amplify Auth configured in `MainApplication.kt`
- FaceLivenessPackage manually registered

## 🔧 Module API

### TypeScript Interface
```typescript
interface Spec extends TurboModule {
  startFaceLivenessDetection(
    sessionId: string,
    accessKeyId: string,
    secretKey: string,
    sessionToken: string,
    expiration: string
  ): Promise<string>;
  
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}
```

### Function Parameters
- **sessionId**: Face Liveness session ID created in the backend
- **accessKeyId**: AWS Access Key ID for authentication
- **secretKey**: AWS Secret Key for authentication
- **sessionToken**: AWS Session Token for temporary authentication
- **expiration**: Credential expiration date (ISO 8601 format)

### Available Events
- **FaceLivenessComplete**: Detection completed successfully
- **FaceLivenessError**: Error during detection

## 🎨 User Interface

### UI Features
- **Language Selector**: Switch between Portuguese and English
- **Permission Status**: Visual indicator of camera permission status
- **Permission Button**: Request permission if denied
- **Loading States**: Visual feedback during verification
- **Verification Result**: Display success or failure with timestamp
- **Reset Button**: Allow new verification
- **Dark Mode**: Automatic system theme support

### Main Components
- **LanguageSelector**: Language selector with styled buttons
- **PermissionStatus**: Camera permission status indicator
- **LivenessButton**: Main button to start verification
- **ResultDisplay**: Verification result display

## 🌐 Multi-language Support

### Supported Languages
- **Portuguese (pt)**: Complete interface in Brazilian Portuguese
- **English (en)**: Complete interface in English

### Included Translations
- All interface texts
- Alert and error messages
- Formatted timestamps
- Usage instructions

### Internationalization System
```typescript
const translations = {
  pt: {
    title: 'Detecção de Vivacidade Facial',
    startVerification: 'Iniciar Verificação',
    // ... more translations
  },
  en: {
    title: 'Face Liveness Detection',
    startVerification: 'Start Verification',
    // ... more translations
  }
};
```

## 📱 How to Use

### 1. AWS Backend Configuration
Follow the [AWS documentation](https://ui.docs.amplify.aws/android/connected-components/liveness) to configure:
- Amplify CLI
- Cognito Identity Pool
- IAM Permissions for Rekognition
- Backend to create Face Liveness sessions

### 2. Usage in React Native
```typescript
import AwsLivenessTurboModules from './src';

// Listen to events
useEffect(() => {
  const subscription = AwsLivenessTurboModules.addListener('FaceLivenessComplete');
  const errorSubscription = AwsLivenessTurboModules.addListener('FaceLivenessError');

  return () => {
    AwsLivenessTurboModules.removeListeners(2);
  };
}, []);

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

### 3. Execution Flow
1. User selects language (optional)
2. System checks camera permission
3. If needed, requests permission from user
4. User clicks "Start Verification"
5. React Native calls `startFaceLivenessDetection`
6. Native module starts `FaceDetector` Activity
7. FaceDetector configures AWS credentials and starts FaceLivenessDetector
8. User performs liveness challenges
9. Events are sent back to React Native
10. Interface displays result with timestamp
11. Activity is automatically finished

## 🔐 Permission Management

### Android Permissions
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="true" />
<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
```

### Permission Flow
1. **Check**: System checks if permission is already granted
2. **Request**: If not granted, requests permission from user
3. **Feedback**: Interface shows permission status
4. **Re-request**: Button to re-request if denied

## 🏗️ Technical Implementation

### FaceLivenessModule.kt
- Inherits from `ReactContextBaseJavaModule`
- Uses `@ReactModule` annotation
- Starts `FaceDetector` Activity with parameters via Intent
- Implements `addListener` and `removeListeners` methods for compatibility

### FaceDetector.kt
- Inherits from `ComponentActivity`
- Implements custom `AWSCredentialsProvider`
- Uses Jetpack Compose with `FaceLivenessDetector`
- Sends events via `DeviceEventManagerModule`
- Manages Activity lifecycle

### AWS Credentials
The module uses temporary AWS credentials (Access Key, Secret Key, Session Token) instead of Cognito, allowing greater flexibility in authentication.

## 🎯 Interface States

### Main States
- **Idle**: Initial interface, waiting for user action
- **Permission Request**: Requesting camera permission
- **Loading**: Verification in progress
- **Success**: Verification completed successfully
- **Error**: Error during verification

### State Transitions
```
Idle → Permission Request → Loading → Success/Error → Idle (reset)
```

## 🚀 Next Steps

1. **Configure Backend**: Create API to generate Face Liveness sessions
2. **Test Module**: Run on device/emulator
3. **Implement iOS**: Add iOS support
4. **Security**: Implement secure credential rotation
5. **Testing**: Implement unit and integration tests
6. **Analytics**: Add usage and performance metrics

## 🔧 Troubleshooting

### Common Errors
- **Activity not available**: Verify MainActivity inherits from ComponentActivity
- **Credentials error**: Verify AWS credentials are correct
- **Camera permission**: Verify permissions in AndroidManifest.xml
- **Compose compilation**: Verify Kotlin and Compose versions

### Logs
Check Android Studio logs for specific error details.

### Debug
- Use `console.log` in React Native for debugging
- Check Android Studio logs for native errors
- Test permissions manually on device

## 📚 References
- [AWS Amplify Face Liveness Documentation](https://ui.docs.amplify.aws/android/connected-components/liveness)
- [React Native Native Modules](https://reactnative.dev/docs/native-modules-android)
- [Amazon Rekognition Face Liveness](https://docs.aws.amazon.com/rekognition/latest/dg/face-liveness.html)
- [Jetpack Compose](https://developer.android.com/jetpack/compose)
- [React Native Permissions](https://github.com/zoontek/react-native-permissions)

## 🔄 Migration from Previous Versions

### Breaking Changes
- Updated to React Native 0.76
- Kotlin 1.9.24 required
- Jetpack Compose integration
- New permission management system

### Migration Steps
1. Update React Native to 0.76
2. Update Kotlin version to 1.9.24
3. Add Jetpack Compose dependencies
4. Update MainActivity to inherit from ComponentActivity
5. Add new permission handling code
6. Update event listener implementation

## 📊 Performance Considerations

### Optimization Tips
- Use proper image compression for camera preview
- Implement proper memory management
- Optimize Compose recomposition
- Handle configuration changes properly

### Memory Management
- Properly dispose of camera resources
- Handle Activity lifecycle events
- Clean up event listeners
- Manage AWS credential lifecycle

## 🔒 Security Best Practices

### Credential Management
- Use temporary credentials with short expiration
- Implement secure credential rotation
- Never store credentials in plain text
- Use environment variables for sensitive data

### Permission Handling
- Request only necessary permissions
- Provide clear permission rationale
- Handle permission denial gracefully
- Implement proper fallback mechanisms

## 🧪 Testing Strategy

### Unit Tests
- Test module interface functions
- Test permission handling logic
- Test event emission
- Test error handling

### Integration Tests
- Test complete liveness flow
- Test permission scenarios
- Test multi-language switching
- Test dark mode functionality

### Manual Testing
- Test on different Android versions
- Test with different camera hardware
- Test permission scenarios
- Test network connectivity issues 