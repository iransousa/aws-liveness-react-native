# AWS Face Liveness Detection - React Native Module

Este projeto implementa um módulo React Native completo para detecção de vivacidade facial usando AWS Amplify FaceLivenessDetector, com interface de usuário moderna, gerenciamento de permissões e suporte multi-idioma.

## 🚀 Funcionalidades

- ✅ **Detecção de Vivacidade Facial**: Integração completa com AWS Amplify FaceLivenessDetector
- ✅ **Interface Moderna**: UI limpa e responsiva com suporte a modo escuro
- ✅ **Gerenciamento de Permissões**: Solicitação automática de permissão de câmera
- ✅ **Suporte Multi-idioma**: Português e Inglês com troca dinâmica
- ✅ **Feedback Visual**: Estados de carregamento, sucesso e erro
- ✅ **Eventos em Tempo Real**: Comunicação bidirecional entre React Native e nativo
- ✅ **Credenciais AWS Flexíveis**: Suporte a credenciais temporárias

## 📁 Estrutura do Projeto

### Arquivos Kotlin/Android
- **FaceLivenessModule.kt**: Módulo React Native que expõe a função `startFaceLivenessDetection`
- **FaceDetector.kt**: Activity que implementa o FaceLivenessDetector usando Jetpack Compose
- **FaceLivenessPackage.kt**: Package que registra o módulo no React Native
- **MainActivity.kt**: Activity principal configurada para suporte ao Compose

### TypeScript/React Native
- **src/AwsLivenessTurboModules.ts**: Interface TypeScript para o módulo
- **App.tsx**: Interface de usuário principal com suporte multi-idioma

## ⚙️ Configurações Aplicadas

### ✅ Dependências Android
```gradle
// AWS Amplify Face Liveness
implementation 'com.amplifyframework.ui:liveness:1.5.0'

// Jetpack Compose
implementation 'androidx.compose.material3:material3:1.1.2'
implementation 'androidx.compose.ui:ui:1.5.4'
implementation 'androidx.activity:activity-compose:1.8.2'

// Suporte Java 8
coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:1.1.5'
```

### ✅ Configurações Android
- **Jetpack Compose**: Habilitado com `kotlinCompilerExtensionVersion '1.5.3'`
- **compileOptions**: Configurado para Java 8
- **Permissions**: Câmera adicionada no AndroidManifest.xml
- **MainActivity**: Herda de ComponentActivity para suporte ao Compose
- **FaceDetector Activity**: Registrada no AndroidManifest.xml

### ✅ Inicialização Amplify
- Amplify Auth configurado no `MainApplication.kt`
- FaceLivenessPackage registrado manualmente

## 🔧 API do Módulo

### Interface TypeScript
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

### Parâmetros da Função
- **sessionId**: ID da sessão Face Liveness criada no backend
- **accessKeyId**: AWS Access Key ID para autenticação
- **secretKey**: AWS Secret Key para autenticação
- **sessionToken**: AWS Session Token para autenticação temporária
- **expiration**: Data de expiração das credenciais (formato ISO 8601)

### Eventos Disponíveis
- **FaceLivenessComplete**: Detecção concluída com sucesso
- **FaceLivenessError**: Erro durante a detecção

## 🎨 Interface do Usuário

### Funcionalidades da UI
- **Seletor de Idioma**: Troca entre Português e Inglês
- **Status de Permissão**: Indicador visual do status da permissão de câmera
- **Botão de Permissão**: Solicita permissão se negada
- **Estados de Carregamento**: Feedback visual durante a verificação
- **Resultado da Verificação**: Exibe sucesso ou falha com timestamp
- **Botão de Reset**: Permite nova verificação
- **Modo Escuro**: Suporte automático ao tema do sistema

### Componentes Principais
- **LanguageSelector**: Seletor de idioma com botões estilizados
- **PermissionStatus**: Indicador de status da permissão de câmera
- **LivenessButton**: Botão principal para iniciar verificação
- **ResultDisplay**: Exibição do resultado da verificação

## 🌐 Suporte Multi-idioma

### Idiomas Suportados
- **Português (pt)**: Interface completa em português brasileiro
- **Inglês (en)**: Interface completa em inglês

### Traduções Incluídas
- Todos os textos da interface
- Mensagens de alerta e erro
- Timestamps formatados
- Instruções de uso

### Sistema de Internacionalização
```typescript
const translations = {
  pt: {
    title: 'Detecção de Vivacidade Facial',
    startVerification: 'Iniciar Verificação',
    // ... mais traduções
  },
  en: {
    title: 'Face Liveness Detection',
    startVerification: 'Start Verification',
    // ... mais traduções
  }
};
```

