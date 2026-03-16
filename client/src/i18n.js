import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          hero_title: "Civic Services.",
          hero_subtitle: "Without the Wait.",
          hero_desc: "QueueLess is the smart, seamless way to manage your civic and municipal needs. Book tokens, track your status, and resolve issues—all in one place.",
          join_btn: "Get Started",
          signin_btn: "Sign In",
          nav_dashboard: "Dashboard",
          nav_logout: "Log Out"
        }
      },
      ta: {
        translation: {
          hero_title: "குடிமக்கள் சேவைகள்.",
          hero_subtitle: "காத்திருப்பு இன்றி.",
          hero_desc: "உங்கள் குடிமக்கள் மற்றும் நகராட்சி தேவைகளை நிர்வகிக்க க்யூலெஸ் ஒரு ஸ்மார்ட், தடையற்ற வழியாகும். டோக்கன்களை முன்பதிவு செய்யுங்கள் மற்றும் நிலையை கண்காணிக்கவும்.",
          join_btn: "தொடங்கவும்",
          signin_btn: "உள்நுழைக",
          nav_dashboard: "முகப்பு",
          nav_logout: "வெளியேறு"
        }
      },
      hi: {
        translation: {
          hero_title: "नागरिक सेवाएं।",
          hero_subtitle: "बिना प्रतीक्षा के।",
          hero_desc: "क्यूलेस आपकी नागरिक और नगरपालिका आवश्यकताओं को प्रबंधित करने का स्मार्ट, सहज तरीका है। टोकन बुक करें और स्थिति ट्रैक करें।",
          join_btn: "शुरू करें",
          signin_btn: "साइन इन करें",
          nav_dashboard: "डैशबोर्ड",
          nav_logout: "लॉग आउट"
        }
      },
      te: {
        translation: {
          hero_title: "పౌర సేవలు.",
          hero_subtitle: "నిరీక్షణ లేకుండా.",
          hero_desc: "మీ పౌర మరియు మునిసిపల్ అవసరాలను నిర్వహించడానికి క్యూలెస్ ఒక స్మార్ట్ మార్గం. టోకెన్లను బుక్ చేయండి మరియు స్థితిని ట్రాక్ చేయండి.",
          join_btn: "ప్రారంభించండి",
          signin_btn: "సైన్ ఇన్ చేయండి",
          nav_dashboard: "డాష్‌బోర్డ్",
          nav_logout: "లాగ్ అవుట్"
        }
      },
      ml: {
        translation: {
          hero_title: "പൗര സേവനങ്ങൾ.",
          hero_subtitle: "കാത്തിരിപ്പില്ലാതെ.",
          hero_desc: "നിങ്ങളുടെ പൗര, മുനിസിപ്പൽ ആവശ്യങ്ങൾ കൈകാര്യം ചെയ്യുന്നതിനുള്ള സ്മാർട്ട് മാർഗമാണ് ക്യൂലെസ്. ടോക്കണുകൾ ബുക്ക് ചെയ്ത് സ്റ്റാറ്റസ് ട്രാക്ക് ചെയ്യുക.",
          join_btn: "ആരംഭിക്കുക",
          signin_btn: "സൈൻ ഇൻ ചെയ്യുക",
          nav_dashboard: "ഡാഷ്‌ബോർഡ്",
          nav_logout: "ലോഗ് ഔട്ട്"
        }
      }
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
