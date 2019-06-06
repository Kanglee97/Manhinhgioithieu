// package com.hairsalon;

// import com.facebook.react.ReactActivity;
// import org.devio.rn.splashscreen.SplashScreen; //SplashScreen
// import android.os.Bundle;
// import android.content.Intent; //FBSDK //FCM
// import java.io.InputStream;
// import java.lang.Byte;

// public class SplashScreen extends ReactActivity {

// /**
// * Returns the name of the main component registered from JavaScript. This is
// * used to schedule rendering of the component.
// */

// private GifImageView gifImageView;

// @Override
// protected void onCreate(Bundle savedInstanceState) {
// super.onCreate(savedInstanceState);
// setContentView(R.layout.activity_splash_screen);

// gifImageView = (GifImageView) findViewById(R.id.gifImageView);

// try {
// InputStream inputStream = getAssets().open("icon.gif");
// byte[] bytes = IOUtils.toByteArray(inputStream);
// gifImageView.setBytes(bytes);
// gifImageView.startAnimation();
// } catch (Exception e) {
// // TODO: handle exception
// }

// new Handler().postDelayed(new Runnable() {
// @Override
// public void run() {
// SplashScreen.this.startActivity(new Intent(SplashScreen.this,
// MainActivity.class));
// SplashScreen.this.finish();
// }
// }, 3000);
// }

// }
