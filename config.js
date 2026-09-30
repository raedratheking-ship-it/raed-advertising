/* ============================================================
   RAED Advertising — Configuration
   
   ⚠️ ملف حساس: يحتوي على مفاتيح API — لا تشاركه مع أحد
   ============================================================ */

window.RAED_CONFIG = {

  cloudinary: {
    /* --- أساسي --- */
    name:         "cmbiqlub",       // مثل: cmbiqlub
    folder:       "raed-advertising",

    /* --- Preset للصور (Unsigned - آمن، بدون مفاتيح) --- */
    imagePreset:  "raed_unsigned",

    /* --- Preset للبيانات (Signed - يحتاج مفاتيح) --- */
    dataPreset:   "raed_signed",
    apiKey:       "256413529351484",
    apiSecret:    "0bf7QIZNBryeo2uc-2MpFUddJVE"
  },

  /* --- CallMeBot (إشعارات واتساب) --- */
  cmbot:    "7111756",

  /* --- التواصل --- */
  whatsapp: "967770282271",
  email:    "raedadvertising65@gmail.com"

};