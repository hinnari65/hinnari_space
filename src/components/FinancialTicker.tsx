'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FinanceData {
    kospi: { price: number; change: number; changePercent: number };
    nasdaq: { price: number; change: number; changePercent: number };
    usdkrw: { price: number; change: number; changePercent: number };
    cnykrw: { price: number; change: number; changePercent: number };
}

export default function FinancialTicker() {
    const [data, setData] = useState<FinanceData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/finance');
                if (!res.ok) throw new Error('Failed to fetch');
                const jsonData = await res.json();
                setData(jsonData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    if (loading || !data) return <div className="h-8 bg-gray-800/30 rounded-lg animate-pulse" />;

    const formatNumber = (num: number, digits = 2) => num.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
    const formatChange = (change: number, percent: number) => {
        const color = change > 0 ? 'text-red-400' : change < 0 ? 'text-blue-400' : 'text-gray-400';
        const sign = change > 0 ? '+' : '';
        return <span className={`${color} text-xs ml-1`}>{sign}{formatNumber(change)} ({sign}{formatNumber(percent)}%)</span>;
    };

    const items = [
        { label: 'KOSPI', value: data.kospi.price, change: data.kospi.change, percent: data.kospi.changePercent },
        { label: 'NASDAQ', value: data.nasdaq.price, change: data.nasdaq.change, percent: data.nasdaq.changePercent },
        { label: 'USD/KRW', value: data.usdkrw.price, change: data.usdkrw.change, percent: data.usdkrw.changePercent },
        { label: 'CNY/KRW', value: data.cnykrw.price, change: 0, percent: 0, isCalc: true }, // Calculated, no change data
    ];

    return (
        <div className="w-full overflow-hidden bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl py-2 px-4 mb-4 flex items-center">
            <div className="flex space-x-6 animate-marquee whitespace-nowrap">
                {[...items, ...items].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-gray-300">{item.label}</span>
                        <span className="text-sm font-mono text-white">{formatNumber(item.value)}</span>
                        {!item.isCalc && formatChange(item.change, item.percent)}
                    </div>
                ))}
            </div>
            {/* Add CSS for marquee animation if not present in globals */}
            <style jsx>{`
        .animate-marquee {
          display: flex;
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        /* Pause on hover */
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
}
