"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Button from "../ui/button/Button";
import { adminCategoryService } from "../../../services/admin/adminCategoryApiService";
import { adminProductService } from "../../../services/admin/adminProductApiService";
import { Modal } from "../ui/modal";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, isEdit }) => {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);

    // Form State
    const [name, setName] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [offerPercentage, setOfferPercentage] = useState<number>(0);
    const [images, setImages] = useState<string[]>([]);
    const [variants, setVariants] = useState<{ size: string; stock: number; price: number }[]>([{ size: "", stock: 0, price: 0 }]);
    const [ingredients, setIngredients] = useState<{ name: string; description: string }[]>([{ name: "", description: "" }]);
    const [howToUse, setHowToUse] = useState<string[]>([""]);
    const [isActive, setIsActive] = useState(true);

    // Loading
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [cropping, setCropping] = useState(false);

    // Cropper State
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number | undefined>(1);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        fetchCategories();
        if (initialData) {
            setName(initialData.name || "");
            setShortDescription(initialData.shortDescription || "");
            setDescription(initialData.description || "");
            setCategoryId(initialData.category?._id || initialData.category || "");
            setPrice(initialData.price || 0);
            setOfferPercentage(initialData.offerPercentage || initialData.offer || 0);
            setImages(initialData.images || []);

            if (initialData.variants && initialData.variants.length > 0) {
                const mappedVariants = initialData.variants.map((v: any) => ({
                    size: v.size || v.name || "",
                    stock: v.stock || 0,
                    price: v.price || 0
                }));
                setVariants(mappedVariants);
            }

            if (initialData.ingredients && initialData.ingredients.length > 0) {
                setIngredients(initialData.ingredients);
            }

            if (initialData.howToUse && initialData.howToUse.length > 0) {
                setHowToUse(initialData.howToUse);
            }

            setIsActive(initialData.isActive !== undefined ? initialData.isActive : true);
        }
    }, [initialData]);

    const fetchCategories = async () => {
        const data = await adminCategoryService.getCategories(1, 100);
        if (data.success) setCategories(data.categories);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setCropImageSrc(reader.result as string);
                setCropModalOpen(true);
                setAspect(1); // Default to square
                e.target.value = "";
            };
            reader.readAsDataURL(file);
        }
    };

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        if (aspect) {
            const newCrop = centerCrop(
                makeAspectCrop(
                    { unit: '%', width: 90 },
                    aspect,
                    width,
                    height
                ),
                width,
                height
            );
            setCrop(newCrop);
        } else {
            setCrop({ unit: '%', width: 90, height: 90, x: 5, y: 5 });
        }
    }

    const handleAspectChange = (newAspect: number | undefined) => {
        setAspect(newAspect);
        if (imgRef.current) {
            const { width, height } = imgRef.current;
            if (newAspect) {
                const newCrop = centerCrop(
                    makeAspectCrop(
                        { unit: '%', width: 90 },
                        newAspect,
                        width,
                        height
                    ),
                    width,
                    height
                );
                setCrop(newCrop);
            }
        }
    };

    const getCroppedImg = async (image: HTMLImageElement, crop: PixelCrop): Promise<Blob | null> => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
        });
    };

    const handleCropSave = async () => {
        if (!imgRef.current || !completedCrop) return;
        setCropping(true);
        try {
            const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
            if (!croppedImageBlob) {
                setCropping(false);
                return;
            }

            const file = new File([croppedImageBlob], "product-image.jpeg", { type: "image/jpeg" });
            const uploadRes = await adminProductService.uploadProductImage(file);

            if (uploadRes.success) {
                setImages([...images, uploadRes.imageUrl]);
                setCropModalOpen(false);
                setCropImageSrc(null);
            } else {
                toast.error("Upload failed");
            }
        } catch (error: any) {
            console.error("Cropping/Upload error:", error);
            const errorMsg = error.response?.data?.error || error.message || "Error cropping/uploading image";
            toast.error(errorMsg);
        } finally {
            setCropping(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // --- Variants ---
    const handleVariantChange = (index: number, field: "size" | "stock" | "price", value: string | number) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };
    const addVariant = () => setVariants([...variants, { size: "", stock: 0, price: 0 }]);
    const removeVariant = (index: number) => variants.length > 1 && setVariants(variants.filter((_, i) => i !== index));

    // --- Ingredients ---
    const handleIngredientChange = (index: number, field: "name" | "description", value: string) => {
        const newIng = [...ingredients];
        newIng[index] = { ...newIng[index], [field]: value };
        setIngredients(newIng);
    };
    const addIngredient = () => setIngredients([...ingredients, { name: "", description: "" }]);
    const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));

    // --- How To Use ---
    const handleHowToUseChange = (index: number, value: string) => {
        const newSteps = [...howToUse];
        newSteps[index] = value;
        setHowToUse(newSteps);
    };
    const addHowToUse = () => setHowToUse([...howToUse, ""]);
    const removeHowToUse = (index: number) => setHowToUse(howToUse.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (images.length < 4) {
                toast.error("Minimum 4 images required");
                setSubmitting(false);
                return;
            }

            const payload = {
                name,
                shortDescription,
                description,
                category: categoryId,
                price: isNaN(price) ? 0 : price,
                offerPercentage: isNaN(offerPercentage) ? 0 : offerPercentage,
                images,
                variants: variants.map(v => ({
                    ...v,
                    stock: isNaN(v.stock) ? 0 : v.stock,
                    price: isNaN(v.price) ? 0 : v.price
                })),
                ingredients: ingredients.filter(i => i.name && i.description),
                howToUse: howToUse.filter(s => s.trim() !== ""),
                isActive
            };

            if (isEdit && initialData?._id) {
                await adminProductService.updateProduct(initialData._id, payload);
            } else {
                await adminProductService.createProduct(payload as any);
            }

            router.push("/admin/products");
        } catch (error: any) {
            console.error("Submit error", error);
            toast.error(error.response?.data?.error || "Failed to save product");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-20">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                    <h2 className="text-2xl font-bold dark:text-white mb-6 border-b pb-4 border-gray-100 dark:border-gray-800">
                        {isEdit ? "Edit Product" : "Basic Information"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                            <input type="text" required minLength={3} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Vitamin C Serum" />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <select required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
                            <input type="text" required minLength={10} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500" value={shortDescription} onChange={e => setShortDescription(e.target.value)} placeholder="Brief summary for cards (min 10 chars)" />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Description</label>
                            <textarea required minLength={20} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500" rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Detailed product description (min 20 chars)" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Price (₹)</label>
                            <input type="number" required min="0" step="0.01" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500" value={isNaN(price) ? "" : price} onChange={e => setPrice(parseFloat(e.target.value))} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Offer Percentage (%)</label>
                            <input type="number" min="0" max="99" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500" value={isNaN(offerPercentage) ? "" : offerPercentage} onChange={e => setOfferPercentage(parseInt(e.target.value))} />
                        </div>

                        <div className="flex items-center col-span-2 mt-2">
                            <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Active Status</span>
                                <span className="text-xs text-gray-500 ml-auto">Show/Hide product in store</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-bold dark:text-white">Product Images</h3>
                        <div className="relative">
                            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                            <Button type="button" size="sm">
                                <span className="flex items-center gap-2"><span className="text-xl leading-none">+</span> Add Image</span>
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative h-48 border rounded-lg overflow-hidden group shadow-sm bg-gray-50 flex items-center justify-center">
                                <Image src={img} alt={`Product ${idx}`} fill className="object-contain p-2" />
                                <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-50 z-10">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                                {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] font-bold uppercase tracking-widest text-center py-1.5 z-10">Cover Image</span>}
                            </div>
                        ))}
                        {images.length === 0 && (
                            <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl border-gray-200 dark:border-gray-700 text-gray-400">
                                <p>No images added. Please add at least 4 images.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Variants */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-bold dark:text-white">Variants</h3>
                        <Button type="button" variant="outline" size="sm" onClick={addVariant}>+ Add Variant</Button>
                    </div>
                    <div className="space-y-4">
                        {variants.map((variant, idx) => (
                            <div key={idx} className="flex gap-4 items-end flex-wrap md:flex-nowrap p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                <div className="w-full md:flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Size / Volume</label>
                                    <input type="text" placeholder="e.g. 50ml, Large" required className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={variant.size} onChange={e => handleVariantChange(idx, "size", e.target.value)} />
                                </div>
                                <div className="w-1/2 md:w-32">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Price (₹)</label>
                                    <input type="number" required min="0" step="0.01" className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={isNaN(variant.price) ? "" : variant.price} onChange={e => handleVariantChange(idx, "price", parseFloat(e.target.value))} />
                                </div>
                                <div className="w-1/2 md:w-32">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
                                    <input type="number" required min="0" className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={isNaN(variant.stock) ? "" : variant.stock} onChange={e => handleVariantChange(idx, "stock", parseInt(e.target.value))} />
                                </div>
                                {variants.length > 1 && (
                                    <Button type="button" variant="outline" className="text-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => removeVariant(idx)}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ingredients */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-bold dark:text-white">Ingredients</h3>
                        <Button type="button" variant="outline" size="sm" onClick={addIngredient}>+ Add Ingredient</Button>
                    </div>
                    <div className="space-y-4">
                        {ingredients.map((ing, idx) => (
                            <div key={idx} className="flex gap-4 items-start flex-wrap md:flex-nowrap p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                                <div className="w-full md:w-1/3">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Ingredient Name</label>
                                    <input type="text" placeholder="e.g. Vitamin C" className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={ing.name} onChange={e => handleIngredientChange(idx, "name", e.target.value)} />
                                </div>
                                <div className="w-full md:flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Description / Benefits</label>
                                    <textarea rows={1} placeholder="Briefly describe its role..." className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-y" value={ing.description} onChange={e => handleIngredientChange(idx, "description", e.target.value)} />
                                </div>
                                <Button type="button" variant="outline" className="mt-6 text-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => removeIngredient(idx)}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </Button>
                            </div>
                        ))}
                        {ingredients.length === 0 && <p className="text-gray-400 text-sm italic">No ingredients listed (Optional).</p>}
                    </div>
                </div>

                {/* How To Use */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-bold dark:text-white">How To Use</h3>
                        <Button type="button" variant="outline" size="sm" onClick={addHowToUse}>+ Add Step</Button>
                    </div>
                    <div className="space-y-3">
                        {howToUse.map((step, idx) => (
                            <div key={idx} className="flex gap-3 items-center">
                                <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold w-8 h-8 flex items-center justify-center rounded-full text-sm">
                                    {idx + 1}
                                </span>
                                <input type="text" className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-brand-500" value={step} onChange={e => handleHowToUseChange(idx, e.target.value)} placeholder={`Step ${idx + 1} instruction...`} />
                                <Button type="button" variant="outline" className="text-red-500 hover:bg-red-50" onClick={() => removeHowToUse(idx)}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t p-4 flex justify-end gap-4 shadow-lg z-10">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={submitting || images.length < 4} className="min-w-[150px]">
                        {submitting ? "Saving..." : (isEdit ? "Update Product" : "Create Product")}
                    </Button>
                </div>
            </form>

            {/* Cropper Modal */}
            <Modal isOpen={cropModalOpen} onClose={() => setCropModalOpen(false)} className="max-w-4xl w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold dark:text-white">Crop Image</h3>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => handleAspectChange(1)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${aspect === 1 ? "bg-brand-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"}`}>Square (1:1)</button>
                        <button type="button" onClick={() => handleAspectChange(3 / 4)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${aspect === 3 / 4 ? "bg-brand-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"}`}>Portrait (3:4)</button>
                        <button type="button" onClick={() => handleAspectChange(4 / 5)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${aspect === 4 / 5 ? "bg-brand-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"}`}>Portrait (4:5)</button>
                        <button type="button" onClick={() => handleAspectChange(undefined)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${aspect === undefined ? "bg-brand-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"}`}>Custom (Free)</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-3">
                        <div className="relative bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 max-h-[600px] flex items-center justify-center">
                            {cropImageSrc && (
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={aspect}
                                    className="max-w-full max-h-full"
                                >
                                    <img
                                        ref={imgRef}
                                        src={cropImageSrc}
                                        alt="Crop"
                                        onLoad={onImageLoad}
                                        style={{ maxHeight: '600px', objectFit: 'contain' }}
                                    />
                                </ReactCrop>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col justify-between">
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Adjustments</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {aspect ? "Aspect ratio is locked. Drag the box to position." : "Free resizing enabled. Drag the corners to adjust breadth and height."}
                            </p>
                        </div>
                        <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <Button onClick={handleCropSave} disabled={cropping || !completedCrop} className="w-full">
                                {cropping ? "Saving..." : "Save & Upload"}
                            </Button>
                            <Button variant="outline" onClick={() => setCropModalOpen(false)} disabled={cropping} className="w-full">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};
