# 🔒 Guia de Segurança - AWS Face Liveness Detection

Este guia explica como implementar rotação segura de credenciais AWS e melhores práticas de segurança para o módulo Face Liveness Detection.

## 🚨 Importância da Segurança

### Por que Rotacionar Credenciais?
- **Reduzir Risco**: Credenciais comprometidas têm tempo limitado de uso
- **Compliance**: Atender requisitos de segurança (SOC2, ISO27001, etc.)
- **Auditoria**: Rastrear uso de credenciais por período
- **Controle de Acesso**: Limitar privilégios por tempo e escopo

### Riscos de Credenciais Estáticas
- Credenciais hardcoded no código
- Credenciais compartilhadas entre desenvolvedores
- Credenciais com privilégios excessivos
- Credenciais sem expiração

## 🔐 Estratégias de Rotações de Credenciais

### 1. Credenciais Temporárias (STS)

#### Vantagens
- Expiração automática
- Escopo limitado
- Sem armazenamento persistente
- Auditável

#### Implementação

```typescript
// utils/aws-credentials.ts
import AWS from 'aws-sdk';

interface TemporaryCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: Date;
}

export class AWSCredentialManager {
  private static instance: AWSCredentialManager;
  private credentials: TemporaryCredentials | null = null;
  private refreshThreshold = 5 * 60 * 1000; // 5 minutos antes da expiração

  static getInstance(): AWSCredentialManager {
    if (!AWSCredentialManager.instance) {
      AWSCredentialManager.instance = new AWSCredentialManager();
    }
    return AWSCredentialManager.instance;
  }

  async getCredentials(): Promise<TemporaryCredentials> {
    // Verificar se as credenciais existem e não estão próximas de expirar
    if (this.shouldRefreshCredentials()) {
      await this.refreshCredentials();
    }

    if (!this.credentials) {
      throw new Error('Falha ao obter credenciais AWS');
    }

    return this.credentials;
  }

  private shouldRefreshCredentials(): boolean {
    if (!this.credentials) return true;
    
    const now = new Date();
    const timeUntilExpiration = this.credentials.expiration.getTime() - now.getTime();
    
    return timeUntilExpiration < this.refreshThreshold;
  }

  private async refreshCredentials(): Promise<void> {
    try {
      // Obter credenciais do backend seguro
      const response = await fetch('/api/aws/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          service: 'rekognition',
          duration: 3600 // 1 hora
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao obter credenciais do servidor');
      }

      const credentials = await response.json();
      
      this.credentials = {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken,
        expiration: new Date(credentials.expiration)
      };

      console.log('Credenciais AWS renovadas com sucesso');
    } catch (error) {
      console.error('Erro ao renovar credenciais AWS:', error);
      throw error;
    }
  }

  private async getAuthToken(): Promise<string> {
    // Implementar lógica de autenticação do app
    // Pode ser JWT, OAuth, etc.
    return 'seu-token-de-autenticacao';
  }

  // Limpar credenciais da memória
  clearCredentials(): void {
    this.credentials = null;
  }
}
```

### 2. Backend para Geração de Credenciais

#### API Segura para Credenciais

