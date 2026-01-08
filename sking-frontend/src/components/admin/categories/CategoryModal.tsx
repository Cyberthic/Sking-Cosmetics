"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; description: string }) => Promise<void>;
    initialData?: { name: string; description: string };
    title: string;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    title,
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName(initialData?.name || "");
            setDescription(initialData?.description || "");
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;
        setLoading(true);
        try {
            await onSave({ name, description });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">{title}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                    </label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        minLength={3}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                    </label>
                    <textarea
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} type="button">
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
