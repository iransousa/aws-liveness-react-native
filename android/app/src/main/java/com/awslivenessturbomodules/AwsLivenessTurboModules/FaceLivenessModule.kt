package com.awslivenessturbomodules.AwsLivenessTurboModules

import android.content.Intent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = FaceLivenessModule.NAME)
class FaceLivenessModule internal constructor(private var reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    companion object {
        const val NAME = "AwsLivenessTurboModules"
    }
    
    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun startFaceLivenessDetection(sessionId: String?, accessKeyId: String?, secretKey: String?, sessionToken: String?, expiration: String?, promise: Promise) {
        val activity = currentActivity ?: run {
            promise.reject("ERROR", "Activity not available")
            return
        }
        
        activity.runOnUiThread {
            try {
                FaceDetector.setReactContext(reactContext)

                val intent = Intent(activity, FaceDetector::class.java)
                sessionId?.let {
                    intent.putExtra("EXTRA_SESSION_ID", it)
                }
                accessKeyId?.let {
                    intent.putExtra("EXTRA_ACCESS_KEY_ID", it)
                }
                secretKey?.let {
                    intent.putExtra("EXTRA_SECRET_KEY", it)
                }
                sessionToken?.let {
                    intent.putExtra("EXTRA_SESSION_TOKEN", it)
                }
                expiration?.let {
                    intent.putExtra("EXTRA_EXPIRATION", it)
                }
                
                activity.startActivity(intent)
                promise.resolve("success")
            } catch (e: Exception) {
                promise.reject("ERROR", e.message, e)
            }
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Método vazio - os eventos são emitidos diretamente do FaceDetector
        // Este método é necessário para compatibilidade com o React Native
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Método vazio - os listeners são gerenciados pelo React Native
        // Este método é necessário para compatibilidade com o React Native
    }
}