```javascript
// backend/routes/aws-credentials.js
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

// Configurar AWS STS
const sts = new AWS.STS({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_MASTER_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_MASTER_SECRET_ACCESS_KEY
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Rota para obter credenciais temporárias
app.post('/api/aws/credentials', authenticateToken, async (req, res) => {
  try {
    const { service, duration = 3600 } = req.body;
    const userId = req.user.id;

    // Verificar permissões do usuário
    if (!await hasPermission(userId, 'face-liveness')) {
      return res.status(403).json({ error: 'Permissão negada' });
    }

    // Criar política IAM específica para Face Liveness
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: [
            'rekognition:StartFaceLivenessSession',
            'rekognition:GetFaceLivenessSessionResults'
          ],
          Resource: '*',
          Condition: {
            StringEquals: {
              'aws:RequestTag/UserId': userId
            }
          }
        }
      ]
    };

    // Assumir role ou gerar credenciais temporárias
    const assumeRoleParams = {
      RoleArn: process.env.AWS_FACE_LIVENESS_ROLE_ARN,
      RoleSessionName: `face-liveness-${userId}-${Date.now()}`,
      DurationSeconds: Math.min(duration, 3600), // Máximo 1 hora
      Policy: JSON.stringify(policy),
      Tags: [
        {
          Key: 'UserId',
          Value: userId
        },
        {
          Key: 'Service',
          Value: 'face-liveness'
        },
        {
          Key: 'Environment',
          Value: process.env.NODE_ENV
        }
      ]
    };

    const credentials = await sts.assumeRole(assumeRoleParams).promise();

    // Log da auditoria
    await logCredentialRequest({
      userId,
      service,
      duration,
      timestamp: new Date(),
      ipAddress: req.ip
    });

    res.json({
      accessKeyId: credentials.Credentials.AccessKeyId,
      secretAccessKey: credentials.Credentials.SecretAccessKey,
      sessionToken: credentials.Credentials.SessionToken,
      expiration: credentials.Credentials.Expiration
    });

  } catch (error) {
    console.error('Erro ao gerar credenciais:', error);
    res.status(500).json({ error: 'Falha interna do servidor' });
  }
});

// Função para verificar permissões
async function hasPermission(userId, permission) {
  // Implementar lógica de verificação de permissões
  // Pode ser baseada em roles, grupos, etc.
  return true; // Simplificado para exemplo
}

// Função para log de auditoria
async function logCredentialRequest(logData) {
  // Salvar em banco de dados ou serviço de logs
  console.log('Audit Log:', logData);
}
```

### 3. Configuração IAM Segura

#### Role para Face Liveness

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rekognition:StartFaceLivenessSession",
        "rekognition:GetFaceLivenessSessionResults"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:RequestTag/Service": "face-liveness"
        },
        "NumericLessThanEquals": {
          "aws:CurrentTime": "${aws:TokenIssueTime + 3600}"
        }
      }
    },
    {
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:RequestTag/Environment": ["development", "staging", "production"]
        }
      }
    }
  ]
}
```

### 4. Implementação no React Native

#### Hook para Gerenciamento de Credenciais

```typescript
// hooks/useAWSCredentials.ts
import { useState, useEffect, useCallback } from 'react';
import { AWSCredentialManager } from '../utils/aws-credentials';

interface UseAWSCredentialsReturn {
  credentials: any;
  isLoading: boolean;
  error: string | null;
  refreshCredentials: () => Promise<void>;
}

export const useAWSCredentials = (): UseAWSCredentialsReturn => {
  const [credentials, setCredentials] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const credentialManager = AWSCredentialManager.getInstance();

  const refreshCredentials = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const creds = await credentialManager.getCredentials();
      setCredentials(creds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao obter credenciais:', err);
    } finally {
      setIsLoading(false);
    }
  }, [credentialManager]);

  useEffect(() => {
    refreshCredentials();
  }, [refreshCredentials]);

  // Renovar credenciais automaticamente antes de expirar
  useEffect(() => {
    if (!credentials) return;

    const timeUntilExpiration = credentials.expiration.getTime() - Date.now();
    const refreshTime = Math.max(timeUntilExpiration - (5 * 60 * 1000), 0); // 5 min antes

    const timer = setTimeout(() => {
      refreshCredentials();
    }, refreshTime);

    return () => clearTimeout(timer);
  }, [credentials, refreshCredentials]);

  return {
    credentials,
    isLoading,
    error,
    refreshCredentials
  };
};
```

#### Componente Seguro de Face Liveness

```typescript
// components/SecureFaceLiveness.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useAWSCredentials } from '../hooks/useAWSCredentials';
import AwsLivenessTurboModules from '../src/AwsLivenessTurboModules';

interface SecureFaceLivenessProps {
  onSuccess?: (result: string) => void;
  onError?: (error: string) => void;
}

