package com.salozo.business;
import android.app.Application;
import com.facebook.react.ReactApplication;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import org.reactnative.camera.RNCameraPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.opensettings.OpenSettingsPackage; // <-- Opensetting
import org.pweitz.reactnative.locationswitch.LocationSwitchPackage;
import com.horcrux.svg.SvgPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.imagepicker.ImagePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage; // <-- Firebase Storage
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage; // <-- GGMaps
import io.invertase.firebase.RNFirebasePackage; // <-- Firebase
import io.invertase.firebase.auth.RNFirebaseAuthPackage; // <-- FirebaseAuth
import io.invertase.firebase.database.RNFirebaseDatabasePackage; // <-- FirebaseDatabase
import com.facebook.CallbackManager; // <-- FbSDK
import com.facebook.FacebookSdk; // <-- FbSDK
import com.facebook.reactnative.androidsdk.FBSDKPackage; // <-- FbSDK
import com.facebook.appevents.AppEventsLogger; // <-- FbSDK
import co.apptailor.googlesignin.RNGoogleSigninPackage; // <-- Google SignIn
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; // <-- FirebaseNotification
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage; // <-- Notification
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.oblador.vectoricons.VectorIconsPackage; // <-- Vector Icon
import org.devio.rn.splashscreen.SplashScreenReactPackage; // <-- SplashScreen
import com.BV.LinearGradient.LinearGradientPackage; // <-- Linear Gradient
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ImageResizerPackage(),
            new RNCameraPackage(),
            new RNDeviceInfo(),
            new SvgPackage(),
            new PickerPackage(),
            new ImagePickerPackage(),
            new RNFetchBlobPackage(),
            new RNFirebaseStoragePackage(), // <-- Firebase Storage
            new RNGooglePlacesPackage(), // GG Maps
            new RNGoogleSigninPackage(), // GG Login
            new FBSDKPackage(mCallbackManager), //FB SDK
            new RNFirebasePackage(), // Firebase
            new RNFirebaseAuthPackage(), // FirebaseAuth
            new RNFirebaseMessagingPackage(), // <-- FirebaseNotification
            new RNFirebaseNotificationsPackage(), // <-- Notification
            new RNGestureHandlerPackage(), 
            new VectorIconsPackage(), 
            new SplashScreenReactPackage(), // SplashScreen
            new LinearGradientPackage(), //BG Gradient
            new OpenSettingsPackage(),
            new LocationSwitchPackage(),
            new RNFirebaseDatabasePackage()
            ); 
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    AppEventsLogger.activateApp(this);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
