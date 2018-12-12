package com.example.H5PlusPlugin;

import android.app.Activity;
import android.text.TextUtils;
import android.util.Log;

import com.alipay.sdk.app.AuthTask;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.Map;

import io.dcloud.common.DHInterface.IWebview;
import io.dcloud.common.DHInterface.StandardFeature;
import io.dcloud.common.util.JSUtil;

/**
 * 李留新
 * 2018-01-31
 * 说明:桌面角标扩展插件类
 */
public class AlipayFeature extends StandardFeature {
    AuthResult authResult1=null;
    /**
     * 说明:调用支付宝登录授权的auth方法
     *
     * @param iWebview  使用的页面(固定参数,必须要写)
     * @param jsonArray 显示的角标数量参数 (固定参数,必须要写)
     */
    public void alipayLogin(IWebview iWebview, JSONArray jsonArray) {
        String url=null;
        JSONObject retJSONObj=null;
        try {
            //授权请求的路径
             url = jsonArray.getString(1);
            //执行支付宝授权方法
            this.authV2(url,this.getActivity(),iWebview,jsonArray);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    public  void authV2(final String url, final Activity activity, final IWebview iWebview, final JSONArray jsonArray) {
        Log.e("authV2","支付宝方法");
        Thread authRunnable = new Thread() {
           // AuthResult authResult = null;
            @Override
            public void run() {
                // 构造AuthTask 对象
                AuthTask authTask = new AuthTask(activity);
                // 调用授权接口，获取授权结果（返回值即是授权结果）
                Map<String, String> result = authTask.authV2(url, true);
                AuthResult authResult = new AuthResult(result, true);
                String resultStatus = authResult.getResultStatus();
                // 判断resultStatus 为“9000”且result_code
                // 为“200”则代表授权成功，具体状态码代表含义可参考授权接口文档
                if (TextUtils.equals(resultStatus, "9000") && TextUtils.equals(authResult.getResultCode(), "200")) {
                    // 获取alipay_open_id，调支付时作为参数extern_token 的value
                    // 传入，则支付账户为该授权账户
                    Log.e("authV2","授权成功");
                } else {
                    // 其他状态值则为授权失败
                    Log.e("authV2","授权失败");
                }
                // 调用方法将原生代码的执行结果返回给js层并触发相应的JS层回调函数
                JSONArray newArray = new JSONArray();
                newArray.put(authResult.getResultCode());
                newArray.put(authResult.getResultStatus());
                newArray.put(authResult.getAuthCode());
                newArray.put(authResult.getScope());
                newArray.put(authResult.getUser_id());
                //异步返回到login.js
                JSUtil.execCallback(iWebview, jsonArray.optString(0),newArray, JSUtil.OK, false);
            }
        };
        // 必须异步调用
        Thread authThread = new Thread(authRunnable);
        authThread.start();
    }
    public  Activity getActivity() {
        Class activityThreadClass = null;
        try {
            activityThreadClass = Class.forName("android.app.ActivityThread");
            Object activityThread = activityThreadClass.getMethod("currentActivityThread").invoke(null);
            Field activitiesField = activityThreadClass.getDeclaredField("mActivities");
            activitiesField.setAccessible(true);
            Map activities = (Map) activitiesField.get(activityThread);
            for (Object activityRecord : activities.values()) {
                Class activityRecordClass = activityRecord.getClass();
                Field pausedField = activityRecordClass.getDeclaredField("paused");
                pausedField.setAccessible(true);
                if (!pausedField.getBoolean(activityRecord)) {
                    Field activityField = activityRecordClass.getDeclaredField("activity");
                    activityField.setAccessible(true);
                    Activity activity = (Activity) activityField.get(activityRecord);
                    return activity;
                }
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }
        return null;
    }
    };



