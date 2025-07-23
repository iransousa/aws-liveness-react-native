/**
 * AWS Face Liveness Detection App
 * Módulo React Native para detecção de vivacidade facial usando AWS Amplify
 */

import React, {useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Alert,
  DeviceEventEmitter,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import AwsLivenessTurboModules from './src';

// Sistema de internacionalização
const translations = {
  pt: {
    title: 'Face Liveness Detection',
    subtitle: 'AWS Amplify Face Liveness Detector',
    permissionStatus: 'Status da Permissão',
    checkingPermission: 'Verificando permissão de câmera...',
    permissionDenied: 'Permissão de câmera não concedida',
    permissionGranted: 'Permissão de câmera concedida',
    startVerification: 'Iniciar Verificação de Vivacidade',
    starting: 'Iniciando...',
    requestPermission: 'Solicitar Permissão de Câmera',
    howItWorks: 'Como funciona',
    instructions: [
      '• Posicione seu rosto na frente da câmera',
      '• Siga as instruções na tela',
      '• A verificação detectará se você é uma pessoa real',
      '• O processo é rápido e seguro',
    ],
    verificationInProgress: 'Verificação em andamento...',
    followInstructions: 'Siga as instruções na tela',
    verificationResult: 'Resultado da Verificação',
    success: '✅ Sucesso',
    failure: '❌ Falha',
    successMessage: 'Verificação de vivacidade facial concluída com sucesso!',
    errorMessage: 'Erro na verificação:',
    newVerification: 'Nova Verificação',
    permissionDeniedTitle: 'Permissão Negada',
    permissionDeniedMessage: 'É necessário conceder permissão de câmera para usar a verificação de vivacidade facial.',
    errorTitle: 'Erro',
    errorGenericMessage: 'Ocorreu um erro durante a verificação de vivacidade facial.',
    successTitle: 'Sucesso',
    language: 'Idioma',
    portuguese: 'Português',
    english: 'English',
  },
  en: {
    title: 'Face Liveness Detection',
    subtitle: 'AWS Amplify Face Liveness Detector',
    permissionStatus: 'Permission Status',
    checkingPermission: 'Checking camera permission...',
    permissionDenied: 'Camera permission denied',
    permissionGranted: 'Camera permission granted',
    startVerification: 'Start Liveness Verification',
    starting: 'Starting...',
    requestPermission: 'Request Camera Permission',
    howItWorks: 'How it works',
    instructions: [
      '• Position your face in front of the camera',
      '• Follow the instructions on screen',
      '• The verification will detect if you are a real person',
      '• The process is quick and secure',
    ],
    verificationInProgress: 'Verification in progress...',
    followInstructions: 'Follow the instructions on screen',
    verificationResult: 'Verification Result',
    success: '✅ Success',
    failure: '❌ Failed',
    successMessage: 'Face liveness verification completed successfully!',
    errorMessage: 'Verification error:',
    newVerification: 'New Verification',
    permissionDeniedTitle: 'Permission Denied',
    permissionDeniedMessage: 'Camera permission is required to use face liveness verification.',
    errorTitle: 'Error',
    errorGenericMessage: 'An error occurred during face liveness verification.',
    successTitle: 'Success',
    language: 'Language',
    portuguese: 'Português',
    english: 'English',
  },
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [permissionsGranted, setPermissionsGranted] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [language, setLanguage] = React.useState<'pt' | 'en'>('pt');
  const [livenessResult, setLivenessResult] = React.useState<{
    success: boolean;
    message: string;
    timestamp: string;
  } | null>(null);

  const t = translations[language];

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
  };

  // Função para solicitar permissão de câmera
  const requestCameraPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: t.permissionDeniedTitle,
            message: t.permissionDeniedMessage,
            buttonNeutral: 'Perguntar depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permissão de câmera concedida');
          setPermissionsGranted(true);
          return true;
        } else {
          console.log('Permissão de câmera negada');
          setPermissionsGranted(false);
          Alert.alert(
            t.permissionDeniedTitle,
            t.permissionDeniedMessage
          );
          return false;
        }
      } catch (err) {
        console.warn('Erro ao solicitar permissão de câmera:', err);
        setPermissionsGranted(false);
        return false;
      }
    }
    setPermissionsGranted(true);
    return true;
  }, [t]);

  const handleStartLiveness = async () => {
    try {
      setIsLoading(true);

      // Solicita permissão de câmera primeiro
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      // Start face liveness detection with AWS credentials
      const result = await AwsLivenessTurboModules.startFaceLivenessDetection(
        '',
        '',
        '',
        '',
        ''
      );

      console.log('Face Liveness started:', result);
    } catch (error) {
      console.error('Face Liveness Error:', error);
      Alert.alert(t.errorTitle, t.errorGenericMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Solicita permissão de câmera automaticamente ao abrir o app
    requestCameraPermission();
  }, [requestCameraPermission]);

  useEffect(() => {
    // Add event listeners for liveness events
    DeviceEventEmitter.addListener('FaceLivenessComplete', (data) => {
      console.log('Face Liveness completed:', data);
      setLivenessResult({
        success: true,
        message: t.successMessage,
        timestamp: new Date().toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US'),
      });
      Alert.alert(t.successTitle, t.successMessage);
    });

    DeviceEventEmitter.addListener('FaceLivenessError', (error) => {
      console.error('Face Liveness error:', error);
      setLivenessResult({
        success: false,
        message: `${t.errorMessage} ${error}`,
        timestamp: new Date().toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US'),
      });
      Alert.alert(t.errorTitle, `${t.errorMessage} ${error}`);
    });

    return () => {
      DeviceEventEmitter.removeAllListeners('FaceLivenessComplete');
      DeviceEventEmitter.removeAllListeners('FaceLivenessError');
    };
  }, [t, language]);

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, {color: isDarkMode ? '#ffffff' : '#1a1a1a'}]}>
            {t.title}
          </Text>
          <Text style={[styles.subtitle, {color: isDarkMode ? '#cccccc' : '#666666'}]}>
            {t.subtitle}
          </Text>
        </View>

        {/* Language Selector */}
        <View style={[styles.languageCard, {backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff'}]}>
          <Text style={[styles.languageTitle, {color: isDarkMode ? '#ffffff' : '#1a1a1a'}]}>
            {t.language}
          </Text>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                {
                  backgroundColor: language === 'pt' ? '#007AFF' : 'transparent',
                  borderColor: language === 'pt' ? '#007AFF' : '#cccccc',
                },
              ]}
              onPress={() => setLanguage('pt')}
            >
              <Text style={[
                styles.languageButtonText,
                {color: language === 'pt' ? '#ffffff' : (isDarkMode ? '#cccccc' : '#666666')},
              ]}>
                {t.portuguese}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                {
                  backgroundColor: language === 'en' ? '#007AFF' : 'transparent',
                  borderColor: language === 'en' ? '#007AFF' : '#cccccc',
                },
              ]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[
                styles.languageButtonText,
                {color: language === 'en' ? '#ffffff' : (isDarkMode ? '#cccccc' : '#666666')},
              ]}>
                {t.english}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Card */}
        <View style={[styles.statusCard, {backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff'}]}>
          <Text style={[styles.statusTitle, {color: isDarkMode ? '#ffffff' : '#1a1a1a'}]}>
            {t.permissionStatus}
          </Text>

          {permissionsGranted === null && (
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, {backgroundColor: '#ffa500'}]} />
              <Text style={[styles.statusText, {color: '#ffa500'}]}>
                {t.checkingPermission}
              </Text>
            </View>
          )}

          {permissionsGranted === false && (
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, {backgroundColor: '#ff4444'}]} />
              <Text style={[styles.statusText, {color: '#ff4444'}]}>
                {t.permissionDenied}
              </Text>
            </View>
          )}

          {permissionsGranted === true && (
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, {backgroundColor: '#00cc44'}]} />
              <Text style={[styles.statusText, {color: '#00cc44'}]}>
                {t.permissionGranted}
              </Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.startButton,
              {
                backgroundColor: permissionsGranted === true ? '#007AFF' : '#cccccc',
                opacity: isLoading ? 0.7 : 1,
              },
            ]}
            onPress={handleStartLiveness}
            disabled={permissionsGranted === false || isLoading}
          >
            <Text style={styles.startButtonText}>
              {isLoading ? t.starting : t.startVerification}
            </Text>
          </TouchableOpacity>

          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, {color: isDarkMode ? '#cccccc' : '#666666'}]}>
                {t.verificationInProgress}
              </Text>
              <Text style={[styles.loadingSubtext, {color: isDarkMode ? '#999999' : '#888888'}]}>
                {t.followInstructions}
              </Text>
            </View>
          )}

          {permissionsGranted === false && (
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestCameraPermission}
            >
              <Text style={styles.permissionButtonText}>
                {t.requestPermission}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, {backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff'}]}>
          <Text style={[styles.infoTitle, {color: isDarkMode ? '#ffffff' : '#1a1a1a'}]}>
            {t.howItWorks}
          </Text>
          <Text style={[styles.infoText, {color: isDarkMode ? '#cccccc' : '#666666'}]}>
            {t.instructions.map((instruction, index) => (
              <Text key={index}>
                {instruction}
                {index < t.instructions.length - 1 ? '\n' : ''}
              </Text>
            ))}
          </Text>
        </View>

        {/* Result Card */}
        {livenessResult && (
          <View style={[
            styles.resultCard,
            {
              backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
              borderColor: livenessResult.success ? '#00cc44' : '#ff4444',
            },
          ]}>
            <Text style={[styles.resultTitle, {color: isDarkMode ? '#ffffff' : '#1a1a1a'}]}>
              {t.verificationResult}
            </Text>

            <View style={styles.resultItem}>
              <View style={[
                styles.resultDot,
                {backgroundColor: livenessResult.success ? '#00cc44' : '#ff4444'},
              ]} />
              <Text style={[
                styles.resultText,
                {color: livenessResult.success ? '#00cc44' : '#ff4444'},
              ]}>
                {livenessResult.success ? t.success : t.failure}
              </Text>
            </View>

            <Text style={[styles.resultMessage, {color: isDarkMode ? '#cccccc' : '#666666'}]}>
              {livenessResult.message}
            </Text>

            <Text style={[styles.resultTimestamp, {color: isDarkMode ? '#999999' : '#888888'}]}>
              {livenessResult.timestamp}
            </Text>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setLivenessResult(null)}
            >
              <Text style={styles.clearButtonText}>
                {t.newVerification}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  languageCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  languageTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  languageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  languageButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionContainer: {
    marginBottom: 30,
  },
  startButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonText: {
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
  infoCard: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  resultCard: {
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultMessage: {
    fontSize: 14,
    marginBottom: 10,
  },
  resultTimestamp: {
    fontSize: 12,
    textAlign: 'right',
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
    marginTop: 15,
  },
  clearButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  loadingSubtext: {
    fontSize: 12,
  },
});

export default App;