## 📱 Como Usar

### 1. Configuração Backend AWS
Siga a [documentação da AWS](https://ui.docs.amplify.aws/android/connected-components/liveness) para configurar:
- Amplify CLI
- Cognito Identity Pool
- IAM Permissions para Rekognition
- Backend para criar sessões Face Liveness

### 2. Uso no React Native
```typescript
import AwsLivenessTurboModules from './src';

// Escutar eventos
useEffect(() => {
  const subscription = AwsLivenessTurboModules.addListener('FaceLivenessComplete');
  const errorSubscription = AwsLivenessTurboModules.addListener('FaceLivenessError');

  return () => {
    AwsLivenessTurboModules.removeListeners(2);
  };
}, []);

// Iniciar detecção de vivacidade
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

### 3. Fluxo de Execução
1. Usuário seleciona idioma (opcional)
2. Sistema verifica permissão de câmera
3. Se necessário, solicita permissão ao usuário
4. Usuário clica em "Iniciar Verificação"
5. React Native chama `startFaceLivenessDetection`
6. Módulo nativo inicia a Activity `FaceDetector`
7. FaceDetector configura credenciais AWS e inicia FaceLivenessDetector
8. Usuário realiza os desafios de vivacidade
9. Eventos são enviados de volta para React Native
10. Interface exibe resultado com timestamp
11. Activity é finalizada automaticamente

## 🔐 Gerenciamento de Permissões

### Permissões Android
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="true" />
<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
```

### Fluxo de Permissão
1. **Verificação**: Sistema verifica se a permissão já foi concedida
2. **Solicitação**: Se não concedida, solicita permissão ao usuário
3. **Feedback**: Interface mostra status da permissão
4. **Re-solicitação**: Botão para re-solicitar se negada

## 🏗️ Implementação Técnica

### FaceLivenessModule.kt
- Herda de `ReactContextBaseJavaModule`
- Usa `@ReactModule` annotation
- Inicia Activity `FaceDetector` com parâmetros via Intent
- Implementa métodos `addListener` e `removeListeners` para compatibilidade

### FaceDetector.kt
- Herda de `ComponentActivity`
- Implementa `AWSCredentialsProvider` customizado
- Usa Jetpack Compose com `FaceLivenessDetector`
- Envia eventos via `DeviceEventManagerModule`
- Gerencia ciclo de vida da Activity

### Credenciais AWS
O módulo usa credenciais temporárias AWS (Access Key, Secret Key, Session Token) em vez de Cognito, permitindo maior flexibilidade na autenticação.

## 🎯 Estados da Interface

### Estados Principais
- **Idle**: Interface inicial, aguardando ação do usuário
- **Permission Request**: Solicitando permissão de câmera
- **Loading**: Verificação em andamento
- **Success**: Verificação concluída com sucesso
- **Error**: Erro durante a verificação

### Transições de Estado
```
Idle → Permission Request → Loading → Success/Error → Idle (reset)
```

## 🚀 Próximos Passos

1. **Configurar Backend**: Criar API para gerar sessões Face Liveness
2. **Testar Módulo**: Executar no dispositivo/emulador
3. **Implementar iOS**: Adicionar suporte para iOS
4. **Segurança**: Implementar rotação segura de credenciais
5. **Testes**: Implementar testes unitários e de integração
6. **Analytics**: Adicionar métricas de uso e performance

## 🔧 Troubleshooting

### Erros Comuns
- **Activity not available**: Verificar se MainActivity herda de ComponentActivity
- **Credentials error**: Verificar se as credenciais AWS estão corretas
- **Camera permission**: Verificar permissões no AndroidManifest.xml
- **Compose compilation**: Verificar versões do Kotlin e Compose

### Logs
Verificar logs do Android Studio para detalhes de erros específicos.

### Debug
- Usar `console.log` no React Native para debug
- Verificar logs do Android Studio para erros nativos
- Testar permissões manualmente no dispositivo

## 📚 Referências
- [AWS Amplify Face Liveness Documentation](https://ui.docs.amplify.aws/android/connected-components/liveness)
- [React Native Native Modules](https://reactnative.dev/docs/native-modules-android)
- [Amazon Rekognition Face Liveness](https://docs.aws.amazon.com/rekognition/latest/dg/face-liveness.html)
- [Jetpack Compose](https://developer.android.com/jetpack/compose)
- [React Native Permissions](https://github.com/zoontek/react-native-permissions) 