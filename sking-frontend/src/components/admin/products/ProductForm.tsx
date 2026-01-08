"use client";
import React, { useState, useEffect, useCallback } from "react";
import Button from "../ui/button/Button";
import { adminCategoryService } from "../../../services/admin/adminCategoryApiService";
import { adminProductService } from "../../../services/admin/adminProductApiService";
import { Modal } from "../ui/modal";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../../utils/cropImage";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, isEdit }) => {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);

    // Form State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [offer, setOffer] = useState<number>(0);
    const [images, setImages] = useState<string[]>([]);
    const [variants, setVariants] = useState<{ name: string; stock: number; price: number }[]>([{ name: "", stock: 0, price: 0 }]);
    const [isActive, setIsActive] = useState(true);

    // Loading
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [cropping, setCropping] = useState(false);

    // Cropper State
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    useEffect(() => {
        fetchCategories();
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description || "");
            setCategoryId(initialData.category?._id || initialData.category || "");
            setPrice(initialData.price);
            setOffer(initialData.offer || 0);
            setImages(initialData.images || []);
            setVariants(initialData.variants.length > 0 ? initialData.variants : [{ name: "", stock: 0, price: 0 }]);
            setIsActive(initialData.isActive);
        }
    }, [initialData]);

    const fetchCategories = async () => {
        const data = await adminCategoryService.getCategories(1, 100); // Fetch enough
        if (data.success) setCategories(data.categories);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            setCropImageSrc(imageDataUrl);
            setCropModalOpen(true);
            // Reset input
            e.target.value = "";
        }
    };

    const readFile = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(reader.result as string));
            reader.readAsDataURL(file);
        });
    };

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropSave = async () => {
        if (!cropImageSrc || !croppedAreaPixels) return;
        setCropping(true);
        try {
            const croppedImageBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels);
            if (!croppedImageBlob) {
                setCropping(false);
                return;
            }

            const file = new File([croppedImageBlob], "product-image.jpeg", { type: "image/jpeg" });

            // Upload
            const uploadRes = await adminProductService.uploadProductImage(file);
            if (uploadRes.success) {
                setImages([...images, uploadRes.imageUrl]);
                setCropModalOpen(false);
                setCropImageSrc(null);
            } else {
                alert("Upload failed");
            }
        } catch (e) {
            console.error(e);
            alert("Error cropping/uploading image");
        } finally {
            setCropping(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index: number, field: "name" | "stock" | "price", value: string | number) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { name: "", stock: 0, price: 0 }]);
    };

    const removeVariant = (index: number) => {
        if (variants.length === 1) return;
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (images.length < 4) {
                alert("Minimum 4 images required");
                setSubmitting(false);
                return;
            }

            const payload = {
                name,
                description,
                category: categoryId,
                price: isNaN(price) ? 0 : price,
                offer: isNaN(offer) ? 0 : offer,
                images,
                variants: variants.map(v => ({
                    ...v,
                    stock: isNaN(v.stock) ? 0 : v.stock,
                    price: isNaN(v.price) ? 0 : v.price
                })),
                isActive
            };

            if (isEdit && initialData?._id) {
                await adminProductService.updateProduct(initialData._id, payload);
            } else {
                await adminProductService.createProduct(payload);
            }

            router.push("/admin/products"); // Redirect to products list
        } catch (error) {
            console.error("Submit error", error);
            alert("Failed to save product");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-bold dark:text-white mb-6">{isEdit ? "Edit Product" : "Add New Product"}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                        <input type="text" required minLength={3} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" rows={4} value={description} onChange={e => setDescription(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select required className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Price (₹)</label>
                        <input type="number" required min="0" step="0.01" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={isNaN(price) ? "" : price} onChange={e => setPrice(parseFloat(e.target.value))} />
                    </div>

                    {isEdit && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Offer (%)</label>
                            <input type="number" min="0" max="99" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={isNaN(offer) ? "" : offer} onChange={e => setOffer(parseInt(e.target.value))} />
                        </div>
                    )}

                    <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Product</span>
                        </label>
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Images (Min 4)</label>
                        <div className="relative">
                            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                            <Button type="button" variant="outline" size="sm">Add Image</Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((img, idx) => (
                            <div key={idx} className="relative aspect-square border rounded-lg overflow-hidden group">
                                <Image src={img} alt={`Product ${idx}`} fill className="object-cover" />
                                <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                        {images.length === 0 && <p className="text-sm text-gray-500 col-span-4 text-center py-4">No images added yet.</p>}
                    </div>
                </div>

                {/* Variants */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Variants (e.g. 100ml, 200ml)</label>
                        <Button type="button" variant="outline" size="sm" onClick={addVariant}>Add Variant</Button>
                    </div>
                    {variants.map((variant, idx) => (
                        <div key={idx} className="flex gap-4 items-end flex-wrap md:flex-nowrap">
                            <div className="w-full md:flex-1">
                                <label className="block text-xs text-gray-500 mb-1">Volume (e.g. 100ml)</label>
                                <input type="text" required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={variant.name} onChange={e => handleVariantChange(idx, "name", e.target.value)} />
                            </div>
                            <div className="w-1/2 md:w-32">
                                <label className="block text-xs text-gray-500 mb-1">Price (₹)</label>
                                <input type="number" required min="0" step="0.01" className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={isNaN(variant.price) ? "" : variant.price} onChange={e => handleVariantChange(idx, "price", parseFloat(e.target.value))} />
                            </div>
                            <div className="w-1/2 md:w-32">
                                <label className="block text-xs text-gray-500 mb-1">Stock</label>
                                <input type="number" required min="0" className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={isNaN(variant.stock) ? "" : variant.stock} onChange={e => handleVariantChange(idx, "stock", parseInt(e.target.value))} />
                            </div>
                            {variants.length > 1 && (
                                <Button type="button" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => removeVariant(idx)}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t dark:border-gray-800">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Product"}</Button>
                </div>
            </form>

            {/* Cropper Modal */}
            <Modal isOpen={cropModalOpen} onClose={() => setCropModalOpen(false)} className="max-w-2xl w-full p-6">
                <h3 className="text-lg font-bold mb-4">Crop Image</h3>
                <div className="relative h-96 w-full bg-gray-100 rounded-lg overflow-hidden mb-4">
                    {cropImageSrc && (
                        <Cropper
                            image={cropImageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    )}
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setCropModalOpen(false)} disabled={cropping}>Cancel</Button>
                    <Button onClick={handleCropSave} disabled={cropping}>
                        {cropping ? "Cropping..." : "Crop & Upload"}
                    </Button>
                </div>
            </Modal>
        </>
    );
};
