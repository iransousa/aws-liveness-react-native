# 📱 Exemplo de Uso - AWS Liveness Turbo Modules

Este arquivo demonstra como usar o pacote `aws-liveness-turbo-modules` em um projeto React Native.

## 🚀 Instalação

```bash
# Instalar o pacote
npm install aws-liveness-turbo-modules

# ou com yarn
yarn add aws-liveness-turbo-modules
```

## 📋 Configuração

### 1. Android - Permissões

Adicione ao `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-feature android:name="android.hardware.camera" android:required="true" />
<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
```

### 2. Android - Dependências

Adicione ao `android/app/build.gradle`:

```gradle
dependencies {
    implementation 'com.amplifyframework:aws-auth-cognito:2.0.0'
    implementation 'com.amplifyframework:aws-predictions:2.0.0'
    implementation 'androidx.compose.ui:ui:1.5.0'
    implementation 'androidx.compose.material3:material3:1.1.0'
}
```

### 3. iOS - Permissões

Adicione ao `ios/YourApp/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access for face liveness detection</string>
```

## 💻 Exemplo de Código

### Componente Básico

```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  DeviceEventEmitter,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import AwsLivenessTurboModules from 'aws-liveness-turbo-modules';

const FaceLivenessScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [result, setResult] = useState<string | null>(null);

  // Solicitar permissão de câmera
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permissão de Câmera',
            message: 'Este app precisa de acesso à câmera para verificação de vivacidade facial.',
            buttonNeutral: 'Perguntar depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
          return true;
        } else {
          setHasPermission(false);
          Alert.alert('Permissão Negada', 'É necessário conceder permissão de câmera.');
          return false;
        }
      } catch (err) {
        console.warn('Erro ao solicitar permissão:', err);
        setHasPermission(false);
        return false;
      }
    }
    setHasPermission(true);
    return true;
  };

  // Iniciar verificação de vivacidade
  const startLivenessVerification = async () => {
    try {
      setIsLoading(true);

      // Verificar permissão primeiro
      const permissionGranted = await requestCameraPermission();
      if (!permissionGranted) {
        setIsLoading(false);
        return;
      }

      // Suas credenciais AWS (obtenha do seu backend)
      const sessionId = 'your-session-id';
      const accessKeyId = 'your-access-key-id';
      const secretKey = 'your-secret-key';
      const sessionToken = 'your-session-token';
      const expiration = '2025-12-31T23:59:59Z';

      // Iniciar verificação
      const verificationResult = await AwsLivenessTurboModules.startFaceLivenessDetection(
        sessionId,
        accessKeyId,
        secretKey,
        sessionToken,
        expiration
      );

      console.log('Verificação iniciada:', verificationResult);
    } catch (error) {
      console.error('Erro na verificação:', error);
      Alert.alert('Erro', 'Ocorreu um erro durante a verificação.');
    } finally {
      setIsLoading(false);
    }
  };

  // Configurar listeners de eventos
  useEffect(() => {
    const completeListener = DeviceEventEmitter.addListener(
      'FaceLivenessComplete',
      (data) => {
        console.log('Verificação concluída:', data);
        setResult('✅ Verificação concluída com sucesso!');
        Alert.alert('Sucesso', 'Verificação de vivacidade facial concluída com sucesso!');
      }
    );

    const errorListener = DeviceEventEmitter.addListener(
      'FaceLivenessError',
      (error) => {
        console.error('Erro na verificação:', error);
        setResult('❌ Erro na verificação');
        Alert.alert('Erro', `Erro na verificação: ${error}`);
      }
    );

    // Cleanup
    return () => {
      completeListener.remove();
      errorListener.remove();
    };
  }, []);

  // Verificar permissão ao montar o componente
  useEffect(() => {
    requestCameraPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificação de Vivacidade Facial</Text>
      
      {/* Status da permissão */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status da Permissão:</Text>
        <Text style={[
          styles.statusText,
          { color: hasPermission === true ? '#00cc44' : hasPermission === false ? '#ff4444' : '#ffa500' }
        ]}>
          {hasPermission === null ? 'Verificando...' : 
           hasPermission === true ? 'Concedida' : 'Negada'}
        </Text>
      </View>

      {/* Botão de verificação */}
      <TouchableOpacity
        style={[
          styles.button,
          { opacity: hasPermission === true && !isLoading ? 1 : 0.5 }
        ]}
        onPress={startLivenessVerification}
        disabled={hasPermission !== true || isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Iniciando...' : 'Iniciar Verificação'}
        </Text>
      </TouchableOpacity>

      {/* Botão para solicitar permissão */}
      {hasPermission === false && (
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestCameraPermission}
        >
          <Text style={styles.permissionButtonText}>
            Solicitar Permissão de Câmera
          </Text>
        </TouchableOpacity>
      )}

      {/* Resultado */}
      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1a1a1a',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  permissionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4444',
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '500',
  },
  resultContainer: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default FaceLivenessScreen;
```

### Hook Personalizado

