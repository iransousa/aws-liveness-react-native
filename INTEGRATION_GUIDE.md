# 🔗 Guia de Integração - AWS Face Liveness Detection

Este guia explica como integrar o módulo AWS Face Liveness Detection em outros projetos React Native.

## 📋 Pré-requisitos

### Dependências do Projeto
- React Native 0.76+
- Kotlin 1.9.24+
- Android Studio com Android SDK
- Conta AWS com Amplify configurado

### Configurações AWS Necessárias
- Amplify CLI instalado
- Cognito Identity Pool configurado
- IAM Permissions para Amazon Rekognition
- Backend para gerar sessões Face Liveness

## 🚀 Métodos de Integração

### Método 1: Copiar Arquivos (Recomendado para Projetos Similares)

#### 1.1 Copiar Arquivos Kotlin
Copie os seguintes arquivos para seu projeto:

```
android/app/src/main/java/com/seupacote/AwsLivenessTurboModules/
├── FaceLivenessModule.kt
├── FaceDetector.kt
├── FaceLivenessPackage.kt
└── MainActivity.kt (se não existir)
```

#### 1.2 Atualizar Package Name
Edite todos os arquivos Kotlin e substitua:
```kotlin
// De:
package com.awslivenessturbomodules

// Para:
package com.seupacote
```

#### 1.3 Copiar Interface TypeScript
```typescript
// src/AwsLivenessTurboModules.ts
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
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

export default TurboModuleRegistry.getEnforcing<Spec>('AwsLivenessTurboModules');
```

### Método 2: Como Biblioteca NPM (Futuro)

```bash
npm install aws-liveness-turbo-modules
# ou
yarn add aws-liveness-turbo-modules
```

## ⚙️ Configurações Necessárias

### 1. Dependências Android (build.gradle)

```gradle
// android/app/build.gradle
dependencies {
    // AWS Amplify Face Liveness
    implementation 'com.amplifyframework.ui:liveness:1.5.0'
    
    // Jetpack Compose
    implementation 'androidx.compose.material3:material3:1.1.2'
    implementation 'androidx.compose.ui:ui:1.5.4'
    implementation 'androidx.activity:activity-compose:1.8.2'
    
    // Suporte Java 8
    coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:1.1.5'
}

android {
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    
    kotlinOptions {
        jvmTarget = '1.8'
    }
    
    buildFeatures {
        compose true
    }
    
    composeOptions {
        kotlinCompilerExtensionVersion '1.5.3'
    }
}
```

### 2. Configurações Kotlin (build.gradle)

```gradle
// android/build.gradle
buildscript {
    ext {
        kotlinVersion = '1.9.24'
    }
}
```

### 3. Permissões Android (AndroidManifest.xml)

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<manifest>
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" android:required="true" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
    
    <application>
        <!-- Registrar a Activity -->
        <activity
            android:name=".FaceDetector"
            android:exported="false"
            android:theme="@style/Theme.AppCompat.Light.NoActionBar" />
    </application>
</manifest>
```

### 4. Configurar MainActivity

```kotlin
// android/app/src/main/java/com/seupacote/MainActivity.kt
package com.seupacote

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import androidx.activity.ComponentActivity

class MainActivity : ComponentActivity() {
    override fun getMainComponentName(): String = "SeuApp"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
```

### 5. Configurar MainApplication

```kotlin
// android/app/src/main/java/com/seupacote/MainApplication.kt
package com.seupacote

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import com.amplifyframework.core.Amplify
import com.amplifyframework.auth.cognito.AWSCognitoAuthPlugin

class MainApplication : Application(), ReactApplication {
    private val mReactNativeHost = object : DefaultReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override fun getPackages(): List<ReactPackage> {
            val packages = PackageList(this).packages.toMutableList()
            // Adicionar o package manualmente
            packages.add(FaceLivenessPackage())
            return packages
        }

        override fun getJSMainModuleName(): String = "index"

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
    }

