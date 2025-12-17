import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Newsletter subscribed!");
    setEmail(""); // optional: clear the input
  };

  return (
    <footer className="bg-[#2d2d2d] text-white mt-12">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="font-bold text-lg mb-4">{t("footer.companyTitle")}</h3>
          <p className="text-sm text-[#cfcfcf]">{t("footer.companyDesc")}</p>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="font-bold text-lg mb-4">{t("footer.shopTitle")}</h3>
          <ul className="space-y-2 text-sm text-[#cfcfcf]">
            <li>{t("footer.shop.home")}</li>
            <li>{t("footer.shop.marketplace")}</li>
            <li>{t("footer.shop.featured")}</li>
            <li>{t("footer.shop.categories")}</li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="font-bold text-lg mb-4">{t("footer.supportTitle")}</h3>
          <ul className="space-y-2 text-sm text-[#cfcfcf]">
            <li>{t("footer.support.contact")}</li>
            <li>{t("footer.support.faq")}</li>
            <li>{t("footer.support.returns")}</li>
            <li>{t("footer.support.shipping")}</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-bold text-lg mb-4">
            {t("footer.newsletterTitle")}
          </h3>
          <p className="text-sm text-[#cfcfcf] mb-4">
            {t("footer.newsletterDesc")}
          </p>
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder={t("footer.newsletterPlaceholder")}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[#c9945c] hover:bg-[#b88650] px-4 py-2 rounded-lg text-white"
            >
              {t("footer.subscribe")}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-[#1f1f1f] text-[#9b9b9b] text-sm py-4 text-center">
        © {new Date().getFullYear()} {t("footer.rights")}
      </div>
    </footer>
  );
}
