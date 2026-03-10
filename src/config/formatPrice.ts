export const formatPrice = (price: number | undefined): string => {
    if (!price && price !== 0) return "$0";
    return price.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
};