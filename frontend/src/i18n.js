import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import gu from "./locales/gu.json";
import bh from "./locales/bh.json";
import ml from "./locales/ml.json";
import te from "./locales/te.json";
import ta from "./locales/ta.json";
import mr from "./locales/mr.json";
import ur from "./locales/ur.json";
import bn from "./locales/bn.json";
import pa from "./locales/pa.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    gu: { translation: gu },
    bh: { translation: bh },
    ml: { translation: ml },
    te: { translation: te },
    ta: { translation: ta },
    mr: { translation: mr },
    ur: { translation: ur },
    bn: { translation: bn },
    pa: { translation: pa },
  },
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
