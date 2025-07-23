import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

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