    override fun getReactNativeHost(): ReactNativeHost = mReactNativeHost

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, false)
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            load()
        }
        
        // Configurar Amplify
        try {
            Amplify.addPlugin(AWSCognitoAuthPlugin())
            Amplify.configure(applicationContext)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
```

## 💻 Uso no React Native

### 1. Importar o Módulo

```typescript
// App.tsx ou seu componente
import AwsLivenessTurboModules from './src/AwsLivenessTurboModules';
```

### 2. Configurar Event Listeners

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';

const FaceLivenessScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    // Configurar listeners para eventos
    const setupListeners = () => {
      // Listener para sucesso
      AwsLivenessTurboModules.addListener('FaceLivenessComplete');
      
      // Listener para erro
      AwsLivenessTurboModules.addListener('FaceLivenessError');
    };

    setupListeners();

    // Cleanup
    return () => {
      AwsLivenessTurboModules.removeListeners(2);
    };
  }, []);

  const handleStartLiveness = async () => {
    try {
      setIsLoading(true);
      
      const result = await AwsLivenessTurboModules.startFaceLivenessDetection(
        'sua-session-id',
        'sua-access-key-id',
        'sua-secret-key',
        'seu-session-token',
        '2025-12-31T23:59:59Z'
      );
      
      console.log('Face Liveness iniciado:', result);
    } catch (error) {
      console.error('Erro no Face Liveness:', error);
      Alert.alert('Erro', 'Falha ao iniciar verificação de vivacidade');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity 
        onPress={handleStartLiveness}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? '#ccc' : '#007AFF',
          padding: 15,
          borderRadius: 8
        }}
      >
        <Text style={{ color: 'white' }}>
          {isLoading ? 'Iniciando...' : 'Iniciar Verificação de Vivacidade'}
        </Text>
      </TouchableOpacity>
      
      {result && (
        <Text style={{ marginTop: 20 }}>
          Resultado: {result}
        </Text>
      )}
    </View>
  );
};

export default FaceLivenessScreen;
```

### 3. Configurar Credenciais AWS

```typescript
// utils/aws-config.ts
export const AWS_CONFIG = {
  sessionId: 'sua-session-id',
  accessKeyId: 'sua-access-key-id',
  secretKey: 'sua-secret-key',
  sessionToken: 'seu-session-token',
  expiration: '2025-12-31T23:59:59Z'
};

// Função para obter credenciais do backend
export const getAWSCredentials = async (): Promise<typeof AWS_CONFIG> => {
  try {
    const response = await fetch('https://seu-backend.com/api/face-liveness/credentials');
    const credentials = await response.json();
    
    return {
      sessionId: credentials.sessionId,
      accessKeyId: credentials.accessKeyId,
      secretKey: credentials.secretKey,
      sessionToken: credentials.sessionToken,
      expiration: credentials.expiration
    };
  } catch (error) {
    console.error('Erro ao obter credenciais AWS:', error);
    throw error;
  }
};
```

## 🔧 Configuração do Backend AWS

### 1. Criar Sessão Face Liveness

```javascript
// Backend (Node.js/Express)
const AWS = require('aws-sdk');

const rekognition = new AWS.Rekognition({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

app.post('/api/face-liveness/create-session', async (req, res) => {
  try {
    const params = {
      Video: {
        S3Object: {
          Bucket: 'seu-bucket',
          Name: 'face-liveness-sessions'
        }
      }
    };

    const result = await rekognition.startFaceLivenessSession(params).promise();
    
    res.json({
      sessionId: result.SessionId,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: result.SessionToken,
      expiration: new Date(Date.now() + 3600000).toISOString() // 1 hora
    });
  } catch (error) {
    console.error('Erro ao criar sessão:', error);
    res.status(500).json({ error: 'Falha ao criar sessão' });
  }
});
```

### 2. Verificar Resultado

```javascript
app.get('/api/face-liveness/result/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const params = {
      SessionId: sessionId
    };

    const result = await rekognition.getFaceLivenessSessionResults(params).promise();
    
    res.json({
      status: result.Status,
      confidence: result.Confidence,
      result: result.Result
    });
  } catch (error) {
    console.error('Erro ao verificar resultado:', error);
    res.status(500).json({ error: 'Falha ao verificar resultado' });
  }
});
```

## 🎨 Interface Personalizada

### Componente Reutilizável

```typescript
// components/FaceLivenessButton.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AwsLivenessTurboModules from '../src/AwsLivenessTurboModules';

interface FaceLivenessButtonProps {
  onSuccess?: (result: string) => void;
  onError?: (error: string) => void;
  credentials: {
    sessionId: string;
    accessKeyId: string;
    secretKey: string;
    sessionToken: string;
    expiration: string;
  };
  style?: any;
  textStyle?: any;
}

export const FaceLivenessButton: React.FC<FaceLivenessButtonProps> = ({
  onSuccess,
  onError,
  credentials,
  style,
  textStyle
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    try {
      setIsLoading(true);
      
      const result = await AwsLivenessTurboModules.startFaceLivenessDetection(
        credentials.sessionId,
        credentials.accessKeyId,
        credentials.secretKey,
        credentials.sessionToken,
        credentials.expiration
      );
      
      onSuccess?.(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      onError?.(errorMessage);
      Alert.alert('Erro', 'Falha na verificação de vivacidade');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style, isLoading && styles.buttonDisabled]}
      onPress={handlePress}
      disabled={isLoading}
    >
      <Text style={[styles.buttonText, textStyle]}>
        {isLoading ? 'Verificando...' : 'Verificar Vivacidade'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#ccc'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
```

### Uso do Componente

```typescript
// SeuApp.tsx
import React from 'react';
import { View, Alert } from 'react-native';
import { FaceLivenessButton } from './components/FaceLivenessButton';

const App = () => {
  const credentials = {
    sessionId: 'sua-session-id',
    accessKeyId: 'sua-access-key-id',
    secretKey: 'sua-secret-key',
    sessionToken: 'seu-session-token',
    expiration: '2025-12-31T23:59:59Z'
  };

  const handleSuccess = (result: string) => {
    Alert.alert('Sucesso', 'Verificação de vivacidade concluída com sucesso!');
    console.log('Resultado:', result);
  };

  const handleError = (error: string) => {
    console.error('Erro:', error);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <FaceLivenessButton
        credentials={credentials}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </View>
  );
};

export default App;
```

## 🔐 Gerenciamento de Permissões

### Hook Personalizado

```typescript
// hooks/useCameraPermission.ts
import { useState, useEffect } from 'react';
import { PermissionsAndroid, Alert } from 'react-native';

export const useCameraPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const checkPermission = async () => {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      setHasPermission(granted);
      return granted;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permissão de Câmera',
          message: 'Este app precisa acessar sua câmera para verificação de vivacidade.',
          buttonNeutral: 'Perguntar depois',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        }
      );
      
      const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
      setHasPermission(isGranted);
      return isGranted;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return { hasPermission, checkPermission, requestPermission };
};
```

## 🧪 Testes

### Teste Unitário

```typescript
// __tests__/FaceLivenessButton.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { FaceLivenessButton } from '../components/FaceLivenessButton';

// Mock do módulo nativo
jest.mock('../src/AwsLivenessTurboModules', () => ({
  startFaceLivenessDetection: jest.fn()
}));

describe('FaceLivenessButton', () => {
  const mockCredentials = {
    sessionId: 'test-session',
    accessKeyId: 'test-key',
    secretKey: 'test-secret',
    sessionToken: 'test-token',
    expiration: '2025-12-31T23:59:59Z'
  };

  it('should call startFaceLivenessDetection when pressed', async () => {
    const onSuccess = jest.fn();
    const { getByText } = render(
      <FaceLivenessButton
        credentials={mockCredentials}
        onSuccess={onSuccess}
      />
    );

    fireEvent.press(getByText('Verificar Vivacidade'));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
```

## 🚀 Deploy e Produção

### 1. Configurações de Produção

```gradle
// android/app/build.gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 2. Proguard Rules

```proguard
# android/app/proguard-rules.pro
-keep class com.amplifyframework.** { *; }
-keep class com.amazonaws.** { *; }
-keep class com.seupacote.FaceLivenessModule { *; }
-keep class com.seupacote.FaceDetector { *; }
```

### 3. Variáveis de Ambiente

```bash
# .env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=sua-access-key
AWS_SECRET_ACCESS_KEY=sua-secret-key
```

## 🔧 Troubleshooting

### Problemas Comuns

1. **Erro de Compilação Kotlin**
   - Verificar versão do Kotlin (1.9.24+)
   - Verificar configurações do Compose

2. **Erro de Permissão**
   - Verificar AndroidManifest.xml
   - Testar permissões manualmente

3. **Erro de Credenciais AWS**
   - Verificar se as credenciais estão corretas
   - Verificar se a sessão não expirou

4. **Activity não encontrada**
   - Verificar se MainActivity herda de ComponentActivity
   - Verificar se FaceDetector está registrada no AndroidManifest.xml

### Logs de Debug

```typescript
// Habilitar logs detalhados
if (__DEV__) {
  console.log('Credenciais AWS:', credentials);
  console.log('Status da permissão:', hasPermission);
}
```

## 📚 Recursos Adicionais

- [Documentação AWS Amplify Face Liveness](https://ui.docs.amplify.aws/android/connected-components/liveness)
- [React Native Native Modules](https://reactnative.dev/docs/native-modules-android)
- [Jetpack Compose](https://developer.android.com/jetpack/compose)
- [Amazon Rekognition](https://docs.aws.amazon.com/rekognition/latest/dg/face-liveness.html)

---

**Nota**: Este guia assume que você está integrando em um projeto React Native existente. Para projetos novos, considere usar o projeto base como template. 