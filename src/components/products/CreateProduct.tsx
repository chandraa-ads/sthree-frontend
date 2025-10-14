import React, { useState, ChangeEvent, FormEvent } from 'react';

interface Variant {
  color: string;
  size: string;
  price: number;
  stock: number;
}

const ProductForm: React.FC = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [discountPrice, setDiscountPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [category, setCategory] = useState('Accessories');
  const [mainCategory, setMainCategory] = useState('Fashion');
  const [subCategory, setSubCategory] = useState('Wallets');
  const [brand, setBrand] = useState('');
  const [aboutItem, setAboutItem] = useState('');
  const [description, setDescription] = useState('');
  const [productSize, setProductSize] = useState('');
  const [discountStartDate, setDiscountStartDate] = useState('');
  const [discountEndDate, setDiscountEndDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currency, setCurrency] = useState('INR');
  const [taxPercentage, setTaxPercentage] = useState<number | ''>(18);

  // Main image upload & preview
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Variants state
  const [variants, setVariants] = useState<Variant[]>([
    { color: '', size: '', price: 0, stock: 0 },
  ]);

  // Handle main image upload & preview
  const onMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Handle variant updates
  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant,
      ),
    );
  };

  // Add new variant
  const addVariant = () => {
    setVariants((prev) => [...prev, { color: '', size: '', price: 0, stock: 0 }]);
  };

  // Remove variant by index
  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle tags input (comma separated)
  const onTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const tagList = input.split(',').map((t) => t.trim()).filter(Boolean);
    setTags(tagList);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    if (price !== '') formData.append('price', price.toString());
    if (originalPrice !== '') formData.append('original_price', originalPrice.toString());
    if (discountPrice !== '') formData.append('discount_price', discountPrice.toString());
    if (stock !== '') formData.append('stock', stock.toString());
    formData.append('category', category);
    formData.append('main_category', mainCategory);
    formData.append('sub_category', subCategory);
    formData.append('brand', brand);
    formData.append('about_item', aboutItem);
    formData.append('description', description);
    formData.append('product_size', productSize);
    formData.append('discount_start_date', discountStartDate);
    formData.append('discount_end_date', discountEndDate);
    formData.append('currency', currency);
    if (taxPercentage !== '') formData.append('tax_percentage', taxPercentage.toString());
    formData.append('tags', JSON.stringify(tags));
    formData.append('variants', JSON.stringify(variants));

    if (mainImage) {
      formData.append('image', mainImage);
    }

    try {
      const response = await fetch('/products', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      alert('Product created successfully!');
      // Optionally reset form here
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block mb-1 font-medium">Product Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Leather Wallet"
          />
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Price (₹)</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="2999"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Original Price (₹)</label>
            <input
              type="number"
              min={0}
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="3999"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Discount Price (₹)</label>
            <input
              type="number"
              min={0}
              value={discountPrice}
              onChange={(e) => setDiscountPrice(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="2499"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Stock Quantity</label>
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="50"
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Main Category</label>
            <input
              type="text"
              value={mainCategory}
              onChange={(e) => setMainCategory(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Fashion"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Accessories"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Sub Category</label>
            <input
              type="text"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Wallets"
            />
          </div>
        </div>

        {/* Brand */}
        <div>
          <label className="block mb-1 font-medium">Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Premium Leather Co."
          />
        </div>

        {/* About and Description */}
        <div>
          <label className="block mb-1 font-medium">About Item</label>
          <textarea
            value={aboutItem}
            onChange={(e) => setAboutItem(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Handcrafted leather wallet with RFID protection."
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Premium handmade leather wallet with multiple compartments."
          />
        </div>

        {/* Product Size */}
        <div>
          <label className="block mb-1 font-medium">Product Size</label>
          <input
            type="text"
            value={productSize}
            onChange={(e) => setProductSize(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Medium"
          />
        </div>

        {/* Discount Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Discount Start Date</label>
            <input
              type="datetime-local"
              value={discountStartDate}
              onChange={(e) => setDiscountStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Discount End Date</label>
            <input
              type="datetime-local"
              value={discountEndDate}
              onChange={(e) => setDiscountEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Currency and Tax */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Currency</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="INR"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Tax Percentage</label>
            <input
              type="number"
              min={0}
              max={100}
              value={taxPercentage}
              onChange={(e) => setTaxPercentage(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="18"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-1 font-medium">Tags (comma separated)</label>
          <input
            type="text"
            value={tags.join(', ')}
            onChange={onTagsChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="leather, wallet, women, fashion"
          />
        </div>

        {/* Variants */}
        <div>
          <label className="block mb-2 font-semibold">Variants</label>
          {variants.map((variant, i) => (
            <div key={i} className="flex space-x-3 mb-3 items-center">
              <input
                type="text"
                placeholder="Color"
                value={variant.color}
                onChange={(e) => updateVariant(i, 'color', e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 w-24"
              />
              <input
                type="text"
                placeholder="Size"
                value={variant.size}
                onChange={(e) => updateVariant(i, 'size', e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 w-20"
              />
              <input
                type="number"
                placeholder="Price"
                value={variant.price}
                min={0}
                onChange={(e) => updateVariant(i, 'price', Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 w-24"
              />
              <input
                type="number"
                placeholder="Stock"
                value={variant.stock}
                min={0}
                onChange={(e) => updateVariant(i, 'stock', Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 w-20"
              />
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-red-500 font-bold"
                  aria-label={`Remove variant ${i + 1}`}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            Add Variant
          </button>
        </div>

        {/* Main Image Upload */}
        <div>
          <label className="block mb-2 font-medium">Product Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={onMainImageChange}
            className="mb-4"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Main Image Preview"
              className="h-24 w-24 object-cover rounded border"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-pink-600 text-white font-semibold rounded hover:bg-pink-700 transition"
        >
          Save Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