export const SecureFaceLiveness: React.FC<SecureFaceLivenessProps> = ({
  onSuccess,
  onError
}) => {
  const { credentials, isLoading, error, refreshCredentials } = useAWSCredentials();
  const [isVerifying, setIsVerifying] = useState(false);

  const handleStartLiveness = async () => {
    if (!credentials) {
      Alert.alert('Erro', 'Credenciais AWS não disponíveis');
      return;
    }

    try {
      setIsVerifying(true);
      
      const result = await AwsLivenessTurboModules.startFaceLivenessDetection(
        'session-id', // Gerar dinamicamente
        credentials.accessKeyId,
        credentials.secretAccessKey,
        credentials.sessionToken,
        credentials.expiration.toISOString()
      );
      
      onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      onError?.(errorMessage);
      Alert.alert('Erro', 'Falha na verificação de vivacidade');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Carregando credenciais...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: {error}</Text>
        <TouchableOpacity style={styles.button} onPress={refreshCredentials}>
          <Text style={styles.buttonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isVerifying && styles.buttonDisabled]}
        onPress={handleStartLiveness}
        disabled={isVerifying}
      >
        <Text style={styles.buttonText}>
          {isVerifying ? 'Verificando...' : 'Iniciar Verificação de Vivacidade'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.credentialInfo}>
        Credenciais válidas até: {credentials?.expiration.toLocaleTimeString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: '#ccc'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  errorText: {
    color: 'red',
    marginBottom: 10
  },
  credentialInfo: {
    marginTop: 10,
    fontSize: 12,
    color: '#666'
  }
});
```

## 🔄 Estratégias de Rotação Automática

### 1. Rotação Baseada em Tempo

```typescript
// utils/credential-rotator.ts
export class CredentialRotator {
  private static readonly ROTATION_INTERVAL = 3600 * 1000; // 1 hora
  private static readonly WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutos

  static scheduleRotation(credentialManager: AWSCredentialManager): void {
    setInterval(async () => {
      try {
        await credentialManager.getCredentials(); // Força renovação
        console.log('Credenciais rotacionadas automaticamente');
      } catch (error) {
        console.error('Erro na rotação automática:', error);
      }
    }, this.ROTATION_INTERVAL);
  }

  static scheduleWarning(credentialManager: AWSCredentialManager): void {
    setInterval(async () => {
      const credentials = await credentialManager.getCredentials();
      const timeUntilExpiration = credentials.expiration.getTime() - Date.now();
      
      if (timeUntilExpiration < this.WARNING_THRESHOLD) {
        console.warn('Credenciais expirando em breve');
        // Notificar usuário ou sistema
      }
    }, 60000); // Verificar a cada minuto
  }
}
```

### 2. Rotação Baseada em Eventos

```typescript
// utils/event-based-rotation.ts
export class EventBasedRotation {
  private static readonly EVENTS = {
    APP_FOREGROUND: 'app_foreground',
    SESSION_START: 'session_start',
    ERROR_401: 'error_401',
    ERROR_403: 'error_403'
  };

  static handleEvent(event: string, credentialManager: AWSCredentialManager): void {
    switch (event) {
      case this.EVENTS.APP_FOREGROUND:
        // Renovar credenciais quando app volta ao foco
        credentialManager.getCredentials();
        break;
        
      case this.EVENTS.SESSION_START:
        // Renovar credenciais no início da sessão
        credentialManager.getCredentials();
        break;
        
      case this.EVENTS.ERROR_401:
      case this.EVENTS.ERROR_403:
        // Renovar credenciais em caso de erro de autenticação
        credentialManager.clearCredentials();
        credentialManager.getCredentials();
        break;
    }
  }
}
```

## 🛡️ Medidas de Segurança Adicionais

### 1. Criptografia de Credenciais

```typescript
// utils/encryption.ts
import CryptoJS from 'crypto-js';

export class CredentialEncryption {
  private static readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key';

  static encrypt(credentials: any): string {
    const jsonString = JSON.stringify(credentials);
    return CryptoJS.AES.encrypt(jsonString, this.ENCRYPTION_KEY).toString();
  }

  static decrypt(encryptedData: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.ENCRYPTION_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  }
}
```

### 2. Validação de Credenciais

```typescript
// utils/credential-validator.ts
export class CredentialValidator {
  static validateCredentials(credentials: any): boolean {
    if (!credentials) return false;
    
    const requiredFields = ['accessKeyId', 'secretAccessKey', 'sessionToken', 'expiration'];
    const hasAllFields = requiredFields.every(field => credentials[field]);
    
    if (!hasAllFields) return false;
    
    const expiration = new Date(credentials.expiration);
    const now = new Date();
    
    return expiration > now;
  }

  static isExpiringSoon(credentials: any, thresholdMinutes: number = 5): boolean {
    const expiration = new Date(credentials.expiration);
    const now = new Date();
    const thresholdMs = thresholdMinutes * 60 * 1000;
    
    return (expiration.getTime() - now.getTime()) < thresholdMs;
  }
}
```

### 3. Monitoramento e Alertas

```typescript
// utils/credential-monitor.ts
export class CredentialMonitor {
  static logCredentialUsage(credentials: any, action: string): void {
    const logData = {
      timestamp: new Date().toISOString(),
      action,
      credentialId: credentials.accessKeyId.substring(0, 8) + '...',
      expiration: credentials.expiration,
      environment: process.env.NODE_ENV
    };

    // Enviar para serviço de logs
    console.log('Credential Usage:', logData);
    
    // Pode ser enviado para CloudWatch, DataDog, etc.
  }

  static alertCredentialIssue(issue: string, credentials?: any): void {
    const alertData = {
      timestamp: new Date().toISOString(),
      issue,
      severity: 'warning',
      environment: process.env.NODE_ENV,
      credentialInfo: credentials ? {
        id: credentials.accessKeyId.substring(0, 8) + '...',
        expiration: credentials.expiration
      } : null
    };

    console.error('Credential Alert:', alertData);
    
    // Enviar para sistema de alertas
    // Pode ser Slack, email, SMS, etc.
  }
}
```

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente

```bash
# .env
AWS_REGION=us-east-1
AWS_MASTER_ACCESS_KEY_ID=AKIA...
AWS_MASTER_SECRET_ACCESS_KEY=...
AWS_FACE_LIVENESS_ROLE_ARN=arn:aws:iam::123456789012:role/FaceLivenessRole
JWT_SECRET=seu-jwt-secret-super-seguro
ENCRYPTION_KEY=chave-de-criptografia-32-caracteres
NODE_ENV=production
```

### Configuração de Produção

```typescript
// config/security.ts
export const SecurityConfig = {
  credentialRotation: {
    enabled: process.env.NODE_ENV === 'production',
    interval: 3600 * 1000, // 1 hora
    warningThreshold: 5 * 60 * 1000 // 5 minutos
  },
  
  encryption: {
    enabled: true,
    algorithm: 'AES-256-CBC'
  },
  
  monitoring: {
    enabled: true,
    logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
  },
  
  validation: {
    strictMode: process.env.NODE_ENV === 'production',
    maxRetries: 3
  }
};
```

## 📊 Auditoria e Compliance

### Logs de Auditoria

```typescript
// utils/audit-logger.ts
export class AuditLogger {
  static async logCredentialEvent(event: {
    userId: string;
    action: string;
    success: boolean;
    error?: string;
    metadata?: any;
  }): Promise<void> {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      userId: event.userId,
      action: event.action,
      success: event.success,
      error: event.error,
      metadata: event.metadata,
      ipAddress: 'client-ip', // Obter do contexto
      userAgent: 'user-agent', // Obter do contexto
      sessionId: 'session-id' // Obter do contexto
    };

    // Salvar em banco de dados ou serviço de logs
    console.log('Audit Log:', auditEntry);
  }
}
```

## 🚀 Implementação Gradual

### Fase 1: Implementação Básica
1. Configurar credenciais temporárias
2. Implementar rotação automática
3. Adicionar validação básica

### Fase 2: Segurança Avançada
1. Implementar criptografia
2. Adicionar monitoramento
3. Configurar alertas

### Fase 3: Compliance
1. Implementar logs de auditoria
2. Configurar políticas IAM restritivas
3. Adicionar testes de segurança

## 🔍 Testes de Segurança

```typescript
// __tests__/security.test.ts
import { AWSCredentialManager } from '../utils/aws-credentials';
import { CredentialValidator } from '../utils/credential-validator';

describe('Security Tests', () => {
  test('should validate credentials correctly', () => {
    const validCredentials = {
      accessKeyId: 'AKIA...',
      secretAccessKey: 'secret...',
      sessionToken: 'token...',
      expiration: new Date(Date.now() + 3600000)
    };

    expect(CredentialValidator.validateCredentials(validCredentials)).toBe(true);
  });

  test('should detect expired credentials', () => {
    const expiredCredentials = {
      accessKeyId: 'AKIA...',
      secretAccessKey: 'secret...',
      sessionToken: 'token...',
      expiration: new Date(Date.now() - 3600000)
    };

    expect(CredentialValidator.validateCredentials(expiredCredentials)).toBe(false);
  });
});
```

---

**Nota**: Este guia fornece uma base sólida para implementar rotação segura de credenciais. Adapte as implementações conforme as necessidades específicas do seu projeto e requisitos de compliance. 