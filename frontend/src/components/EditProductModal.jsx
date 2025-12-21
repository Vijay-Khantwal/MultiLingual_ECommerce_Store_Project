import toast from "react-hot-toast";
import { updateProduct } from "../api/product_api";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const EditProductModal = ({ product, onClose, onUpdated }) => {
  const { t } = useTranslation();
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (price <= 0 || stock < 0) {
      toast.error(t("errors.invalidPriceStock"));
      return;
    }

    try {
      setLoading(true);
      await updateProduct(product._id, { price, stock });
      toast.success(t("seller.productUpdated"));
      onClose();
      onUpdated();
    } catch {
      toast.error(t("errors.updateFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6">
        <h3 className="text-lg font-semibold text-[#2d2d2d] mb-4">
          {t("seller.editProduct")}
        </h3>

        {/* PRELOADED (READ-ONLY) */}
        <div className="mb-3">
          <label className="text-sm text-[#6b6b6b]">
            {t("common.name")}
          </label>
          <input
            disabled
            value={product.name}
            className="w-full border rounded-xl px-3 py-2 bg-[#f5f1ed]"
          />
        </div>

        {/* PRICE */}
        <div className="mb-3">
          <label className="text-sm">{t("common.price")}</label>
          <input
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full border rounded-xl px-3 py-2"
          />
        </div>

        {/* STOCK */}
        <div className="mb-5">
          <label className="text-sm">{t("seller.stock")}</label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full border rounded-xl px-3 py-2"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border"
          >
            {t("common.cancel")}
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-[#c9945c] hover:bg-[#b88650] text-white"
          >
            {loading ? t("common.loading") : t("common.save")}
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditProductModal;