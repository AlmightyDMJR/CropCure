'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type LangCode = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'ml'

export interface Translations {
  // Navbar
  navHistory: string
  navLocalDetails: string
  navNewDiagnosis: string
  navSignIn: string
  navSignOut: string
  // Hero
  heroTagline: string
  heroTitle1: string
  heroTitle2: string
  heroDescription: string
  heroCta: string
  heroCtaSub: string
  heroResearch: string
  // How it works
  howTitle: string
  step1: string
  step2: string
  step3: string
  // Features
  whyTitle: string
  whyHeading: string
  feat1Label: string
  feat1Title: string
  feat1Desc: string
  feat2Label: string
  feat2Title: string
  feat2Desc: string
  feat3Label: string
  feat3Title: string
  feat3Desc: string
  // Local Details
  localLabel: string
  localHeading: string
  localDesc: string
  // ChatBot
  chatGreeting: string
  chatPlaceholder: string
  chatPowered: string
  chatSubtitle: string
  // Footer
  footer: string

  // Upload Page
  upSubtitle: string
  upTitle: string
  upDesc: string
  upAnalyze: string
  upAnalyzing: string

  // History Page
  histLabel: string
  histTitle: string
  histResults: string
  histEmptyTitle: string
  histEmptyDesc: string
  histBtn: string
  histLoading: string
  histConf: string

  // Login Page
  logWelcomeIn: string
  logWelcomeUp: string
  logSubIn: string
  logSubUp: string
  logEmail: string
  logPass: string
  logBtnIn: string
  logBtnUp: string
  logToggleIn: string
  logToggleUp: string

  // Results Page
  resUnavTitle: string
  resUnavDesc: string
  resTryAgain: string
  resNew: string
  resComplete: string
}

