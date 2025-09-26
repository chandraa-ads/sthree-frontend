import React, { useState } from "react";
import logo from "../../assets/icon/home.svg"; // ✅ Logo path

interface KeyValue {
  key: string;
  value: string;
}

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    mainCategory: "",
    subCategory: "",
    brand: "",
    size: [] as string[],
    image: null as File | null,
  });

  const [details, setDetails] = useState<KeyValue[]>([
    { key: "Care instructions", value: "Hand Wash Only" },
    { key: "Origin", value: "Made in the USA" },
  ]);

  const [aboutItems, setAboutItems] = useState<KeyValue[]>([
    { key: "", value: "" },
  ]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ✅ Handle size checkboxes
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newSize = checked
        ? [...prev.size, value]
        : prev.size.filter((s) => s !== value);
      return { ...prev, size: newSize };
    });
  };

  // ✅ Handle details
  const handleDetailChange = (
    index: number,
    field: "key" | "value",
    newValue: string
  ) => {
    const newDetails = [...details];
    newDetails[index][field] = newValue;
    setDetails(newDetails);
  };

  const handleAddDetail = () => {
    setDetails([...details, { key: "", value: "" }]);
  };

  const handleRemoveDetail = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  // ✅ Handle About Item (Key-Value)
  const handleAboutChange = (
    index: number,
    field: "key" | "value",
    newValue: string
  ) => {
    const updated = [...aboutItems];
    updated[index][field] = newValue;
    setAboutItems(updated);
  };

  const handleAddAbout = () => {
    setAboutItems([...aboutItems, { key: "", value: "" }]);
  };

  const handleRemoveAbout = (index: number) => {
    setAboutItems(aboutItems.filter((_, i) => i !== index));
  };

  // ✅ JSON preview
  const detailJSON = details.reduce<Record<string, string>>((acc, row) => {
    if (row.key.trim()) acc[row.key.trim()] = row.value.trim();
    return acc;
  }, {});

  const aboutJSON = aboutItems
    .filter((row) => row.key.trim() && row.value.trim())
    .map((row) => ({ [row.key.trim()]: row.value.trim() }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      details: detailJSON,
      about_item: aboutJSON,
    };
    console.log("Form Data Submitted ✅", finalData);
  };

  return (
     <div className="flex flex-col items-center p-8 bg-gray-50 bg-gradient-to-b from-rose-50 to-white min-h-screen">
      {/* Logo Section */}
      <div className="text-center mb-6">
        <img src={logo} alt="SthRee Logo" className="h-24 mx-auto" />
        <p className="font-bold mt-2 text-lg text-gray-700">
          Outfit Speaks Person
        </p>
      </div>

      {/* Right Form */}
      <div className="flex-2 flex justify-center items-center p-6 w-full md:w-2/3">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md border border-gray-200 rounded-2xl p-6 w-full max-w-lg"
        >
          <h2 className="text-center text-lg font-bold mb-5">ADD PRODUCT</h2>

          {/* Inputs */}
          <div className="space-y-4">
            {[
              { icon: "👤", type: "text", name: "name", placeholder: "P.Name" },
              { icon: "💰", type: "number", name: "price", placeholder: "P.Price" },
              { icon: "📊", type: "number", name: "stock", placeholder: "P.Stock" },
              { icon: "🔽", type: "text", name: "mainCategory", placeholder: "P.Main Category" },
              { icon: "⚙️", type: "text", name: "subCategory", placeholder: "Sub Category" },
              { icon: "🌐", type: "text", name: "brand", placeholder: "Brand" },
            ].map((field, idx) => (
              <div
                key={idx}
                className="flex items-center border border-gray-300 rounded-full px-3 py-2 shadow-sm"
              >
                <span className="mr-2">{field.icon}</span>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-sm"
                  required
                />
              </div>
            ))}

            {/* ✅ Size Checkboxes */}
            <div className="border border-gray-300 rounded-xl px-4 py-3 shadow-sm">
              <label className="flex items-center mb-2 font-medium text-sm text-gray-600">
                <span className="mr-2 text-lg">👕</span> Select Sizes:
              </label>
              <div className="grid grid-cols-3 gap-2 text-sm text-gray-700">
                {["XS", "S", "M", "L", "XL", "Free Size"].map((size) => (
                  <label key={size} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={size}
                      checked={formData.size.includes(size)}
                      onChange={handleSizeChange}
                      className="accent-pink-500"
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 shadow-sm">
              <span className="mr-2">👗</span>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="flex-1 text-sm"
              />
            </div>

      {/* ✅ Product Detail Key-Value */}
<div className="border border-gray-300 rounded-xl p-4 shadow-sm space-y-3">
  <label className="flex items-center text-gray-600 text-sm font-medium">
    <span className="mr-2 text-lg">📋</span> P.Detail
  </label>

  {details.map((row, index) => (
    <div key={index} className="flex items-center gap-2 mb-2">
      <input
        type="text"
        placeholder="Key (e.g. Care instructions)"
        value={row.key}
        onChange={(e) => handleDetailChange(index, "key", e.target.value)}
        className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none max-w-[30%]" // ✅ Same as About
      />
      <input
        type="text"
        placeholder="Value (e.g. Hand Wash Only)"
        value={row.value}
        onChange={(e) => handleDetailChange(index, "value", e.target.value)}
        className="flex-grow border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none" // ✅ Same as About
      />
      <button
        type="button"
        onClick={() => handleRemoveDetail(index)}
        className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-lg hover:bg-red-200"
      >
        Remove
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={handleAddDetail}
    className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-lg hover:bg-green-200"
  >
    + Add Another Detail
  </button>
</div>


            {/* ✅ About Item Key-Value */}
            <div className="border border-gray-300 rounded-xl p-4 shadow-sm space-y-3 mt-4">
              <label className="flex items-center text-gray-600 text-sm font-medium">
                <span className="mr-2 text-lg">ℹ️</span> About This Item (Key - Value pairs)
              </label>

              {aboutItems.map((row, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Key (e.g. Fabric)"
                    value={row.key}
                    onChange={(e) =>
                      handleAboutChange(index, "key", e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none max-w-[30%]"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. Kanjivaram Pure Zari)"
                    value={row.value}
                    onChange={(e) =>
                      handleAboutChange(index, "value", e.target.value)
                    }
                    className="flex-grow border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAbout(index)}
                    className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-lg hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddAbout}
                className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200"
              >
                + Add Line
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-5 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-full py-3 font-bold shadow hover:bg-pink-400 hover:text-white transition"
          >
            <span>🍌</span> ADD
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
