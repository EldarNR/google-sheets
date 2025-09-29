export interface Filters {
    minPrice: string;
    maxPrice: string;
    minWeight: string;
    maxWeight: string;
}

export interface Good {
    id: number;
    weight: number;
    pricePerKg: number;
    totalCost: number;
}

export interface Stats {
    totalItems: number;
    totalWeight: number;
    totalCost: number;
    avgPrice: number;
}

export interface ApiResponse {
    success: boolean;
    goods?: Good[];
    stats?: Stats;
    timestamp?: string;
    error?: string;
    appliedFilters?: {
        minPrice: number | null;
        maxPrice: number | null;
        minWeight: number | null;
        maxWeight: number | null;
    };
}