```typescript
import { useState, useEffect, useCallback } from 'react';
import { DeviceEventEmitter, PermissionsAndroid, Platform, Alert } from 'react-native';
import AwsLivenessTurboModules from 'aws-liveness-turbo-modules';

interface LivenessCredentials {
  sessionId: string;
  accessKeyId: string;
  secretKey: string;
  sessionToken: string;
  expiration: string;
}

interface LivenessResult {
  success: boolean;
  message: string;
  timestamp: string;
}

export const useFaceLiveness = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [result, setResult] = useState<LivenessResult | null>(null);

  // Solicitar permissão de câmera
  const requestCameraPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permissão de Câmera',
            message: 'Este app precisa de acesso à câmera para verificação de vivacidade facial.',
            buttonNeutral: 'Perguntar depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
          return true;
        } else {
          setHasPermission(false);
          return false;
        }
      } catch (err) {
        console.warn('Erro ao solicitar permissão:', err);
        setHasPermission(false);
        return false;
      }
    }
    setHasPermission(true);
    return true;
  }, []);

  // Iniciar verificação
  const startVerification = useCallback(async (credentials: LivenessCredentials) => {
    try {
      setIsLoading(true);
      setResult(null);

      // Verificar permissão
      const permissionGranted = await requestCameraPermission();
      if (!permissionGranted) {
        Alert.alert('Permissão Negada', 'É necessário conceder permissão de câmera.');
        return false;
      }

      // Iniciar verificação
      const verificationResult = await AwsLivenessTurboModules.startFaceLivenessDetection(
        credentials.sessionId,
        credentials.accessKeyId,
        credentials.secretKey,
        credentials.sessionToken,
        credentials.expiration
      );

      console.log('Verificação iniciada:', verificationResult);
      return true;
    } catch (error) {
      console.error('Erro na verificação:', error);
      Alert.alert('Erro', 'Ocorreu um erro durante a verificação.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [requestCameraPermission]);

  // Configurar listeners
  useEffect(() => {
    const completeListener = DeviceEventEmitter.addListener(
      'FaceLivenessComplete',
      (data) => {
        console.log('Verificação concluída:', data);
        setResult({
          success: true,
          message: 'Verificação de vivacidade facial concluída com sucesso!',
          timestamp: new Date().toLocaleString('pt-BR'),
        });
      }
    );

    const errorListener = DeviceEventEmitter.addListener(
      'FaceLivenessError',
      (error) => {
        console.error('Erro na verificação:', error);
        setResult({
          success: false,
          message: `Erro na verificação: ${error}`,
          timestamp: new Date().toLocaleString('pt-BR'),
        });
      }
    );

    return () => {
      completeListener.remove();
      errorListener.remove();
    };
  }, []);

  // Verificar permissão ao montar
  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  return {
    isLoading,
    hasPermission,
    result,
    startVerification,
    requestCameraPermission,
  };
};
```

### Uso do Hook

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFaceLiveness } from './useFaceLiveness';

const MyComponent = () => {
  const { isLoading, hasPermission, result, startVerification } = useFaceLiveness();

  const handleStartVerification = async () => {
    const credentials = {
      sessionId: 'your-session-id',
      accessKeyId: 'your-access-key-id',
      secretKey: 'your-secret-key',
      sessionToken: 'your-session-token',
      expiration: '2025-12-31T23:59:59Z',
    };

    await startVerification(credentials);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { opacity: hasPermission ? 1 : 0.5 }]}
        onPress={handleStartVerification}
        disabled={!hasPermission || isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Iniciando...' : 'Verificar Vivacidade'}
        </Text>
      </TouchableOpacity>

      {result && (
        <Text style={[styles.result, { color: result.success ? '#00cc44' : '#ff4444' }]}>
          {result.message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  result: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },
});
```

## 🔐 Configuração de Credenciais AWS

### Backend API (Node.js/Express)

```typescript
import express from 'express';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';

const app = express();

app.post('/api/liveness-credentials', async (req, res) => {
  try {
    const sts = new STSClient({ region: 'us-east-1' });
    
    const command = new AssumeRoleCommand({
      RoleArn: 'arn:aws:iam::123456789012:role/LivenessDetectionRole',
      RoleSessionName: 'LivenessDetectionSession',
      DurationSeconds: 3600, // 1 hora
    });

    const response = await sts.send(command);
    
    res.json({
      sessionId: 'unique-session-id',
      accessKeyId: response.Credentials?.AccessKeyId,
      secretKey: response.Credentials?.SecretAccessKey,
      sessionToken: response.Credentials?.SessionToken,
      expiration: response.Credentials?.Expiration?.toISOString(),
    });
  } catch (error) {
    console.error('Erro ao gerar credenciais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
```

### React Native - Obter Credenciais

```typescript
const getLivenessCredentials = async () => {
  try {
    const response = await fetch('https://your-api.com/api/liveness-credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`, // Seu token de autenticação
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao obter credenciais');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
```

## 🧪 Testes

### Teste Unitário

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FaceLivenessScreen from './FaceLivenessScreen';

jest.mock('aws-liveness-turbo-modules', () => ({
  startFaceLivenessDetection: jest.fn(),
}));

describe('FaceLivenessScreen', () => {
  it('should start liveness verification when button is pressed', async () => {
    const { getByText } = render(<FaceLivenessScreen />);
    
    const button = getByText('Iniciar Verificação');
    fireEvent.press(button);
    
    await waitFor(() => {
      expect(getByText('Iniciando...')).toBeTruthy();
    });
  });
});
```

## 🚀 Próximos Passos

1. **Configurar AWS Amplify** no seu projeto
2. **Implementar backend** para geração de credenciais
3. **Adicionar tratamento de erros** mais robusto
4. **Implementar analytics** para monitorar uso
5. **Adicionar testes** de integração
6. **Otimizar performance** conforme necessário

---

**Dica**: Sempre teste em dispositivos reais, não apenas emuladores! 