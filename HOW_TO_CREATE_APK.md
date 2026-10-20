# Converting SciTrack into an Android APK / Mobile App

Yes, absolutely! Because SciTrack is built with standard web technologies (HTML5, responsive CSS, and JavaScript), it can be converted into an Android APK or installed directly onto your mobile phone.

Here are the 4 ways to run SciTrack on your mobile device, ranked from easiest to most advanced:

---

## Method 1: Instant "No-Code" PWA Install (Fastest & Easiest)
You do not actually need to compile a complex .apk file to run SciTrack like a native app on your phone. Modern mobile browsers support Progressive Web Apps (PWAs):

1. Host the app online for free:
   - Go to Netlify Drop (https://app.netlify.com/drop), Vercel (https://vercel.com/), or GitHub Pages (https://pages.github.com/).
   - Drag and drop your scitrack-project folder. You will instantly get a live web link (e.g., https://scitrack-demo.netlify.app).
2. Open on your mobile phone:
   - Open that URL in Google Chrome on your Android phone (or Safari on iPhone).
3. Install to Home Screen:
   - On Android: Tap the three dots menu in the top right corner of Chrome -> tap "Install app" or "Add to Home screen".
   - On iOS: Tap the Share button at the bottom of Safari -> tap "Add to Home Screen".
4. Result:
   - SciTrack installs onto your home screen and app drawer with its own app icon.
   - When tapped, it opens in full-screen standalone mode with no browser address bar.
   - All your lab tasks, notebook logs, recipes, and failure logs stay securely saved on your device via localStorage!

---

## Method 2: Convert to APK via PWABuilder (Online, Free, No Coding)
If you specifically need a .apk file to share directly with lab partners or classmates via WhatsApp or Google Drive:

1. Host your project folder on GitHub Pages or Netlify Drop as described in Method 1.
2. Go to PWABuilder (https://www.pwabuilder.com/) (created by Microsoft).
3. Enter your live website URL and click Start.
4. PWABuilder reads the included manifest.json file automatically.
5. Click "Package for Stores" -> Select Android.
6. Click "Generate APK" to download the signed .apk file.
7. Transfer the .apk to your Android phone, tap it to install, and grant permission to "Install Unknown Apps".

---

## Method 3: Capacitor / Ionic (Industry-Standard Web-to-Native)
If you have a laptop with Node.js and want to generate native Android Studio projects:

1. Open your terminal in the extracted scitrack-project folder.
2. Initialize Capacitor:
   npm init -y
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init "SciTrack" "com.scitrack.labhub" --web-dir .
   npx cap add android
   npx cap copy
   npx cap open android
3. This will launch Android Studio automatically with your Android project ready.
4. In Android Studio, go to the top menu: Build > Build Bundle(s) / APK(s) > Build APK(s).
5. Once compiled, click "locate" to find your app-debug.apk file!

---

## Method 4: Native Android Studio WebView Wrapper
If you or someone in your class already has Android Studio installed:

1. Open Android Studio and create a New Project > Empty Views Activity.
2. Create an assets folder: right-click app/src/main -> New > Folder > Assets Folder.
3. Copy index.html (and any related files) into app/src/main/assets/.
4. In AndroidManifest.xml, make sure you have internet permission (for Tailwind CDN):
   <uses-permission android:name="android.permission.INTERNET" />
5. In MainActivity.kt:
   package com.example.scitrack

   import android.os.Bundle
   import android.webkit.WebView
   import android.webkit.WebViewClient
   import androidx.appcompat.app.AppCompatActivity

   class MainActivity : AppCompatActivity() {
       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           val webView = WebView(this)
           setContentView(webView)

           webView.settings.javaScriptEnabled = true
           webView.settings.domStorageEnabled = true
           webView.webViewClient = WebViewClient()
           webView.loadUrl("file:///android_asset/index.html")
       }
   }
6. Click Build > Build APK(s) to generate your standalone installer!
