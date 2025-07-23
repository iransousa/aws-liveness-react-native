package com.awslivenessturbomodules.AwsLivenessTurboModules

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import com.amplifyframework.auth.AWSCredentials
import com.amplifyframework.auth.AWSCredentialsProvider
import com.amplifyframework.auth.AWSTemporaryCredentials
import com.amplifyframework.auth.AuthException
import com.amplifyframework.ui.liveness.ui.FaceLivenessDetector
import com.amplifyframework.ui.liveness.ui.LivenessColorScheme
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import aws.smithy.kotlin.runtime.time.Instant


class FaceDetector: ComponentActivity() {

    companion object {
        private var reactContext: ReactApplicationContext? = null

        fun setReactContext(context: ReactApplicationContext) {
            reactContext = context
        }
    }

    private class MyCredentialsProvider(private val credentials: AWSTemporaryCredentials?) : AWSCredentialsProvider<AWSCredentials> {
        override fun fetchAWSCredentials(
                onSuccess: com.amplifyframework.core.Consumer<AWSCredentials>,
                onError: com.amplifyframework.core.Consumer<AuthException>
        ) {
            if (credentials != null) {
                onSuccess.accept(credentials)
            } else {
                onError.accept(AuthException("No credentials provided", ""))
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Recebe os dados passados do React Native via Intent
        val sessionId = intent.getStringExtra("EXTRA_SESSION_ID") ?: ""
        val accessKeyId = intent.getStringExtra("EXTRA_ACCESS_KEY_ID")
        val secretKey = intent.getStringExtra("EXTRA_SECRET_KEY")
        val sessionToken = intent.getStringExtra("EXTRA_SESSION_TOKEN")
        val expirationString = intent.getStringExtra("EXTRA_EXPIRATION")
        
        // Converte a string de expiração para Instant
        val expiration = try {
            Instant.fromIso8601(expirationString ?: "2025-12-31T23:59:59Z")
        } catch (e: Exception) {
            Log.w("FaceDetector", "Invalid expiration date, using default", e)
            Instant.fromIso8601("2025-12-31T23:59:59Z")
        }

        // Cria as credenciais AWS se todos os parâmetros estiverem presentes
        val credentials = if (accessKeyId != null && secretKey != null && sessionToken != null) {
            AWSTemporaryCredentials(accessKeyId, secretKey, sessionToken, expiration)
        } else {
            Log.w("FaceDetector", "Missing AWS credentials")
            null
        }

        // Inicializa o Compose com o FaceLivenessDetector
        setContent {
            FaceLivenessContent(sessionId, credentials)
        }
    }

    @Composable
    fun FaceLivenessContent(sessionId: String, credentials: AWSTemporaryCredentials?) {
        MaterialTheme(
                colorScheme = LivenessColorScheme.default()
        ) {
            Column {
                Log.i("FaceDetector", "Starting Face Liveness with sessionId: $sessionId")
                FaceLivenessDetector(
                        sessionId = sessionId,
                        region = "us-east-1",
                        disableStartView = true,
                        onComplete = {
                            Log.i("FaceDetector", "Face Liveness flow is complete")
                            reactContext?.let { sendEvent(it, "FaceLivenessComplete", "success") }
                            finish()
                        },
                        credentialsProvider = MyCredentialsProvider(credentials),
                        onError = { error ->
                            Log.e("FaceDetector", "Error during Face Liveness flow: ${error.message}", error.throwable)
                            reactContext?.let { sendEvent(it, "FaceLivenessError", error.message ?: "Unknown error") }
                            finish()
                        }
                )
            }
        }
    }

    private fun sendEvent(reactContext: ReactApplicationContext, eventName: String, eventData: String) {
        try {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, eventData)
        } catch (e: Exception) {
            Log.e("FaceDetector", "Error sending event: ${e.message}", e)
        }
    }
}