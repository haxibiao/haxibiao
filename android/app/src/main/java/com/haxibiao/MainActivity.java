package com.haxibiao;
import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.haxibiao.ad.AdBoss;
import org.json.JSONException;
import org.json.JSONObject;
import org.devio.rn.splashscreen.SplashScreen;
import cn.jpush.android.api.JPushInterface;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "haxibiao";
    }

    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, R.style.SplashScreenTheme); // here
        super.onCreate(savedInstanceState);
        AdBoss.init(this, "5017576");  //初始化tt广告appid (正式，不容易改动的)
        JPushInterface.init(this);
    }

    //激励视频结果回调
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);
        try {
            if (resultCode == RESULT_OK && requestCode == 10000) {
                JSONObject json = new JSONObject();
                json.put("video_play", intent.getBooleanExtra("video_play", false));
                json.put("ad_click", intent.getBooleanExtra("ad_click", false));
                json.put("apk_install", intent.getBooleanExtra("apk_install", false));
                json.put("verify_status", intent.getBooleanExtra("verify_status", false));
                AdBoss.myBlockingQueue.add(json.toString());
            }
        } catch (JSONException e) {
            e.printStackTrace();
            AdBoss.myBlockingQueue.add(null);
        }
    }
}
