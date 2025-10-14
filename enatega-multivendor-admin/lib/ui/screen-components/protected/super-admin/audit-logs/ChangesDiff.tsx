'use client';
import React, { useState } from 'react';
import { Button } from 'primereact/button';

interface ChangesDiffProps {
    changes: JSON;
}

const ChangesDiff: React.FC<ChangesDiffProps> = ({ changes }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!changes) {
        return null;
    }

    const parsedChanges = typeof changes === 'string' ? JSON.parse(changes) : changes;
    const changeKeys = Object.keys(parsedChanges);

    // Check if this is a comparison between old and new
    const isComparison = changeKeys.length === 2 && changeKeys.some(k => k.startsWith('old')) && changeKeys.some(k => k.startsWith('new'));

    const renderValue = (value: JSON) => {
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value, null, 2);
        }
        return String(value);
    };

    if (isComparison) {
        const oldDataKey = changeKeys.find(k => k.startsWith('old'))!;
        const newDataKey = changeKeys.find(k => k.startsWith('new'))!;
        const oldData = parsedChanges[oldDataKey];
        const newData = parsedChanges[newDataKey];

        const diffs = Object.keys(newData).reduce((acc, key) => {
            if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
                acc[key] = {
                    old: oldData[key],
                    new: newData[key],
                };
            }
            return acc;
        }, {} as Record<string, { old: JSON; new: JSON }>);

        if (Object.keys(diffs).length === 0) {
            return <p className="text-sm text-gray-500">No differences found in data.</p>;
        }

        return (
            <div>
                <Button
                    label={isExpanded ? 'Read Less' : 'Read More'}
                    link
                    className="p-0 mb-2 text-sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                />
                {isExpanded && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <pre className="whitespace-pre-wrap text-xs font-mono">
                            {Object.entries(diffs).map(([key, value]) => (
                                <div key={key} className="mb-2">
                                    <strong className="font-semibold text-gray-700">{key}:</strong>
                                    <div className="flex gap-2 mt-1">
                                        <div className="text-red-700 bg-red-50 p-2 rounded-md w-1/2 border border-red-100"><strong>Old:</strong> {renderValue(value.old)}</div>
                                        <div className="text-green-700 bg-green-50 p-2 rounded-md w-1/2 border border-green-100"><strong>New:</strong> {renderValue(value.new)}</div>
                                    </div>
                                </div>
                            ))}
                        </pre>
                    </div>
                )}
            </div>
        );
    } else {
        // For create, delete, or other non-comparison logs, just display the data.
        return (
            <div>
                <Button
                    label={isExpanded ? 'Hide Details' : 'Show Details'}
                    link
                    className="p-0 mb-2 text-sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                />
                {isExpanded && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <pre className="whitespace-pre-wrap text-xs font-mono">
                            {renderValue(parsedChanges)}
                        </pre>
                    </div>
                )}
            </div>
        );
    }
};

export default ChangesDiff;
