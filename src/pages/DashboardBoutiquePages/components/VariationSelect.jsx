// components/VariationSelect.jsx
import { useEffect, useState } from "react";
import useVariationStore from "../stores/variation.store";

const VariationSelect = ({ 
    onVariationChange, 
    selectedVariation, 
    placeholder = "Sélectionnez une variation",
    className = "" 
}) => {
    const { variations, fetchVariations, loading } = useVariationStore();
    const [localVariations, setLocalVariations] = useState([]);

    useEffect(() => {
        fetchVariations();
    }, [fetchVariations]);

    useEffect(() => {
        if (variations.length > 0) {
            setLocalVariations(variations);
        }
    }, [variations]);

    const handleChange = (e) => {
        const variationId = e.target.value;
        const selected = localVariations.find(v => v.hashid === variationId);
        onVariationChange(selected || null);
    };

    if (loading) {
        return (
            <div className={`animate-pulse ${className}`}>
                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
            </div>
        );
    }

    return (
        <select
            value={selectedVariation?.hashid || ""}
            onChange={handleChange}
            className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white ${className}`}
        >
            <option value="">{placeholder}</option>
            {localVariations.map((variation) => (
                <option key={variation.hashid} value={variation.hashid}>
                    {variation.nom_variation}
                    {variation.valeurs?.length > 0 && ` (${variation.valeurs.length} libellés)`}
                </option>
            ))}
        </select>
    );
};

export default VariationSelect;