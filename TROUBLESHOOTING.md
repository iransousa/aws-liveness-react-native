# 🔧 Troubleshooting - AWS Liveness Turbo Modules

Este guia ajuda a resolver problemas comuns durante a instalação e configuração do módulo.

## 🚨 Problemas Comuns

### 1. Erro: "Module not found"

**Sintomas:**
```
Error: Module 'aws-liveness-turbo-modules' could not be found
```

**Soluções:**
1. **Reinstalar o pacote:**
   ```bash
   npm uninstall aws-liveness-turbo-modules
   npm install aws-liveness-turbo-modules
   ```

2. **Limpar cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

3. **Verificar import:**
   ```typescript
   // ✅ Correto
   import AwsLivenessTurboModules from 'aws-liveness-turbo-modules';
   
   // ❌ Incorreto
   import AwsLivenessTurboModules from './aws-liveness-turbo-modules';
   ```

### 2. Erro: "FaceLivenessModule not found"

**Sintomas:**
```
java.lang.ClassNotFoundException: com.awslivenessturbomodules.FaceLivenessModule
```

**Soluções:**
1. **Executar configuração manual:**
   ```bash
   npm run setup-manual
   ```

2. **Verificar se os arquivos foram copiados:**
   ```bash
   ls android/app/src/main/java/com/awslivenessturbomodules/
   ```

3. **Verificar MainApplication.java:**
   - Deve conter: `add(new FaceLivenessPackage());`

### 3. Erro: "Permission denied"

**Sintomas:**
```
java.lang.SecurityException: Permission denied (missing INTERNET permission?)
```

**Soluções:**
1. **Verificar AndroidManifest.xml:**
   ```xml
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-permission android:name="android.permission.INTERNET" />
   ```

2. **Reinstalar o app:**
   ```bash
   npx react-native run-android
   ```

### 4. Erro: "AWS credentials invalid"

**Sintomas:**
```
com.amazonaws.AmazonServiceException: The security token included in the request is invalid
```

**Soluções:**
1. **Verificar credenciais:**
   ```typescript
   // Certifique-se de que as credenciais estão corretas
   const credentials = {
     sessionId: 'valid-session-id',
     accessKeyId: 'valid-access-key',
     secretKey: 'valid-secret-key',
     sessionToken: 'valid-session-token',
     expiration: '2025-12-31T23:59:59Z'
   };
   ```

2. **Verificar expiração:**
   - As credenciais temporárias expiram
   - Gere novas credenciais se necessário

### 5. Erro: "Camera permission not granted"

**Sintomas:**
```
java.lang.SecurityException: Permission denied (missing CAMERA permission?)
```

**Soluções:**
1. **Verificar permissões no dispositivo:**
   - Vá em Configurações > Apps > Seu App > Permissões
   - Ative a permissão de câmera

2. **Solicitar permissão em runtime:**
   ```typescript
   import { PermissionsAndroid } from 'react-native';
   
   const requestCameraPermission = async () => {
     const granted = await PermissionsAndroid.request(
       PermissionsAndroid.PERMISSIONS.CAMERA
     );
     return granted === PermissionsAndroid.RESULTS.GRANTED;
   };
   ```

### 6. Erro: "Build failed"

**Sintomas:**
```
Execution failed for task ':app:compileDebugKotlin'
```

**Soluções:**
1. **Verificar versão do Kotlin:**
   ```gradle
   // android/build.gradle
   ext.kotlin_version = "1.9.24"
   ```

2. **Limpar build:**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

3. **Verificar dependências:**
    ```gradle
    // android/app/build.gradle
    implementation 'com.amplifyframework.ui:liveness:1.5.0'
    implementation 'androidx.activity:activity-compose:1.8.2'
    implementation 'androidx.compose.foundation:foundation:1.5.4'
    ```

### 7. Erro: "Jetpack Compose not found"

**Sintomas:**
```
Cannot resolve symbol 'Compose'
```

**Soluções:**
1. **Adicionar dependências do Compose:**
    ```gradle
    implementation 'androidx.activity:activity-compose:1.8.2'
    implementation 'androidx.compose.foundation:foundation:1.5.4'
    ```

2. **Verificar versão do Android:**
   ```gradle
   compileSdkVersion 35
   targetSdkVersion 35
   ```

## 🔍 Diagnóstico

### Verificar Configuração

Execute este script para verificar se tudo está configurado corretamente:

```bash
npm run setup-manual
```

### Logs de Debug

Para ver logs detalhados:

```bash
# Android
adb logcat | grep -i "awsliveness"

# React Native
npx react-native log-android
```

### Verificar Arquivos

```bash
# Verificar se os arquivos foram copiados
ls -la android/app/src/main/java/com/awslivenessturbomodules/

# Verificar permissões no manifest
grep -i "camera\|internet" android/app/src/main/AndroidManifest.xml

# Verificar dependências no build.gradle
grep -i "amplify\|compose" android/app/build.gradle
```

## 🛠️ Soluções Avançadas

### Reset Completo

Se nada funcionar, faça um reset completo:

```bash
# 1. Remover o pacote
npm uninstall aws-liveness-turbo-modules

# 2. Limpar cache
npm cache clean --force

# 3. Remover node_modules
rm -rf node_modules

# 4. Reinstalar tudo
npm install

# 5. Reinstalar o pacote
npm install aws-liveness-turbo-modules

# 6. Limpar build Android
cd android
./gradlew clean
cd ..

# 7. Reinstalar app
npx react-native run-android
```

### Configuração Manual Completa

Se a configuração automática falhar completamente:

1. **Copiar arquivos manualmente:**
   ```bash
   # Criar diretório
   mkdir -p android/app/src/main/java/com/awslivenessturbomodules/
   
   # Copiar arquivos do node_modules
   cp node_modules/aws-liveness-turbo-modules/android/app/src/main/java/com/awslivenessturbomodules/*.kt android/app/src/main/java/com/awslivenessturbomodules/
   ```

2. **Editar AndroidManifest.xml manualmente**
3. **Editar build.gradle manualmente**
4. **Editar MainApplication.java manualmente**

## 📞 Suporte

Se você ainda tiver problemas:

1. **Verificar issues no GitHub**
2. **Criar uma nova issue** com:
   - Versão do React Native
   - Versão do Android
   - Logs de erro completos
   - Passos para reproduzir

3. **Consulte a documentação:**
   - [README.md](README.md)
   - [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
   - [USAGE_EXAMPLE.md](USAGE_EXAMPLE.md)

---

**💡 Dica**: Sempre teste em um dispositivo real, não apenas emulador! 