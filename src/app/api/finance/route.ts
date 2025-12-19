import { NextResponse } from 'next/server';

export const revalidate = 0; // Disable cache for real-time data

async function fetchNaverStock(url: string) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        // Handle different structures if necessary
        // KOSPI/NASDAQ: data is the object
        // Exchange: data.result is the object
        const result = data.result || data;

        // Helper to clean and parse numbers
        const parseVal = (val: any) => {
            if (!val) return 0;
            return parseFloat(String(val).replace(/,/g, '').replace(/%/g, ''));
        };

        const price = parseVal(result.closePrice || result.calcPrice);
        const changePercent = parseVal(result.fluctuationsRatio);
        const change = parseVal(result.compareToPreviousClosePrice || result.fluctuationAmount);

        // If change is missing but we have percent, calculate it roughly
        // price = prev * (1 + percent/100) => prev = price / (1 + percent/100) => change = price - prev
        let calculatedChange = change;
        if (!calculatedChange && changePercent !== 0) {
            const prev = price / (1 + changePercent / 100);
            calculatedChange = price - prev;
        }

        return {
            price,
            change: calculatedChange,
            changePercent,
        };
    } catch (e) {
        console.error(`Error fetching ${url}:`, e);
        return null;
    }
}

export async function GET() {
    try {
        const [kospi, nasdaq, usdkrw, cnykrw] = await Promise.all([
            fetchNaverStock('https://m.stock.naver.com/api/index/KOSPI/basic'),
            fetchNaverStock('https://api.stock.naver.com/index/.IXIC/basic'),
            fetchNaverStock('https://m.stock.naver.com/front-api/marketIndex/productDetail?category=exchange&reutersCode=FX_USDKRW'),
            fetchNaverStock('https://m.stock.naver.com/front-api/marketIndex/productDetail?category=exchange&reutersCode=FX_CNYKRW'),
        ]);

        const safeData = (data: any) => ({
            price: data?.price || 0,
            change: data?.change || 0,
            changePercent: data?.changePercent || 0,
        });

        const data = {
            kospi: safeData(kospi),
            nasdaq: safeData(nasdaq),
            usdkrw: safeData(usdkrw),
            cnykrw: safeData(cnykrw),
        };

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching finance data:', error);
        return NextResponse.json({ error: 'Failed to fetch data', details: error.message }, { status: 500 });
    }
}
