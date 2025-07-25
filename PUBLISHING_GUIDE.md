# 📦 Guia de Publicação - AWS Liveness Turbo Modules

Este guia explica como publicar o pacote `aws-liveness-turbo-modules` no npm.

## 🚀 Pré-requisitos

### 1. Conta npm
- Criar conta em [npmjs.com](https://www.npmjs.com)
- Verificar email da conta
- Configurar autenticação de dois fatores (recomendado)

### 2. Login no npm
```bash
npm login
```

### 3. Verificar login
```bash
npm whoami
```

## 📋 Checklist de Publicação

### ✅ Antes da Publicação

1. **Testar o módulo**
   ```bash
   npm test
   ```

2. **Verificar build**
   ```bash
   npm run build
   ```

3. **Verificar arquivos incluídos**
   ```bash
   npm pack --dry-run
   ```

4. **Atualizar documentação**
   - README.md está atualizado
   - Documentação técnica está completa
   - Exemplos de uso estão funcionando

5. **Verificar package.json**
   - Nome do pacote está correto
   - Versão está atualizada
   - Dependências estão corretas
   - Keywords estão relevantes

## 🔧 Publicação Manual

### 1. Atualizar versão
```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

### 2. Publicar
```bash
npm publish
```

### 3. Verificar publicação
```bash
npm view aws-liveness-turbo-modules
```

## 🤖 Publicação Automática

### Usando o script de publicação
```bash
npm run publish-package
```

O script irá:
1. Verificar se você está logado no npm
2. Perguntar a nova versão
3. Executar testes
4. Fazer build do projeto
5. Mostrar quais arquivos serão publicados
6. Pedir confirmação
7. Publicar no npm
8. Criar tag git

## 📁 Estrutura do Pacote

### Arquivos incluídos no npm
```
aws-liveness-turbo-modules/
├── src/
│   ├── index.ts
│   └── AwsLivenessTurboModules.ts
├── android/
│   └── app/src/main/java/com/awslivenessturbomodules/
│       ├── FaceLivenessModule.kt
│       ├── FaceDetector.kt
│       └── FaceLivenessPackage.kt
├── ios/
│   └── (arquivos iOS quando implementados)
├── README.md
├── README_FACE_LIVENESS.md
├── README_FACE_LIVENESS_EN.md
├── INTEGRATION_GUIDE.md
├── SECURITY_GUIDE.md
├── DOCUMENTATION.md
└── LICENSE
```

### Arquivos excluídos (.npmignore)
- `node_modules/`
- `__tests__/`
- `App.tsx`
- `index.js`
- `app.json`
- Arquivos de desenvolvimento

## 🔄 Atualizações

### Para atualizações de patch (correções)
```bash
npm version patch
npm publish
```

### Para atualizações de funcionalidades
```bash
npm version minor
npm publish
```

### Para breaking changes
```bash
npm version major
npm publish
```

## 🐛 Troubleshooting

### Erro: "You must be logged in"
```bash
npm login
```

### Erro: "Package name already exists"
- Verificar se o nome está disponível: `npm search aws-liveness-turbo-modules`
- Escolher um nome alternativo se necessário

### Erro: "Invalid package name"
- Nomes devem ser lowercase
- Não podem conter espaços
- Podem conter hífens e underscores

### Erro: "Missing required field"
- Verificar se todos os campos obrigatórios estão no package.json
- Verificar se o arquivo main existe

## 📊 Monitoramento

### Verificar downloads
```bash
npm view aws-liveness-turbo-modules downloads
```

### Verificar versões
```bash
npm view aws-liveness-turbo-modules versions
```

### Verificar dependências
```bash
npm view aws-liveness-turbo-modules dependencies
```

## 🔐 Segurança

### Antes de publicar
1. Verificar se não há credenciais AWS no código
2. Verificar se não há chaves privadas
3. Verificar se não há informações sensíveis

### Após publicação
1. Monitorar issues no GitHub
2. Responder a perguntas da comunidade
3. Manter documentação atualizada

## 📈 Melhores Práticas

### 1. Versionamento Semântico
- **MAJOR**: Breaking changes
- **MINOR**: Novas funcionalidades (backward compatible)
- **PATCH**: Correções de bugs (backward compatible)

### 2. Changelog
- Manter um CHANGELOG.md
- Documentar todas as mudanças
- Incluir breaking changes

### 3. Tags Git
- Criar tags para cada versão
- Usar formato `v1.0.0`
- Incluir descrição na tag

### 4. Testes
- Sempre executar testes antes de publicar
- Testar em diferentes versões do React Native
- Testar em diferentes dispositivos

## 🎯 Próximos Passos

1. **Primeira publicação**
   - Publicar versão 1.0.0
   - Criar repositório GitHub
   - Configurar CI/CD

2. **Manutenção contínua**
   - Monitorar issues
   - Atualizar dependências
   - Melhorar documentação

3. **Crescimento da comunidade**
   - Responder perguntas
   - Aceitar contribuições
   - Manter qualidade do código

---

**Dica**: Sempre teste o pacote em um projeto real antes de publicar! 