export const LANGUAGES: { code: LangCode; label: string; native: string; flag: string }[] = [
  { code: 'en', label: 'English',   native: 'English',    flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi',     native: 'हिन्दी',      flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali',   native: 'বাংলা',       flag: '🇧🇩' },
  { code: 'ta', label: 'Tamil',     native: 'தமிழ்',       flag: '🇮🇳' },
  { code: 'te', label: 'Telugu',    native: 'తెలుగు',      flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം',      flag: '🇮🇳' },
]

export const ALL_TRANSLATIONS: Record<LangCode, Translations> = {
  en: {
    navHistory: 'History',
    navLocalDetails: 'Local Details',
    navNewDiagnosis: 'New Diagnosis',
    navSignIn: 'Sign In',
    navSignOut: 'Sign Out',
    heroTagline: 'Powered by AI Vision',
    heroTitle1: "Know what's wrong",
    heroTitle2: 'with your crop.',
    heroDescription: 'Upload a photo and get an AI-powered diagnosis with treatment steps grounded in plant & crop pathology research — in under 30 seconds.',
    heroCta: 'Start Diagnosis',
    heroCtaSub: 'Local Details',
    heroResearch: 'Treatment guidance informed by peer-reviewed plant & crop pathology research',
    howTitle: 'How it works',
    step1: 'Take a close-up photo of the affected area',
    step2: 'Upload it — drag & drop or tap to browse',
    step3: 'Get a full diagnosis with confidence score and treatment plan',
    whyTitle: 'Why CropCure',
    whyHeading: 'Built for accuracy, not impressiveness',
    feat1Label: 'AI Vision',
    feat1Title: 'See what your crop is telling you',
    feat1Desc: 'AI reads visual symptoms the same way a plant & crop pathologist would — distribution, tissue texture, lesion patterns.',
    feat2Label: 'Honest Confidence',
    feat2Title: 'Calibrated to the real world',
    feat2Desc: 'Scores reflect actual field accuracy — not inflated lab benchmarks. Ambiguous cases are flagged, not guessed.',
    feat3Label: 'Research-Backed',
    feat3Title: 'Treatment from the literature',
    feat3Desc: 'Every recommendation traces back to peer-reviewed plant & crop pathology research — not gardening forums.',
    localLabel: 'Your Location',
    localHeading: 'Local Farming Intelligence',
    localDesc: 'Real-time weather, soil health estimates, and today\'s crop market prices — all tailored to your region.',
    chatGreeting: "Hello! I'm **CropCure AI** 🌱 — your expert agricultural assistant. Ask me anything about crops, plant diseases, pests, weather impact, or farming techniques!",
    chatPlaceholder: 'Ask about crops, plants, weather…',
    chatPowered: 'Powered by CropCure AI · Press Enter to send',
    chatSubtitle: 'Crop · Plant · Weather Expert',
    footer: '© 2026 CropCure',
    upSubtitle: 'Crop Diagnosis',
    upTitle: 'Upload your plant photo',
    upDesc: 'Get a full AI diagnosis with treatment steps in under 30 seconds.',
    upAnalyze: 'Analyze Crop',
    upAnalyzing: 'Analyzing…',
    histLabel: 'Your records',
    histTitle: 'Diagnosis History',
    histResults: 'results',
    histEmptyTitle: 'No diagnoses yet',
    histEmptyDesc: 'Upload a photo to get your first plant diagnosis.',
    histBtn: 'Start Diagnosis',
    histLoading: 'Loading your history...',
    histConf: 'confidence',
    logWelcomeIn: 'Welcome back',
    logWelcomeUp: 'Create an account',
    logSubIn: 'Enter your details to access your dashboard.',
    logSubUp: 'Start analyzing your crops today.',
    logEmail: 'Email address',
    logPass: 'Password',
    logBtnIn: 'Sign in',
    logBtnUp: 'Sign up',
    logToggleIn: 'Create an account',
    logToggleUp: 'Sign in instead',
    resUnavTitle: 'Diagnosis unavailable',
    resUnavDesc: 'This diagnosis could not be loaded. The image may have been unclear or the analysis timed out.',
    resTryAgain: 'Try again',
    resNew: 'New diagnosis',
    resComplete: 'Diagnosis Complete'
  },
  hi: {
    navHistory: 'इतिहास',
    navLocalDetails: 'स्थानीय विवरण',
    navNewDiagnosis: 'नई जाँच',
    navSignIn: 'साइन इन',
    navSignOut: 'साइन आउट',
    heroTagline: 'AI विज़न द्वारा संचालित',
    heroTitle1: 'जानें क्या गलत है',
    heroTitle2: 'आपकी फसल के साथ।',
    heroDescription: 'एक फोटो अपलोड करें और पौधे एवं फसल विकृति विज्ञान पर आधारित AI निदान प्राप्त करें — 30 सेकंड से कम में।',
    heroCta: 'जाँच शुरू करें',
    heroCtaSub: 'स्थानीय विवरण',
    heroResearch: 'सहकर्मी-समीक्षित पौधे एवं फसल विकृति विज्ञान शोध पर आधारित उपचार मार्गदर्शन',
    howTitle: 'यह कैसे काम करता है',
    step1: 'प्रभावित क्षेत्र की क्लोज़-अप फोटो लें',
    step2: 'इसे अपलोड करें — ड्रैग & ड्रॉप या ब्राउज़ करें',
    step3: 'विश्वास स्कोर और उपचार योजना के साथ पूर्ण निदान प्राप्त करें',
    whyTitle: 'CropCure क्यों',
    whyHeading: 'सटीकता के लिए बनाया गया, दिखावे के लिए नहीं',
    feat1Label: 'AI विज़न',
    feat1Title: 'देखें आपकी फसल क्या बता रही है',
    feat1Desc: 'AI दृश्य लक्षणों को उसी तरह पढ़ता है जैसे एक पौधे और फसल रोगविज्ञानी पढ़ता है।',
    feat2Label: 'ईमानदार विश्वास',
    feat2Title: 'वास्तविक दुनिया के अनुसार अंशांकित',
    feat2Desc: 'स्कोर वास्तविक क्षेत्र सटीकता को दर्शाते हैं — फुलाए हुए लैब बेंचमार्क को नहीं।',
    feat3Label: 'शोध-समर्थित',
    feat3Title: 'साहित्य से उपचार',
    feat3Desc: 'हर सिफारिश सहकर्मी-समीक्षित शोध से जुड़ती है — बागवानी मंचों से नहीं।',
    localLabel: 'आपका स्थान',
    localHeading: 'स्थानीय कृषि बुद्धिमत्ता',
    localDesc: 'रीयल-टाइम मौसम, मिट्टी स्वास्थ्य अनुमान, और आज के फसल बाजार मूल्य — आपके क्षेत्र के अनुसार।',
    chatGreeting: 'नमस्ते! मैं **CropCure AI** 🌱 हूँ — आपका कृषि विशेषज्ञ सहायक। फसलें, पौधों की बीमारियाँ, कीट, मौसम प्रभाव या खेती की तकनीकों के बारे में कुछ भी पूछें!',
    chatPlaceholder: 'फसल, पौधे, मौसम के बारे में पूछें…',
    chatPowered: 'CropCure AI द्वारा संचालित · भेजने के लिए Enter दबाएं',
    chatSubtitle: 'फसल · पौधे · मौसम विशेषज्ञ',
    footer: '© 2026 CropCure',
    upSubtitle: 'फसल निदान',
    upTitle: 'अपनी पौधे की फोटो अपलोड करें',
    upDesc: '30 सेकंड के भीतर उपचार के कदमों के साथ पूर्ण AI निदान प्राप्त करें।',
    upAnalyze: 'फसल का विश्लेषण करें',
    upAnalyzing: 'विश्लेषण हो रहा है…',
    histLabel: 'आपके रिकॉर्ड',
    histTitle: 'निदान इतिहास',
    histResults: 'परिणाम',
    histEmptyTitle: 'अभी तक कोई निदान नहीं',
    histEmptyDesc: 'अपना पहला पौधे का निदान पाने के लिए फोटो अपलोड करें।',
    histBtn: 'निदान शुरू करें',
    histLoading: 'आपका इतिहास लोड हो रहा है...',
    histConf: 'विश्वास',
    logWelcomeIn: 'वापसी पर स्वागत है',
    logWelcomeUp: 'एक खाता बनाएं',
    logSubIn: 'अपने डैशबोर्ड तक पहुंचने के लिए अपना विवरण दर्ज करें।',
    logSubUp: 'आज ही अपनी फसलों का विश्लेषण शुरू करें।',
    logEmail: 'ईमेल पता',
    logPass: 'पासवर्ड',
    logBtnIn: 'साइन इन करें',
    logBtnUp: 'साइन अप करें',
    logToggleIn: 'एक खाता बनाएं',
    logToggleUp: 'इसके बजाय साइन इन करें',
    resUnavTitle: 'निदान अनुपलब्ध',
    resUnavDesc: 'यह निदान लोड नहीं किया जा सका। छवि अस्पष्ट हो सकती है या विश्लेषण का समय समाप्त हो गया।',
    resTryAgain: 'पुनः प्रयास करें',
    resNew: 'नया निदान',
    resComplete: 'निदान पूर्ण'
  },
  bn: {
    navHistory: 'ইতিহাস',
    navLocalDetails: 'স্থানীয় বিবরণ',
    navNewDiagnosis: 'নতুন রোগ নির্ণয়',
    navSignIn: 'সাইন ইন',
    navSignOut: 'সাইন আউট',
    heroTagline: 'AI ভিশন দ্বারা চালিত',
    heroTitle1: 'জানুন কী সমস্যা আছে',
    heroTitle2: 'আপনার ফসলে।',
    heroDescription: 'একটি ছবি আপলোড করুন এবং উদ্ভিদ ও ফসল রোগবিদ্যা গবেষণার ভিত্তিতে AI রোগ নির্ণয় পান — ৩০ সেকেন্ডের মধ্যে।',
    heroCta: 'রোগ নির্ণয় শুরু করুন',
    heroCtaSub: 'স্থানীয় বিবরণ',
    heroResearch: 'পিয়ার-রিভিউড উদ্ভিদ ও ফসল রোগবিদ্যা গবেষণার ভিত্তিতে চিকিৎসার নির্দেশনা',
    howTitle: 'এটি কীভাবে কাজ করে',
    step1: 'আক্রান্ত এলাকার ক্লোজ-আপ ছবি তুলুন',
    step2: 'আপলোড করুন — ড্র্যাগ & ড্রপ বা ব্রাউজ করুন',
    step3: 'আস্থা স্কোর ও চিকিৎসা পরিকল্পনাসহ সম্পূর্ণ রোগ নির্ণয় পান',
    whyTitle: 'কেন CropCure',
    whyHeading: 'নির্ভুলতার জন্য তৈরি, প্রভাবশালিতার জন্য নয়',
    feat1Label: 'AI ভিশন',
    feat1Title: 'দেখুন আপনার ফসল কী বলছে',
    feat1Desc: 'AI দৃশ্যমান লক্ষণগুলি ঠিক যেভাবে একজন উদ্ভিদ ও ফসল রোগবিদ পড়েন সেভাবে পড়ে।',
    feat2Label: 'সৎ আস্থা',
    feat2Title: 'বাস্তব জগতের জন্য ক্যালিব্রেটেড',
    feat2Desc: 'স্কোরগুলি প্রকৃত মাঠের নির্ভুলতা প্রতিফলিত করে — স্ফীত ল্যাব বেঞ্চমার্ক নয়।',
    feat3Label: 'গবেষণা-সমর্থিত',
    feat3Title: 'সাহিত্য থেকে চিকিৎসা',
    feat3Desc: 'প্রতিটি সুপারিশ পিয়ার-রিভিউড গবেষণায় ফিরে যায় — বাগান ফোরামে নয়।',
    localLabel: 'আপনার অবস্থান',
    localHeading: 'স্থানীয় কৃষি বুদ্ধিমত্তা',
    localDesc: 'রিয়েল-টাইম আবহাওয়া, মাটির স্বাস্থ্যের অনুমান এবং আজকের ফসলের বাজার মূল্য।',
    chatGreeting: 'নমস্কার! আমি **CropCure AI** 🌱 — আপনার কৃষি বিশেষজ্ঞ সহকারী। ফসল, উদ্ভিদ রোগ, কীটপতঙ্গ, বা চাষের কৌশল সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন!',
    chatPlaceholder: 'ফসল, গাছপালা, আবহাওয়া সম্পর্কে জিজ্ঞাসা করুন…',
    chatPowered: 'CropCure AI দ্বারা চালিত · পাঠাতে Enter চাপুন',
    chatSubtitle: 'ফসল · উদ্ভিদ · আবহাওয়া বিশেষজ্ঞ',
    footer: '© 2026 CropCure',
    upSubtitle: 'ফসল নির্ণয়',
    upTitle: 'আপনার গাছের ছবি আপলোড করুন',
    upDesc: '৩০ সেকেন্ডের মধ্যে চিকিৎসার পদক্ষেপ সহ সম্পূর্ণ AI নির্ণয় পান।',
    upAnalyze: 'ফসল বিশ্লেষণ করুন',
    upAnalyzing: 'বিশ্লেষণ করা হচ্ছে…',
    histLabel: 'আপনার রেকর্ড',
    histTitle: 'রোগ নির্ণয়ের ইতিহাস',
    histResults: 'ফলাফল',
    histEmptyTitle: 'এখনও কোনো রোগ নির্ণয় নেই',
    histEmptyDesc: 'আপনার প্রথম গাছের রোগ নির্ণয় পেতে একটি ছবি আপলোড করুন।',
    histBtn: 'রোগ নির্ণয় শুরু করুন',
    histLoading: 'আপনার ইতিহাস লোড হচ্ছে...',
    histConf: 'আস্থা',
    logWelcomeIn: 'পুনরায় স্বাগতম',
    logWelcomeUp: 'একটি অ্যাকাউন্ট তৈরি করুন',
    logSubIn: 'আপনার ড্যাশবোর্ড অ্যাক্সেস করতে আপনার বিবরণ লিখুন।',
    logSubUp: 'আজই আপনার ফসল বিশ্লেষণ শুরু করুন।',
    logEmail: 'ইমেইল ঠিকানা',
    logPass: 'পাসওয়ার্ড',
    logBtnIn: 'সাইন ইন করুন',
    logBtnUp: 'সাইন আপ করুন',
    logToggleIn: 'একটি অ্যাকাউন্ট তৈরি করুন',
    logToggleUp: 'পরিবর্তে সাইন ইন করুন',
    resUnavTitle: 'রোগ নির্ণয় অনুপলব্ধ',
    resUnavDesc: 'এই রোগ নির্ণয় লোড করা যায়নি। ছবিটি অস্পষ্ট হতে পারে বা বিশ্লেষণের সময় শেষ হয়ে গেছে।',
    resTryAgain: 'আবার চেষ্টা করুন',
    resNew: 'নতুন নির্ণয়',
    resComplete: 'রোগ নির্ণয় সম্পূর্ণ'
  },
  ta: {
    navHistory: 'வரலாறு',
    navLocalDetails: 'உள்ளூர் விவரங்கள்',
    navNewDiagnosis: 'புதிய நோயறிதல்',
    navSignIn: 'உள் நுழை',
    navSignOut: 'வெளியேறு',
    heroTagline: 'AI பார்வையால் இயக்கப்படுகிறது',
    heroTitle1: 'என்ன தவறு என்று தெரிந்துகொள்ளுங்கள்',
    heroTitle2: 'உங்கள் பயிரில்.',
    heroDescription: 'ஒரு புகைப்படத்தை பதிவேற்றி, தாவர மற்றும் பயிர் நோயியல் ஆராய்ச்சியில் வேரூன்றிய AI நோயறிதல் பெறுங்கள் — 30 வினாடிகளுக்குள்.',
    heroCta: 'நோயறிதல் தொடங்கு',
    heroCtaSub: 'உள்ளூர் விவரங்கள்',
    heroResearch: 'சக-மதிப்பாய்வு செய்யப்பட்ட தாவர மற்றும் பயிர் நோயியல் ஆராய்ச்சியால் தகவல் அளிக்கப்பட்ட சிகிச்சை வழிகாட்டுதல்',
    howTitle: 'இது எப்படி செயல்படுகிறது',
    step1: 'பாதிக்கப்பட்ட பகுதியின் நெருங்கிய புகைப்படம் எடுக்கவும்',
    step2: 'அதை பதிவேற்றவும் — இழுத்து விடவும் அல்லது உலாவவும்',
    step3: 'நம்பிக்கை மதிப்பெண் மற்றும் சிகிச்சை திட்டத்துடன் முழு நோயறிதல் பெறவும்',
    whyTitle: 'ஏன் CropCure',
    whyHeading: 'துல்லியத்திற்காக கட்டப்பட்டது, ஈர்ப்பிற்காக அல்ல',
    feat1Label: 'AI பார்வை',
    feat1Title: 'உங்கள் பயிர் என்ன சொல்கிறது என்று பாருங்கள்',
    feat1Desc: 'AI காட்சி அறிகுறிகளை தாவர நோயியல் நிபுணர் படிப்பது போல் படிக்கிறது.',
    feat2Label: 'நேர்மையான நம்பிக்கை',
    feat2Title: 'உண்மை உலகிற்கு நடத்துதல்',
    feat2Desc: 'மதிப்பெண்கள் உண்மையான களத் துல்லியத்தை பிரதிபலிக்கின்றன — உப்பிய ஆய்வக அளவுகோல்களை அல்ல.',
    feat3Label: 'ஆராய்ச்சி-ஆதரவு',
    feat3Title: 'இலக்கியத்திலிருந்து சிகிச்சை',
    feat3Desc: 'ஒவ்வொரு பரிந்துரையும் சக-மதிப்பாய்வு ஆராய்ச்சியை திரும்பி சுட்டுகிறது.',
    localLabel: 'உங்கள் இடம்',
    localHeading: 'உள்ளூர் விவசாய நுண்ணறிவு',
    localDesc: 'நேரடி வானிலை, மண் ஆரோக்கிய மதிப்பீடுகள், மற்றும் இன்றைய பயிர் சந்தை விலைகள்.',
    chatGreeting: 'வணக்கம்! நான் **CropCure AI** 🌱 — உங்கள் வேளாண் நிபுணர் உதவியாளர். பயிர்கள், தாவர நோய்கள், பூச்சிகள் அல்லது விவசாய நுட்பங்கள் பற்றி எதையும் கேளுங்கள்!',
    chatPlaceholder: 'பயிர்கள், தாவரங்கள், வானிலை பற்றி கேளுங்கள்…',
    chatPowered: 'CropCure AI இயக்குகிறது · அனுப்ப Enter அழுத்தவும்',
    chatSubtitle: 'பயிர் · தாவரம் · வானிலை நிபுணர்',
    footer: '© 2026 CropCure',
    upSubtitle: 'பயிர் நோயறிதல்',
    upTitle: 'தாவர புகைப்படத்தை பதிவேற்றவும்',
    upDesc: 'சிகிச்சை நடவடிக்கைகளுடன் முழுமையான AI நோயறிதலை 30 விநாடிகளுக்குள் பெறுங்கள்.',
    upAnalyze: 'பயிரை பகுப்பாய்வு செய்',
    upAnalyzing: 'பகுப்பாய்வு செய்கிறது…',
    histLabel: 'உங்கள் பதிவுகள்',
    histTitle: 'நோயறிதல் வரலாறு',
    histResults: 'முடிவுகள்',
    histEmptyTitle: 'இதுவரை எந்த நோயறிதலும் இல்லை',
    histEmptyDesc: 'உங்கள் முதல் தாவர நோயறிதலைப் பெற புகைப்படத்தை பதிவேற்றவும்.',
    histBtn: 'நோயறிதல் தொடங்கு',
    histLoading: 'வரலாற்றை ஏற்றுகிறது...',
    histConf: 'நம்பிக்கை',
    logWelcomeIn: 'மீண்டும் வருக',
    logWelcomeUp: 'கணக்கை உருவாக்கவும்',
    logSubIn: 'கட்டுப்பாட்டகத்திற்கு செல்ல விவரங்களை உள்ளிடவும்.',
    logSubUp: 'இன்றே பயிர்களை பகுப்பாய்வு செய்யத் தொடங்குங்கள்.',
    logEmail: 'மின்னஞ்சல் முகவரி',
    logPass: 'கடவுச்சொல்',
    logBtnIn: 'உள்நுழைய',
    logBtnUp: 'பதிவு செய்ய',
    logToggleIn: 'கணக்கை உருவாக்கவும்',
    logToggleUp: 'பதிலாக உள்நுழையவும்',
    resUnavTitle: 'நோயறிதல் கிடைக்கவில்லை',
    resUnavDesc: 'இந்த நோயறிதலை ஏற்ற முடியவில்லை. படம் தெளிவாக இல்லாமல் இருக்கலாம் அல்லது பகுப்பாய்வு நேரம் முடிந்துவிட்டது.',
    resTryAgain: 'மீண்டும் முயற்சிக்கவும்',
    resNew: 'புதிய நோயறிதல்',
    resComplete: 'நோயறிதல் முடிந்தது'
  },
  te: {
    navHistory: 'చరిత్ర',
    navLocalDetails: 'స్థానిక వివరాలు',
    navNewDiagnosis: 'కొత్త వ్యాధి నిర్ధారణ',
    navSignIn: 'సైన్ ఇన్',
    navSignOut: 'సైన్ అవుట్',
    heroTagline: 'AI విజన్ ద్వారా నడపబడుతోంది',
    heroTitle1: 'ఏమి తప్పు అయిందో తెలుసుకోండి',
    heroTitle2: 'మీ పంటతో.',
    heroDescription: 'ఒక ఫోటో అప్‌లోడ్ చేయండి మరియు మొక్క & పంట రోగశాస్త్ర పరిశోధనలో ఆధారపడిన AI వ్యాధి నిర్ధారణ పొందండి — 30 సెకండ్లలో.',
    heroCta: 'నిర్ధారణ ప్రారంభించండి',
    heroCtaSub: 'స్థానిక వివరాలు',
    heroResearch: 'సహ-సమీక్షించిన మొక్క & పంట రోగశాస్త్ర పరిశోధన ద్వారా చికిత్స మార్గదర్శకత్వం',
    howTitle: 'ఇది ఎలా పని చేస్తుందో',
    step1: 'ప్రభావిత ప్రాంతం యొక్క క్లోజ్-అప్ ఫోటో తీయండి',
    step2: 'దాన్ని అప్‌లోడ్ చేయండి — డ్రాగ్ & డ్రాప్ లేదా బ్రౌజ్ చేయండి',
    step3: 'నమ్మకం స్కోర్ మరియు చికిత్స ప్రణాళికతో పూర్తి వ్యాధి నిర్ధారణ పొందండి',
    whyTitle: 'ఎందుకు CropCure',
    whyHeading: 'ఖచ్చితత్వం కోసం నిర్మించబడింది, ఆకట్టుకోవడానికి కాదు',
    feat1Label: 'AI విజన్',
    feat1Title: 'మీ పంట ఏమి చెప్తుందో చూడండి',
    feat1Desc: 'AI దృశ్య లక్షణాలను మొక్క రోగవిజ్ఞాన నిపుణుడు చదివే విధంగా చదువుతుంది.',
    feat2Label: 'నిజాయితీ నమ్మకం',
    feat2Title: 'వాస్తవ ప్రపంచానికి అనుకూలంగా',
    feat2Desc: 'స్కోర్లు నిజమైన క్షేత్ర ఖచ్చితత్వాన్ని ప్రతిబింబిస్తాయి — ఉప్పిన ల్యాబ్ బెంచ్‌మార్క్‌లు కాదు.',
    feat3Label: 'పరిశోధన-ఆధారిత',
    feat3Title: 'సాహిత్యం నుండి చికిత్స',
    feat3Desc: 'ప్రతి సిఫారసు సహ-సమీక్షించిన పరిశోధనకు తిరిగి వెళ్తుంది.',
    localLabel: 'మీ స్థానం',
    localHeading: 'స్థానిక వ్యవసాయ మేధస్సు',
    localDesc: 'రీయల్-టైమ్ వాతావరణం, నేల ఆరోగ్య అంచనాలు, మరియు నేటి పంట మార్కెట్ ధరలు.',
    chatGreeting: 'నమస్కారం! నేను **CropCure AI** 🌱 — మీ వ్యవసాయ నిపుణ సహాయకుడు. పంటలు, మొక్కల వ్యాధులు, కీటకాలు, వాతావరణ ప్రభావం లేదా సేద్య పద్ధతుల గురించి ఏమైనా అడగండి!',
    chatPlaceholder: 'పంటలు, మొక్కలు, వాతావరణం గురించి అడగండి…',
    chatPowered: 'CropCure AI ద్వారా నడపబడుతోంది · పంపడానికి Enter నొక్కండి',
    chatSubtitle: 'పంట · మొక్క · వాతావరణ నిపుణుడు',
    footer: '© 2026 CropCure',
    upSubtitle: 'పంట నిర్ధారణ',
    upTitle: 'మీ మొక్క ఫోటోను అప్‌లోడ్ చేయండి',
    upDesc: '30 సెకన్లలోపు చికిత్స దశలతో పూర్తి AI రోగ నిర్ధారణను పొందండి.',
    upAnalyze: 'పంటను విశ్లేషించండి',
    upAnalyzing: 'విశ్లేషిస్తోంది…',
    histLabel: 'మీ రికార్డులు',
    histTitle: 'వ్యాధి నిర్ధారణ చరిత్ర',
    histResults: 'ఫలితాలు',
    histEmptyTitle: 'ఇంకా నిర్ధారణలు లేవు',
    histEmptyDesc: 'మీ మొదటి మొక్క రోగ నిర్ధారణను పొందడానికి ఫోటోను అప్‌లోడ్ చేయండి.',
    histBtn: 'నిర్ధారణ ప్రారంభించండి',
    histLoading: 'చరిత్రను లోడ్ చేస్తోంది...',
    histConf: 'నమ్మకం',
    logWelcomeIn: 'మళ్ళీ స్వాగతం',
    logWelcomeUp: 'ఖాతాను సృష్టించండి',
    logSubIn: 'మీ డ్యాష్‌బోర్డ్‌ను యాక్సెస్ చేయడానికి మీ వివరాలను నమోదు చేయండి.',
    logSubUp: 'ఈ రోజే మీ పంటలను విశ్లేషించడం ప్రారంభించండి.',
    logEmail: 'ఈమెయిల్ చిరునామా',
    logPass: 'పాస్‌వర్డ్',
    logBtnIn: 'సైన్ ఇన్ చేయండి',
    logBtnUp: 'సైన్ అప్ చేయండి',
    logToggleIn: 'ఖాతాను సృష్టించండి',
    logToggleUp: 'బదులుగా సైన్ ఇన్ చేయండి',
    resUnavTitle: 'వ్యాధి నిర్ధారణ అందుబాటులో లేదు',
    resUnavDesc: 'ఈ వ్యాధి నిర్ధారణను లోడ్ చేయడం సాధ్యం కాలేదు. చిత్రం అస్పష్టంగా ఉండవచ్చు లేదా విశ్లేషణ సమయం ముగిసి ఉండవచ్చు.',
    resTryAgain: 'మళ్ళీ ప్రయత్నించండి',
    resNew: 'కొత్త వ్యాధి నిర్ధారణ',
    resComplete: 'వ్యాధి నిర్ధారణ పూర్తయింది'
  },
  ml: {
    navHistory: 'ചരിത്രം',
    navLocalDetails: 'പ്രാദേശിക വിവരങ്ങൾ',
    navNewDiagnosis: 'പുതിയ രോഗനിർണ്ണയം',
    navSignIn: 'സൈൻ ഇൻ',
    navSignOut: 'സൈൻ ഔട്ട്',
    heroTagline: 'AI ദർശനം പ്രവർത്തിപ്പിക്കുന്നു',
    heroTitle1: 'എന്ത് തകരാറാണെന്ന് അറിയൂ',
    heroTitle2: 'നിങ്ങളുടെ വിളയിൽ.',
    heroDescription: 'ഒരു ഫോട്ടോ അപ്‌ലോഡ് ചെയ്ത് സസ്യ & വിള രോഗശാസ്ത്ര ഗവേഷണത്തിൽ അധിഷ്ഠിതമായ AI രോഗനിർണ്ണയം നേടൂ — 30 സെക്കൻഡിനുള്ളിൽ.',
    heroCta: 'രോഗനിർണ്ണയം ആരംഭിക്കൂ',
    heroCtaSub: 'പ്രാദേശിക വിവരങ്ങൾ',
    heroResearch: 'സഹ-അവലോകനം ചെയ്ത സസ്യ & വിള രോഗശാസ്ത്ര ഗവേഷണത്തിൽ നിന്നുള്ള ചികിൽസ മാർഗ്ഗനിർദ്ദേശം',
    howTitle: 'ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു',
    step1: 'ബാധിക്കപ്പെട്ട ഭാഗത്തിന്റെ ക്ലോസ്-അപ്പ് ഫോട്ടോ എടുക്കൂ',
    step2: 'അത് അപ്‌ലോഡ് ചെയ്യൂ — ഡ്രാഗ് & ഡ്രോപ്പ് ചെയ്യൂ അല്ലെങ്കിൽ ബ്രൗസ് ചെയ്യൂ',
    step3: 'ആത്മവിശ്വാസ സ്കോറും ചികിൽസ പദ്ധതിയും സഹിതം പൂർണ്ണ രോഗനിർണ്ണയം നേടൂ',
    whyTitle: 'എന്തുകൊണ്ട് CropCure',
    whyHeading: 'കൃത്യതയ്ക്കായി നിർമ്മിച്ചത്, ആകർഷണത്തിനല്ല',
    feat1Label: 'AI ദർശനം',
    feat1Title: 'നിങ്ങളുടെ വിള എന്ത് പറയുന്നു',
    feat1Desc: 'AI ദൃശ്യ ലക്ഷണങ്ങൾ ഒരു സസ്യ രോഗശാസ്ത്രജ്ഞൻ വായിക്കുന്നതുപോലെ വായിക്കുന്നു.',
    feat2Label: 'സത്യസന്ധമായ ആത്മവിശ്വാസം',
    feat2Title: 'യഥാർത്ഥ ലോകത്തിനനുസരിച്ച്',
    feat2Desc: 'സ്കോറുകൾ യഥാർത്ഥ ഫീൽഡ് കൃത്യതയെ പ്രതിഫലിപ്പിക്കുന്നു — ലാബ് ബെഞ്ച്‌മാർക്കുകളല്ല.',
    feat3Label: 'ഗവേഷണ-ആധാരിത',
    feat3Title: 'സാഹിത്യത്തിൽ നിന്നുള്ള ചികിൽസ',
    feat3Desc: 'ഓരോ ശുപാർശയും സഹ-അവലോകനം ചെയ്ത ഗവേഷണത്തിലേക്ക് തിരിച്ചു പോകുന്നു.',
    localLabel: 'നിങ്ങളുടെ സ്ഥാനം',
    localHeading: 'പ്രാദേശിക കൃഷി ബുദ്ധി',
    localDesc: 'തത്സമയ കാലാവസ്ഥ, മണ്ണ് ആരോഗ്യ കണക്കുകൾ, ഇന്നത്തെ വിള വിപണി വിലകൾ.',
    chatGreeting: 'നമസ്കാരം! ഞാൻ **CropCure AI** 🌱 — നിങ്ങളുടെ കൃഷി വിദഗ്ദ്ധ സഹായി. വിളകൾ, സസ്യ രോഗങ്ങൾ, കീടങ്ങൾ, കാലാവസ്ഥ ആഘാതം, അല്ലെങ്കിൽ കൃഷി സാങ്കേതിക വിദ്യകൾ എന്തിനെക്കുറിച്ചും ചോദിക്കൂ!',
    chatPlaceholder: 'വിളകൾ, സസ്യങ്ങൾ, കാലാവസ്ഥ എന്നിവയെക്കുറിച്ച് ചോദിക്കൂ…',
    chatPowered: 'CropCure AI പ്രവർത്തിപ്പിക്കുന്നു · അയക്കാൻ Enter അമർത്തൂ',
    chatSubtitle: 'വിള · സസ്യം · കാലാവസ്ഥ വിദഗ്ദ്ധൻ',
    footer: '© 2026 CropCure',
    upSubtitle: 'വിള രോഗനിർണ്ണയം',
    upTitle: 'നിങ്ങളുടെ സസ്യത്തിന്റെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക',
    upDesc: '30 സെക്കൻഡിനുള്ളിൽ ചികിത്സാ ഘട്ടങ്ങളോടുകൂടിയ പൂർണ്ണമായ AI രോഗനിർണ്ണയം നേടുക.',
    upAnalyze: 'വിള വിശകലനം ചെയ്യുക',
    upAnalyzing: 'വിശകലനം ചെയ്യുന്നു…',
    histLabel: 'നിങ്ങളുടെ രേഖകൾ',
    histTitle: 'രോഗനിർണ്ണയ ചരിത്രം',
    histResults: 'ഫലങ്ങൾ',
    histEmptyTitle: 'ഇതുവരെ രോഗനിർണ്ണയങ്ങളില്ല',
    histEmptyDesc: 'നിങ്ങളുടെ ആദ്യ സസ്യ രോഗനിർണ്ണയം നേടുന്നതിന് ഒരു ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.',
    histBtn: 'രോഗനിർണ്ണയം ആരംഭിക്കുക',
    histLoading: 'നിങ്ങളുടെ ചരിത്രം ലോഡുചെയ്യുന്നു...',
    histConf: 'ആത്മവിശ്വാസം',
    logWelcomeIn: 'തിരികെ സ്വാഗതം',
    logWelcomeUp: 'ഒരു അക്കൗണ്ട് സൃഷ്ടിക്കുക',
    logSubIn: 'നിങ്ങളുടെ ഡാഷ്‌ബോർഡ് ആക്‌സസ് ചെയ്യാൻ നിങ്ങളുടെ വിവരങ്ങൾ നൽകുക.',
    logSubUp: 'ഇന്ന് നിങ്ങളുടെ വിളകൾ വിശകലനം ചെയ്യാൻ തുടങ്ങുക.',
    logEmail: 'ഇമെയിൽ വിലാസം',
    logPass: 'പാസ്‌വേഡ്',
    logBtnIn: 'സൈൻ ഇൻ ചെയ്യുക',
    logBtnUp: 'സൈൻ അപ്പ് ചെയ്യുക',
    logToggleIn: 'ഒരു അക്കൗണ്ട് സൃഷ്ടിക്കുക',
    logToggleUp: 'പകരം സൈൻ ഇൻ ചെയ്യുക',
    resUnavTitle: 'രോഗനിർണ്ണയം ലഭ്യമല്ല',
    resUnavDesc: 'ഈ രോഗനിർണ്ണയം ലോഡുചെയ്യാനായില്ല. ചിത്രം അവ്യക്തമായിരിക്കാം അല്ലെങ്കിൽ വിശകലന സമയം കഴിഞ്ഞിരിക്കാം.',
    resTryAgain: 'വീണ്ടും ശ്രമിക്കുക',
    resNew: 'പുതിയ രോഗനിർണ്ണയം',
    resComplete: 'രോഗനിർണ്ണയം പൂർത്തിയായി'
  },
}

// ─── Context ─────────────────────────────────────────────────────────────────
interface LanguageCtx {
  lang: LangCode
  setLang: (l: LangCode) => void
  t: Translations
}

const LanguageContext = createContext<LanguageCtx>({
  lang: 'en',
  setLang: () => {},
  t: ALL_TRANSLATIONS.en,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('en')
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('cropcure-lang') as LangCode | null
    if (saved && ALL_TRANSLATIONS[saved]) setLangState(saved)
  }, [])

  const setLang = (l: LangCode) => {
    setTransitioning(true)
    setTimeout(() => {
      setLangState(l)
      localStorage.setItem('cropcure-lang', l)
      setTransitioning(false)
    }, 180)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: ALL_TRANSLATIONS[lang] }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={lang}
          initial={{ opacity: 0, y: transitioning ? 6 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          style={{ minHeight: '100%' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
