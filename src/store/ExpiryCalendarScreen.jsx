import React, { useState, useEffect } from 'react';
import storeService from '../services/storeService';

const ExpiryCalendarScreen = ({ batches: initialBatches }) => {
    const [batches, setBatches] = useState(initialBatches || []);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadExpiryData = async () => {
            try {
                // Get expiring products for the next 90 days
                const startDate = new Date().toISOString().split('T')[0];
                const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                const expiryData = await storeService.getExpiryCalendar(startDate, endDate);
                setBatches(expiryData);
            } catch (err) {
                console.error('Error loading expiry data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadExpiryData();
    }, []);

    const today = new Date('2026-01-11');
    const monthDates = {};

    batches.forEach(batch => {
        const date = new Date(batch.expiry_date);
        const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

        let status = 'safe';
        if (date < today) status = 'expired';
        else if (date < thirtyDaysLater) status = 'near-expiry';

        const dateStr = batch.expiry_date;
        if (!monthDates[dateStr]) monthDates[dateStr] = { safe: 0, 'near-expiry': 0, expired: 0, items: [] };
        monthDates[dateStr][status]++;
        monthDates[dateStr].items.push(batch);
    });

    const sortedDates = Object.keys(monthDates).sort();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Expiry Calendar View</h2>
                <p className="text-gray-600 mt-1">Monitor inventory by expiry date</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-700"><strong>Green:</strong> Safe ({'>'}30 days)</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-sm text-gray-700"><strong>Yellow:</strong> Near Expiry ({'≤'}30 days)</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm text-gray-700"><strong>Red:</strong> Expired</span>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Expiry Date</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Item Details</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sortedDates.map((dateStr) => {
                            const dateData = monthDates[dateStr];
                            const date = new Date(dateStr);
                            const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

                            let bgColor = 'bg-green-50';
                            let statusColor = 'bg-green-100 text-green-800';
                            let statusText = 'Safe';

                            if (date < today) {
                                bgColor = 'bg-red-50';
                                statusColor = 'bg-red-100 text-red-800';
                                statusText = 'Expired';
                            } else if (date < thirtyDaysLater) {
                                bgColor = 'bg-yellow-50';
                                statusColor = 'bg-yellow-100 text-yellow-800';
                                statusText = 'Near Expiry';
                            }

                            return (
                                <tr key={dateStr} className={bgColor}>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{dateStr}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="space-y-1">
                                            {dateData.items.map((item, idx) => (
                                                <div key={idx} className="text-xs">
                                                    {item.batch_code} - {item.qty} units
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>{statusText}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpiryCalendarScreen;
