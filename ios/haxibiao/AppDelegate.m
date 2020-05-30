/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"
#import <CodePush/CodePush.h>


//穿山甲
#include "AdBoss.h"
#import "BUAdSDK/BUSplashAdView.h" //启动屏广告

@interface AppDelegate () <BUSplashAdDelegate>

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"haxibiao"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

   //启动屏
  [RNSplashScreen show];
  
  // 穿山甲广告
  [AdBoss init:@"5016582"];
  [AdBoss hookApp:self];
  [AdBoss hookWindow:self.window];
  
  
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [CodePush bundleURL];
#endif
}

//穿山甲开屏广告 回调
- (void)splashAdDidClose:(BUSplashAdView *)splashAd {
  [splashAd removeFromSuperview];
}
- (void)splashAd:(BUSplashAdView *)splashAd didFailWithError:(NSError *)error {
  [splashAd removeFromSuperview];
}

@end
