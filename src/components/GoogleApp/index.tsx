// libraries
import { useState, useEffect } from "react";
// icons
import {RefreshCw,Filter,TrendingUp,Package,DollarSign,Weight} from "lucide-react";
// api
import {fetchGoods, fetchStats} from "../../api/fetchGoods/fetchGoods";
// type
import type {Good, Stats, Filters} from '../../api/fetchGoods/type';
// style
import "../../style/components/googleApp.css";

const GoodsApp = () => {
    const [goods, setGoods] = useState<Good[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [lastUpdate, setLastUpdate] = useState<string>("");

    const [filters, setFilters] = useState<Filters>({
        minPrice: "",
        maxPrice: "",
        minWeight: "",
        maxWeight: "",
    });

    useEffect(() => {
        loadGoods();
        loadStats();

        const interval = setInterval(() => {
            loadGoods();
            loadStats();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const loadGoods = async (customFilters: Filters = filters): Promise<void> => {
        setLoading(true);
        setError("");
        try {
            const data = await fetchGoods(customFilters);

            if (data.success) {
                setGoods(data.goods || []);
                if (data.timestamp)
                    setLastUpdate(new Date(data.timestamp).toLocaleString("ru-RU"));
            } else {
                throw new Error(data.error || "Ошибка загрузки данных");
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Неизвестная ошибка";
            setError(`Ошибка загрузки: ${msg}`);
            setGoods([]);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async (): Promise<void> => {
        try {
            const data = await fetchStats();
            if (data.success && data.stats) setStats(data.stats);
        } catch (err) {
            console.error("Ошибка загрузки статистики:", err);
        }
    };

    const handleFilterChange = (field: keyof Filters, value: string): void => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="goods-app">
            <div className="header-card">
                <div>
                    <h1>📊 Учёт товаров</h1>
                    <p>Данные из Google Sheets в реальном времени</p>
                    <small>Автообновление каждые 30 секунд</small>
                </div>
                <button
                    onClick={() => {
                        loadGoods();
                        loadStats();
                    }}
                    disabled={loading}
                    className="refresh-btn"
                >
                    <RefreshCw className={loading ? "spin" : ""} /> Обновить
                </button>
            </div>

            {stats && (
                <div className="stats-grid">
                    <div className="stat blue">
                        <Package /> <TrendingUp />
                        <div className="stat-value">{stats.totalItems}</div>
                        <div className="stat-label">Всего товаров</div>
                    </div>
                    <div className="stat green">
                        <Weight />
                        <div className="stat-value">{stats.totalWeight} кг</div>
                        <div className="stat-label">Общий вес</div>
                    </div>
                    <div className="stat purple">
                        <DollarSign />
                        <div className="stat-value">
                            {stats.totalCost.toLocaleString()} ₸
                        </div>
                        <div className="stat-label">Общая стоимость</div>
                    </div>
                    <div className="stat orange">
                        <TrendingUp />
                        <div className="stat-value">
                            {stats.avgPrice.toLocaleString()} ₸
                        </div>
                        <div className="stat-label">Средняя цена/кг</div>
                    </div>
                </div>
            )}

            <div className="filters-card">
                <div className="filters-header">
                    <Filter /> Фильтры
                </div>
                <div className="filters-grid">
                    <input
                        type="number"
                        placeholder="Мин. цена"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Макс. цена"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Мин. вес"
                        value={filters.minWeight}
                        onChange={(e) => handleFilterChange("minWeight", e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Макс. вес"
                        value={filters.maxWeight}
                        onChange={(e) => handleFilterChange("maxWeight", e.target.value)}
                    />
                </div>
                <div className="filters-actions">
                    <button onClick={() => loadGoods(filters)} className="apply-btn">
                        Применить
                    </button>
                    <button
                        onClick={() =>
                            setFilters({
                                minPrice: "",
                                maxPrice: "",
                                minWeight: "",
                                maxWeight: "",
                            })
                        }
                        className="reset-btn"
                    >
                        Сбросить
                    </button>
                </div>
            </div>

            <div className="table-info">
                <span>Найдено товаров: {goods.length}</span> |{" "}
                <span>Обновлено: {lastUpdate || "—"}</span>
                {loading && <span className="loading">⏳ Загрузка...</span>}
            </div>

            {error && <div className="error-box">❌ {error}</div>}

            <div className="table-wrapper">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Вес (кг)</th>
                        <th>Цена за 1кг (₸)</th>
                        <th>Стоимость (₸)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {goods.length === 0 ? (
                        <tr>
                            <td colSpan={4}>
                                {loading ? "⏳ Загрузка данных..." : "😔 Товары не найдены"}
                            </td>
                        </tr>
                    ) : (
                        goods.map((item, i) => (
                            <tr key={item.id} className={i % 2 === 0 ? "even" : "odd"}>
                                <td>
                                    <span className="tag">#{item.id}</span>
                                </td>
                                <td>{item.weight.toFixed(1)} кг</td>
                                <td>{item.pricePerKg.toLocaleString()} ₸</td>
                                <td>
                                    <strong>{item.totalCost.toLocaleString()} ₸</strong>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GoodsApp;
