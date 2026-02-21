import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/custom/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/custom/Table";
import { Button } from "@/components/custom/Button";
import { Search, Loader2, ArrowUpDown, Filter, TrendingUp, MapPin, BarChart3, IndianRupee, ChevronDown, Calendar } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface MarketData {
    state: string;
    district: string;
    market: string;
    commodity: string;
    variety: string;
    arrival_date: string;
    min_price: string;
    max_price: string;
    modal_price: string;
}

/* STATIC STATES */
const ALL_STATES = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir",
    "Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
    "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim",
    "Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
];

const MarketRates = () => {
    const [data, setData] = useState<MarketData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [stateFilter, setStateFilter] = useState("");
    const isMobile = useIsMobile();

    const toTitleCase = (str: string) =>
        str.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());

    /* --------------------------------------------------
       FETCH DATA (STATE ONLY, LIMIT=100)
    ---------------------------------------------------*/
    const fetchData = async () => {
        if (!stateFilter) {
            toast.error("Please select a State.");
            return;
        }

        try {
            setIsLoading(true);

            const baseUrl = import.meta.env.VITE_MARKET_RATES_API_URL;
            const apiKey = import.meta.env.VITE_MARKET_RATES_API_KEY;

            const params = new URLSearchParams();
            params.append("api-key", apiKey);
            params.append("format", "json");
            params.append("limit", "100");

            // only state filter now
            params.append("filters[state]", toTitleCase(stateFilter));

            const url = `${baseUrl}?${params.toString()}`;
            console.log("Fetch URL:", url);

            const res = await axios.get(url);
            const records = res.data.records || [];

            setData(records);

            if (records.length === 0) {
                toast.info("No records found for this state.");
            } else {
                toast.success(`Found ${records.length} records.`);
            }

        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to fetch market rates.");
        } finally {
            setIsLoading(false);
        }
    };

    const [sortConfig, setSortConfig] =
        useState<{ key: keyof MarketData; direction: "asc" | "desc" } | null>(null);

    const handleSort = (key: keyof MarketData) => {
        const direction =
            sortConfig && sortConfig.key === key && sortConfig.direction === "asc"
                ? "desc"
                : "asc";

        setSortConfig({ key, direction });

        const sorted = [...data].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setData(sorted);
    };

    /* --------------------------------------------------
       UI
    ---------------------------------------------------*/
    return (
        
            <div className="space-y-6">
                {/* Hero Header */}
                <div className="bg-gradient-to-br from-arylide-yellow/40 via-vanilla to-vanilla/60 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-jonquil/20 transition-all duration-300">
                    <div className="flex flex-col gap-2 sm:gap-3">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-dark-moss flex items-center gap-2 sm:gap-3 flex-wrap">
                            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-olive flex-shrink-0" />
                            <span className="break-words">Market Rates & Prices</span>
                            <span className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl drop-shadow">📊</span>
                        </h1>
                        <p className="text-xs sm:text-sm lg:text-base text-olive/80 font-medium leading-relaxed">
                            Get real-time market rates for agricultural commodities across India
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-2 sm:px-4 max-w-7xl space-y-4 sm:space-y-6">
                    {/* Filters */}
                    <Card className="relative overflow-hidden border-2 border-jonquil/20 hover:border-jonquil/40 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-vanilla to-vanilla/80">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-jonquil/20 to-transparent rounded-full -mr-12 -mt-12" />
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-dark-moss relative z-10">
                                <div className="w-8 h-8 bg-gradient-to-br from-jonquil to-arylide-yellow rounded-xl flex items-center justify-center shadow-md">
                                    <Filter className="w-4 h-4 text-dark-moss" />
                                </div>
                                Search Market Data
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="relative z-10">
                            <div className="flex flex-col gap-4">
                                {/* STATE DROPDOWN */}
                                <div className="w-full">
                                    <label className="text-sm font-medium text-dark-moss mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-olive" />
                                        Select State
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-12 sm:h-10 px-3 pr-10 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive/20 focus:border-olive transition-colors duration-200 appearance-none cursor-pointer"
                                            value={stateFilter}
                                            onChange={(e) => setStateFilter(e.target.value)}
                                        >
                                            <option value="">Choose your state...</option>
                                            {ALL_STATES.map((st, i) => (
                                                <option key={i} value={st}>
                                                    {st}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>

                                {/* BUTTON */}
                                <Button
                                    className="bg-olive hover:bg-olive/90 text-white h-12 sm:h-10 px-6 text-sm font-medium rounded-lg transition-colors duration-200 w-full flex-shrink-0 touch-manipulation flex items-center justify-center gap-2"
                                    onClick={fetchData}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Searching...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-4 h-4" />
                                            <span>Search Market Data</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                </Card>

                    {/* Results */}
                    <Card className="relative overflow-hidden border-2 border-jonquil/20 hover:border-jonquil/40 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-vanilla to-vanilla/80">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-olive/10 to-transparent rounded-full -mr-16 -mt-16" />
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-dark-moss relative z-10">
                                <div className="w-8 h-8 bg-gradient-to-br from-olive to-olive/80 rounded-xl flex items-center justify-center shadow-md">
                                    <TrendingUp className="w-4 h-4 text-white" />
                                </div>
                                Market Price Analysis
                                {data.length > 0 && (
                                    <span className="ml-auto text-xs font-normal bg-olive/10 text-olive px-2 py-1 rounded-full">
                                        {data.length} Records Found
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="relative z-10">
                            {isLoading ? (
                                <div className="text-center py-12 sm:py-16">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-arylide-yellow to-jonquil rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                                        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-dark-moss animate-spin" />
                                    </div>
                                    <p className="text-dark-moss font-medium text-sm sm:text-base">Fetching latest market data...</p>
                                    <p className="text-olive/70 text-xs sm:text-sm mt-1">Please wait while we gather pricing information</p>
                                </div>
                            ) : data.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Mobile Card Layout */}
                                    {isMobile ? (
                                        <div className="grid gap-4">
                                            {data.map((row, i) => (
                                                <div 
                                                    key={i} 
                                                    className="bg-white/90 backdrop-blur-sm border-2 border-border rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-jonquil/40"
                                                >
                                                    <div className="flex flex-col space-y-3">
                                                        {/* Header with location and commodity */}
                                                        <div className="flex justify-between items-start gap-2">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <MapPin className="w-4 h-4 text-olive flex-shrink-0" />
                                                                    <span className="font-semibold text-dark-moss text-sm truncate">{row.state}</span>
                                                                </div>
                                                                <p className="text-xs text-dark-moss/70 truncate">{row.district} • {row.market}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="bg-olive/10 text-olive font-semibold text-xs px-2 py-1 rounded-full">
                                                                    {row.commodity}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Variety and Date */}
                                                        <div className="flex items-center gap-4 text-xs text-dark-moss/70">
                                                            <span className="truncate">{row.variety}</span>
                                                            <div className="flex items-center gap-1 text-olive">
                                                                <Calendar className="w-3 h-3" />
                                                                <span className="whitespace-nowrap">{row.arrival_date}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Price Information */}
                                                        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border/30">
                                                            <div className="text-center">
                                                                <p className="text-xs text-dark-moss/60 mb-1">Min Price</p>
                                                                <p className="text-sm font-semibold text-olive flex items-center justify-center gap-1">
                                                                    <IndianRupee className="w-3 h-3" />₹{row.min_price}
                                                                </p>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-xs text-dark-moss/60 mb-1">Max Price</p>
                                                                <p className="text-sm font-semibold text-olive flex items-center justify-center gap-1">
                                                                    <IndianRupee className="w-3 h-3" />₹{row.max_price}
                                                                </p>
                                                            </div>
                                                            <div className="text-center bg-jonquil/10 rounded-lg py-2">
                                                                <p className="text-xs text-dark-moss/60 mb-1">Modal Price</p>
                                                                <p className="text-sm font-bold text-dark-moss flex items-center justify-center gap-1">
                                                                    <IndianRupee className="w-3 h-3" />₹{row.modal_price}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* Desktop Table Layout */
                                        <div className="rounded-xl border-2 border-border overflow-hidden bg-white/80 backdrop-blur-sm">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-gradient-to-r from-vanilla to-arylide-yellow/30 hover:from-arylide-yellow/20 hover:to-vanilla border-b-2 border-border">
                                                            <TableHead 
                                                                onClick={() => handleSort("state")} 
                                                                className="font-semibold text-dark-moss cursor-pointer hover:text-olive transition-colors duration-200 min-w-[120px]"
                                                            >
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="w-4 h-4" />
                                                                    State 
                                                                    <ArrowUpDown className="w-3 h-3 ml-1" />
                                                                </div>
                                                            </TableHead>
                                                            <TableHead 
                                                                onClick={() => handleSort("district")} 
                                                                className="font-semibold text-dark-moss cursor-pointer hover:text-olive transition-colors duration-200 min-w-[100px]"
                                                            >
                                                                District <ArrowUpDown className="inline w-3 h-3 ml-1" />
                                                            </TableHead>
                                                            <TableHead 
                                                                onClick={() => handleSort("market")} 
                                                                className="font-semibold text-dark-moss cursor-pointer hover:text-olive transition-colors duration-200 min-w-[120px]"
                                                            >
                                                                Market <ArrowUpDown className="inline w-3 h-3 ml-1" />
                                                            </TableHead>
                                                            <TableHead 
                                                                onClick={() => handleSort("commodity")} 
                                                                className="font-semibold text-dark-moss cursor-pointer hover:text-olive transition-colors duration-200 min-w-[120px]"
                                                            >
                                                                Commodity <ArrowUpDown className="inline w-3 h-3 ml-1" />
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-dark-moss min-w-[100px]">Variety</TableHead>
                                                            <TableHead className="font-semibold text-dark-moss min-w-[110px]">Arrival Date</TableHead>
                                                            <TableHead className="font-semibold text-dark-moss min-w-[100px]">
                                                                <div className="flex items-center gap-1">
                                                                    <IndianRupee className="w-4 h-4 text-olive" />
                                                                    Min Price
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-dark-moss min-w-[100px]">
                                                                <div className="flex items-center gap-1">
                                                                    <IndianRupee className="w-4 h-4 text-olive" />
                                                                    Max Price
                                                                </div>
                                                            </TableHead>
                                                            <TableHead className="font-semibold text-dark-moss min-w-[110px]">
                                                                <div className="flex items-center gap-1">
                                                                    <IndianRupee className="w-4 h-4 text-olive" />
                                                                    Modal Price
                                                                </div>
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>

                                                    <TableBody>
                                                        {data.map((row, i) => (
                                                            <TableRow 
                                                                key={i} 
                                                                className="hover:bg-vanilla/40 transition-colors duration-200 border-b border-border/50"
                                                            >
                                                                <TableCell className="font-medium text-dark-moss">{row.state}</TableCell>
                                                                <TableCell className="text-dark-moss/80">{row.district}</TableCell>
                                                                <TableCell className="text-dark-moss/80 font-medium">{row.market}</TableCell>
                                                                <TableCell className="text-olive font-semibold">{row.commodity}</TableCell>
                                                                <TableCell className="text-dark-moss/70 text-sm">{row.variety}</TableCell>
                                                                <TableCell className="text-dark-moss/70 text-sm">{row.arrival_date}</TableCell>
                                                                <TableCell className="text-olive font-semibold">₹{row.min_price}</TableCell>
                                                                <TableCell className="text-olive font-semibold">₹{row.max_price}</TableCell>
                                                                <TableCell className="text-dark-moss font-bold bg-jonquil/10 rounded-lg">₹{row.modal_price}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12 sm:py-16">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-vanilla to-arylide-yellow rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-olive" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-semibold text-dark-moss mb-2">Ready to View Market Data</h3>
                                    <p className="text-olive/70 max-w-md mx-auto text-sm sm:text-base px-4">
                                        Select a state from the dropdown above to view the latest agricultural commodity prices and market rates from mandis across India.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        
    );
};

export default MarketRates;
