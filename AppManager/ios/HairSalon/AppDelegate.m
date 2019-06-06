/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
#import <Firebase.h>
//#import "RNFirebaseLinks.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKShareKit/FBSDKShareKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import "RNSplashScreen.h"  // here
#import <GooglePlaces/GooglePlaces.h>
#import <GoogleMaps/GoogleMaps.h>
#import <RNGoogleSignin/RNGoogleSignin.h>


@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  [FIRApp configure];
#ifdef DEBUG
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
  
  [GMSPlacesClient provideAPIKey: @"AIzaSyD7SMX2hKb5RtB5AN3AfRBInVaFc1HzkQE"];
  [GMSServices provideAPIKey: @"AIzaSyD7SMX2hKb5RtB5AN3AfRBInVaFc1HzkQE"];
  
  
  [FIROptions defaultOptions].deepLinkURLScheme = @"com.salozo.business";
  
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  
  //  [GIDSignIn sharedInstance].clientID = @"AIzaSyA-5EN1k_3nFekB84O3ufbH03XALJGsPp8";
  //  [GIDSignIn sharedInstance].delegate = self;
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"HairSalon"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  //[RNSplashScreen show];
  return YES;
}


- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}


//- (BOOL)application:(UIApplication *)application
//continueUserActivity:(NSUserActivity *)userActivity
// restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> *restorableObjects))restorationHandler{
//  return [[RNFirebaseLinks instance] application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
//}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  
  //Set handled link to facebook sdk check
  BOOL handledFB = [[FBSDKApplicationDelegate sharedInstance] application:application
                                                                  openURL:url
                                                        sourceApplication:sourceApplication
                                                               annotation:annotation];
  
  BOOL handledRCT = [RCTLinkingManager application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
  
  BOOL  handledGG = [RNGoogleSignin application:application
                                        openURL:url
                              sourceApplication:sourceApplication//options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                     annotation: annotation];//options[UIApplicationOpenURLOptionsAnnotationKey]];
  
  BOOL handleGGSignIN = [[GIDSignIn sharedInstance] handleURL:url
                                            sourceApplication:sourceApplication
                                                   annotation:annotation];
  
  // Set handled link to RNFirebase
  //  BOOL  handledFIR = [[RNFirebaseLinks instance] application:application openURL:url options:options];
  //
  return handledFB||handledRCT|| handledGG||handleGGSignIN;//||handledFIR;
}

@end
