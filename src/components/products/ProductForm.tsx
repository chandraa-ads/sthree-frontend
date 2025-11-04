import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";

interface Variant {
  color: string;
  size: string[];
  original_price: number;
  discount_percentage: number;
  price: number;
  stock: number;
}

interface ProductFormProps {
  product?: any;
  onSuccess?: () => void;
}

const sizeOptions = [
  // 🧍 Adult sizes
  "Free | Universal",
  "XS | 34",
  "S | 36",
  "M | 38",
  "L | 40",
  "XL | 42",
  "2XL | 44",
  "3XL | 46",
  "4XL | 48",
  "5XL | 50",

  // 👶 Baby sizes
  "0-3 M | Baby",
  "3-6 M | Baby",
  "6-9 M | Baby",
  "9-12 M | Baby",
  "12-18 M | Baby",
  "18-24 M | Baby",
  "2-3 Y | Baby",
  "3-4 Y | Baby",
  "4-5 Y | Baby",

  // 🧒 Kids sizes
  "5-6 Y | Kids",
  "6-7 Y | Kids",
  "7-8 Y | Kids",
  "8-9 Y | Kids",
  "9-10 Y | Kids",
  "10-11 Y | Kids",
  "11-12 Y | Kids",
  "12-13 Y | Kids",
  "13-14 Y | Kids",
  "14-15 Y | Kids",
];



