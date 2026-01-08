"use client";
import React, { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

interface OfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (offer: number) => Promise<void>;
    currentOffer: number;
}

export const OfferModal: React.FC<OfferModalProps> = ({ isOpen, onClose, onSave, currentOffer }) => {
    const [offer, setOffer] = useState(currentOffer);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(offer);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Manage Offer</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Offer Percentage (0-99%)
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="99"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                        value={offer}
                        onChange={(e) => setOffer(Number(e.target.value))}
                        required
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
                    <Button variant="primary" type="submit" disabled={loading}>{loading ? "Saving..." : "Save Offer"}</Button>
                </div>
            </form>
        </Modal>
    );
};
