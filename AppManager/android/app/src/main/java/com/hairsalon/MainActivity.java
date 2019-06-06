package com.salozo.business;

import com.facebook.react.ReactActivity;

import org.devio.rn.splashscreen.SplashScreen; //SplashScreen
import android.os.Bundle;

import android.content.Intent; //FBSDK //FCM

import android.content.pm.PackageInfo; //FB Login
import android.content.pm.PackageManager; //FB Login
import android.content.pm.Signature;
import java.security.MessageDigest;
import android.util.Base64;
import java.lang.Object;
import android.util.Log;
import android.content.pm.PackageManager.NameNotFoundException;
import java.security.NoSuchAlgorithmException;
import org.pweitz.reactnative.locationswitch.LocationSwitch;


public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule rendering of the component.
     */
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
        LocationSwitch.getInstance().onActivityResult(requestCode, resultCode);
    }

    @Override
    protected String getMainComponentName() {
        return "HairSalon";
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // SplashScreen.show(this); // here
        super.onCreate(savedInstanceState);
    }

}