const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess }) => {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState<number | "">(product?.price || "");
  const [originalPrice, setOriginalPrice] = useState<number | "">(
    product?.original_price || ""
  );
  const [discountPercentage, setDiscountPercentage] = useState<number | "">(
    product?.discount_percentage || 0
  );

  useEffect(() => {
  if (!product?.discount_start_date && !product?.discount_end_date) {
    const today = new Date();
    const tenDaysLater = new Date(today);
    tenDaysLater.setDate(today.getDate() + 10);

    // Format as YYYY-MM-DD for <input type="date" />
    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    setDiscountStartDate(formatDate(today));
    setDiscountEndDate(formatDate(tenDaysLater));
  }
}, [product]);

  const [stock, setStock] = useState<number | "">(product?.stock || "");
  const [category, setCategory] = useState(product?.category || "Accessories");
  const [mainCategory, setMainCategory] = useState(
    product?.main_category || "Fashion"
  );
  const [subCategory, setSubCategory] = useState(
    product?.sub_category || "Wallets"
  );
  const [brand, setBrand] = useState(product?.brand || "");
  const [aboutItem, setAboutItem] = useState(product?.about_item || "");
  const [description, setDescription] = useState(product?.description || "");

  // Product Detail as key–value pairs
  const [productDetail, setProductDetail] = useState<{ key: string; value: string }[]>([]);
  const [productDetailRaw, setProductDetailRaw] = useState("{}");


  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images || []
  );
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Add this useEffect inside your ProductForm component
  useEffect(() => {
    // If category is empty or equals previous mainCategory, update it automatically
    setCategory((prevCategory: any) => {
      // Only update if category is empty or previously equal to mainCategory
      if (!prevCategory || prevCategory === product?.main_category) {
        return mainCategory;
      }
      return prevCategory; // leave user-entered category unchanged
    });
  }, [mainCategory, product?.main_category]);

  useEffect(() => {
    if (product?.product_detail) {
      try {
        const parsed =
          typeof product.product_detail === "string"
            ? JSON.parse(product.product_detail)
            : product.product_detail;
        const keyValues = Object.entries(parsed).map(([key, value]) => ({
          key,
          value: String(value),
        }));
        setProductDetail(keyValues);
        setProductDetailRaw(JSON.stringify(parsed, null, 2));
      } catch {
        setProductDetail([]);
        setProductDetailRaw("{}");
      }
    } else {
      setProductDetail([]);
      setProductDetailRaw("{}");
    }
  }, [product]);


  useEffect(() => {
    if (originalPrice !== "" && discountPercentage !== "") {
      const calculated = Math.round(
        Number(originalPrice) -
        (Number(originalPrice) * Number(discountPercentage)) / 100
      );
      setPrice(calculated);
    }
  }, [originalPrice, discountPercentage]);

  const [productSize, setProductSize] = useState<string[]>(
    product?.product_size || []
  );
  const [discountStartDate, setDiscountStartDate] = useState(
    product?.discount_start_date || ""
  );
  const [discountEndDate, setDiscountEndDate] = useState(
    product?.discount_end_date || ""
  );
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [tagsInput, setTagsInput] = useState(tags.join(", "));
  const [currency, setCurrency] = useState(product?.currency || "INR");
  const [taxPercentage, setTaxPercentage] = useState<number | "">(
    product?.tax_percentage || 18
  );

  const [variants, setVariants] = useState<Variant[]>(
    product?.variants || [{ color: "", size: [], price: 0, stock: 0 }]
  );

  const calculateVariantPrice = (variant: Variant) => {
    if (!variant.original_price || !variant.discount_percentage) return 0;
    const discountAmount =
      (variant.original_price * variant.discount_percentage) / 100;
    return variant.original_price - discountAmount;
  };

  // Remove existing image
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove new uploaded image
  const removeNewImage = (index: number) => {
    // Revoke URL
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setOriginalPrice("");
    setDiscountPercentage(0);
    setStock("");
    setCategory("Accessories");
    setMainCategory("Fashion");
    setSubCategory("Wallets");
    setBrand("");
    setAboutItem("");
    setDescription("");
    setProductDetail([]);
    setProductDetailRaw("{}");
    setProductSize([]);
    setDiscountStartDate("");
    setDiscountEndDate("");
    setTags([]);
    setTagsInput("");
    setCurrency("INR");
    setTaxPercentage(18);
    setImages([]);
    setImagePreviews([]);
    setExistingImages([]);
    setVariants([
      {
        color: "",
        size: [],
        original_price: 0,
        discount_percentage: 0,
        price: 0,
        stock: 0,
      },
    ]);
  };

  const token = localStorage.getItem("adminToken");
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    if (originalPrice !== "" && discountPercentage !== "") {
      const calculated = Math.round(
        Number(originalPrice) -
        (Number(originalPrice) * Number(discountPercentage)) / 100
      );
      setPrice(calculated);
    }
  }, [originalPrice, discountPercentage]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  // Utility: Convert file to WebP
  const convertToWebP = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas not supported");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject("WebP conversion failed");
            const webpFile = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
              type: "image/webp",
            });
            resolve(webpFile);
          },
          "image/webp",
          0.8 // quality (0–1)
        );
      };

      img.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Handle image selection
  const onImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const convertedFiles = await Promise.all(files.map((file) => convertToWebP(file)));

    const previews = convertedFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...convertedFiles]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  // Handle drag & drop upload
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const convertedFiles = await Promise.all(files.map((file) => convertToWebP(file)));

    const previews = convertedFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...convertedFiles]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };


  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        color: "",
        size: [],
        original_price: 0,
        discount_percentage: 0,
        price: 0,
        stock: 0,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const onTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setTagsInput(input);
    setTags(
      input
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to create or update a product.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price === "" ? "0" : price.toString());
    formData.append(
      "original_price",
      originalPrice === "" ? "0" : originalPrice.toString()
    );
    formData.append(
      "discount_percentage",
      discountPercentage === "" ? "0" : discountPercentage.toString()
    );
    formData.append("stock", stock === "" ? "0" : stock.toString());
    formData.append("category", category);
    formData.append("main_category", mainCategory);
    formData.append("sub_category", subCategory);
    formData.append("brand", brand);
    formData.append("about_item", aboutItem);
    formData.append("description", description);

    // ✅ Stringify productDetail for jsonb storage
    formData.append(
      "product_detail",
      JSON.stringify(Object.fromEntries(productDetail.map(i => [i.key, i.value])))
    );

    formData.append("product_size", JSON.stringify(productSize));
    formData.append("discount_start_date", discountStartDate);
    formData.append("discount_end_date", discountEndDate);
    formData.append("currency", currency);
    formData.append(
      "tax_percentage",
      taxPercentage === "" ? "0" : taxPercentage.toString()
    );
    formData.append("tags", JSON.stringify(tags));
    formData.append("variants", JSON.stringify(variants));

    images.forEach((file) => formData.append("images", file));

    const method = product?.id ? "PUT" : "POST";
    const url = product?.id
      ? `${API_BASE_URL}/products/${product.id}`
      : `${API_BASE_URL}/products`;

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save product");
      }

      alert(
        product?.id
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Product save error:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-pink-600">
        {product ? "Update Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name & Price */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label>Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Original Price (₹)</label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) =>
                setOriginalPrice(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold">Price (₹)</label>
            <input
              type="number"
              value={price || 0}
              readOnly
              className="border p-2 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Discount, Stock & Currency */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label>Discount (%)</label>
            <input
              type="number"
              value={discountPercentage}
              onChange={(e) =>
                setDiscountPercentage(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) =>
                setStock(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Currency</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Category */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label>Main Category</label>
            <input
              type="text"
              value={mainCategory}
              onChange={(e) => setMainCategory(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Category</label>
            <input
              type="text"
              value={mainCategory} // mirror mainCategory
              disabled // prevent editing
              className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label>Sub Category</label>
            <input
              type="text"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Brand */}
        <div>
          <label>Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* About & Description */}
        <div>
          <label>About Item</label>
          <textarea
            value={aboutItem}
            onChange={(e) => setAboutItem(e.target.value)}
            className="w-full border p-2 rounded"
          ></textarea>
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          ></textarea>
        </div>

        {/* Product Detail */}
        <div>
          <label className="font-semibold">Product Details</label>

          {productDetail.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Key (e.g., material)"
                value={item.key}
                onChange={(e) => {
                  const updated = [...productDetail];
                  updated[index].key = e.target.value;
                  setProductDetail(updated);
                  setProductDetailRaw(
                    JSON.stringify(Object.fromEntries(updated.map(i => [i.key, i.value])))
                  );
                }}
                className="border p-2 rounded w-1/2"
              />
              <input
                type="text"
                placeholder="Value (e.g., Leather)"
                value={item.value}
                onChange={(e) => {
                  const updated = [...productDetail];
                  updated[index].value = e.target.value;
                  setProductDetail(updated);
                  setProductDetailRaw(
                    JSON.stringify(Object.fromEntries(updated.map(i => [i.key, i.value])))
                  );
                }}
                className="border p-2 rounded w-1/2"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = productDetail.filter((_, i) => i !== index);
                  setProductDetail(updated);
                  setProductDetailRaw(
                    JSON.stringify(Object.fromEntries(updated.map(i => [i.key, i.value])))
                  );
                }}
                className="text-red-600 font-bold px-2"
              >
                ×
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setProductDetail([...productDetail, { key: "", value: "" }])}
            className="mt-2 px-3 py-1 bg-pink-500 text-white rounded"
          >
            + Add Detail
          </button>

          <p className="text-sm text-gray-500 mt-2">
            Example: Material – Leather, Warranty – 1 year
          </p>
        </div>


        {/* Product Sizes */}
        <div>
          <label className="text-lg font-semibold">Product Sizes</label>
          <div className="flex flex-wrap gap-2 border p-2 rounded">
            {productSize.map((s) => (
              <span
                key={s}
                className="bg-pink-200 text-pink-800 px-2 py-1 rounded cursor-pointer"
                onClick={() =>
                  setProductSize(productSize.filter((size) => size !== s))
                }
              >
                {s} ×
              </span>
            ))}
            <select
              value=""
              onChange={(e) => {
                const selected = e.target.value;
                if (selected && !productSize.includes(selected)) {
                  setProductSize([...productSize, selected]);
                }
              }}
              className="border-none outline-none"
            >
              <option value="">Add Size</option>
              {sizeOptions
                .filter((size) => !productSize.includes(size))
                .map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label>Tags (comma separated)</label>
          <input
            type="text"
            value={tagsInput}
            onChange={onTagsChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Discount Dates */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label>Discount Start Date</label>
            <input
              type="date"
              value={discountStartDate}
              onChange={(e) => setDiscountStartDate(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label>Discount End Date</label>
            <input
              type="date"
              value={discountEndDate}
              onChange={(e) => setDiscountEndDate(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="font-semibold text-lg block mb-2">
            Product Images
          </label>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-pink-400 p-6 rounded-lg text-center cursor-pointer hover:bg-pink-50 transition relative"
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onImagesChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <p className="text-gray-600">
              Drag & drop product images here, or{" "}
              <span className="text-pink-600 font-semibold">click to upload</span>
            </p>
          </div>


          {/* Previews */}
          <div className="flex gap-4 mt-4 flex-wrap">
            {/* Existing Images */}
            {existingImages.map((src, idx) => (
              <div key={"existing-" + idx} className="relative">
                <img
                  src={src}
                  alt={`Existing ${idx}`}
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}

            {/* New Images */}
            {imagePreviews.map((src, idx) => (
              <div key={"new-" + idx} className="relative">
                <img
                  src={src}
                  alt={`Preview ${idx}`}
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(idx)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>


        {/* Variants */}
        <div>
          <label className="font-medium mb-2 block">Variants</label>
          {variants.map((variant, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-2 items-start border p-4 rounded mb-4 bg-gray-50"
            >
              {/* Color */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Color</label>
                <input
                  type="text"
                  placeholder="Enter color"
                  value={variant.color}
                  onChange={(e) => updateVariant(idx, "color", e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Sizes */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Size</label>
                <div className="flex flex-wrap gap-2 border p-2 rounded">
                  {variant.size.map((s) => (
                    <span
                      key={s}
                      className="bg-pink-200 text-pink-800 px-2 py-1 rounded cursor-pointer"
                      onClick={() =>
                        updateVariant(
                          idx,
                          "size",
                          variant.size.filter((size) => size !== s)
                        )
                      }
                    >
                      {s} ×
                    </span>
                  ))}
                  <select
                    value=""
                    onChange={(e) => {
                      const selected = e.target.value;
                      if (selected && !variant.size.includes(selected)) {
                        updateVariant(idx, "size", [...variant.size, selected]);
                      }
                    }}
                    className="border-none outline-none"
                  >
                    <option value="">Add Size</option>
                    {sizeOptions
                      .filter((size) => !variant.size.includes(size))
                      .map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Original Price */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  value={variant.original_price || ""}
                  onChange={(e) =>
                    updateVariant(idx, "original_price", Number(e.target.value))
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Discount Percentage */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  value={variant.discount_percentage || ""}
                  onChange={(e) =>
                    updateVariant(
                      idx,
                      "discount_percentage",
                      Number(e.target.value)
                    )
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Calculated Price */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={calculateVariantPrice(variant)}
                  readOnly
                  className="border p-2 rounded bg-gray-100 cursor-not-allowed w-full"
                />
              </div>

              {/* Stock */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">Stock</label>
                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) =>
                    updateVariant(idx, "stock", Number(e.target.value))
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col mt-2 md:mt-0">
                <label className="text-sm font-semibold mb-1">Actions</label>
                <button
                  type="button"
                  onClick={() => removeVariant(idx)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addVariant}
            className="bg-pink-500 text-white px-6 py-2 rounded mt-2"
          >
            Add Variant
          </button>
        </div>
        {/* Submit & Reset */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            className="flex-1 bg-pink-600 text-white px-6 py-3 rounded hover:bg-pink-700"
          >
            {product ? "Update Product" : "Create Product"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="flex-1 bg-gray-300 text-gray-800 px-6 py-3 rounded hover:bg-gray-400"
          >
            Reset Form
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProductForm;