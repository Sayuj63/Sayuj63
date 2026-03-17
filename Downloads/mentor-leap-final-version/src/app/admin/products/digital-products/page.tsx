"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Loader } from "@/components/ui/Loader";

export default function DigitalProductsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // Fetch real data here
        setTimeout(() => {
            setData([]); // Empty dynamic array
            setLoading(false);
        }, 800);
    }, []);

    if (loading) return <div className="p-20 flex justify-center"><Loader /></div>;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <h1 className="text-3xl font-black mb-6 tracking-tight text-white capitalize">digital products</h1>
            <Card className="!p-8 bg-white/[0.03] border-white/10">
                {data.length === 0 ? (
                    <p className="text-[#94a3b8]">No records found.</p>
                ) : (
                    <ul>
                        {data.map((item, i) => <li key={i}>{JSON.stringify(item)}</li>)}
                    </ul>
                )}
            </Card>
        </div>
    );
}
