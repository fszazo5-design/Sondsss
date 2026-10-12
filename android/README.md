# غلاف Android المحلي

تعمل واجهة React داخل WebView باستخدام ملفات APK المضمّنة فقط. لا يستخدم الغلاف الإنترنت أو OTA أو GitHub أو SQLite؛ بيانات التطبيق تحفظها الواجهة في `localStorage` داخل WebView.

## البناء

```bash
cd ..
npm ci
npm run build
cd android
./gradlew assembleDebug
```

ينتج APK التجربة في `app/build/outputs/apk/debug/app-debug.apk`.
