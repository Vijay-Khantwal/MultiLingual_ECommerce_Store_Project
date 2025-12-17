import { Globe } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export default function LanguageSelect() {
  const { lang, changeLanguage } = useAuth();

  return (
    <div className="relative flex items-center gap-2">
      <Globe className="w-4 h-4 text-[#6b6b6b]" />

      <select
        value={lang}
        onChange={(e) => changeLanguage(e.target.value)}
        className="
          appearance-none
          bg-[#f5f1ed]
          border border-[#c9b5a0]
          rounded-xl
          px-4 py-2
          pr-9
          text-sm
          text-[#3d3d3d]
          shadow-sm
          transition
          hover:border-[#c9945c]
          focus:outline-none
          focus:ring-2
          focus:ring-[#c9945c]
          focus:border-[#c9945c]
        "
      >
        <option value="english">English</option>
        <option value="hindi">हिंदी (Hindi)</option>
        <option value="punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
        <option value="gujarati">ગુજરાતી (Gujarati)</option>
        <option value="tamil">தமிழ் (Tamil)</option>
        <option value="telugu">తెలుగు (Telugu)</option>
        <option value="bhojpuri">भोजपुरी (Bhojpuri)</option>
        <option value="malyalam">മലയാളം (Malayalam)</option>
        <option value="marathi">मराठी (Marathi)</option>
        <option value="urdu">اردو (Urdu)</option>
        <option value="bengali">বাংলা (Bengali)</option>
      </select>

      {/* Custom dropdown arrow */}
      <span className="pointer-events-none absolute right-3 text-[#6b6b6b] text-xs">
        ▼
      </span>
    </div>
  );
}
