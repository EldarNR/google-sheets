// types
import type {ApiResponse, Filters} from "./type";
// config
import {SCRIPT_URL} from "./config";

export async function fetchGoods(filters: Filters): Promise<ApiResponse> {
    const params = new URLSearchParams({ action: "getAll" });

    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.minWeight) params.append("minWeight", filters.minWeight);
    if (filters.maxWeight) params.append("maxWeight", filters.maxWeight);

    const url = `${SCRIPT_URL}?${params.toString()}`;
    console.log("🔍 Запрос:", url);

    const res = await fetch(url);
    return await res.json();
}

// Запрос статистики
export async function fetchStats(): Promise<ApiResponse> {
    const res = await fetch(`${SCRIPT_URL}?action=getStats`);
    return await res.json();
}
