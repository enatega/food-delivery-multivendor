
'use client';
import React from 'react';
import { Tag } from 'primereact/tag';
import moment from 'moment';
import ChangesDiff from './ChangesDiff';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faPlusCircle, faTrashAlt, faHistory } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';

export interface AuditLog {
    _id: string;
    timestamp: string;
    admin: {
        _id: string;
        email: string;
    };
    action: string;
    targetType: string;
    targetId: string;
    changes: JSON;
}

interface AuditLogCardProps {
    log: AuditLog;
    isLast: boolean;
}

const AuditLogCard: React.FC<AuditLogCardProps> = ({ log, isLast }) => {
    const t = useTranslations()

    const getActionDetails = (action: string) => {
        const lowerAction = action.toLowerCase();
        if (lowerAction.includes('delete')) return { icon: faTrashAlt, color: 'text-red-500', bgColor: 'bg-red-100' };
        if (lowerAction.includes('create')) return { icon: faPlusCircle, color: 'text-primary-dark', bgColor: 'bg-primary-color ' };
        if (lowerAction.includes('edit')) return { icon: faPencilAlt, color: 'text-blue-500', bgColor: 'bg-blue-100' };
        return { icon: faHistory, color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-300' };
    };

    const { icon, color, bgColor } = getActionDetails(log.action);

    return (
        <div className="relative pl-12 py-4">
            {/* Timeline line */}
            {!isLast && <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-dark-600"></div>}

            {/* Timeline icon */}
            <div className={`absolute left-0 top-6 w-12 h-12 flex items-center justify-center rounded-full ${bgColor}`}>
                <FontAwesomeIcon icon={icon} className={`h-5 w-5 ${color}`} />
            </div>

            <div className="ml-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-lg text-gray-800 dark:text-white">API: {log.action}</p>
                        <p className="text-sm text-gray-500 dark:text-white">
                            {t("Performed_by")} <span className="font-semibold dark:text-white text-gray-700">{log.admin.email}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-white">{moment.utc(log.timestamp).local().format('MMMM D, YYYY')}</p>
                        <p className="text-xs text-gray-400 dark:text-white">{moment.utc(log.timestamp).local().format('h:mm A')}</p>
                    </div>
                </div>

                <div className="mt-3 bg-white dark:bg-dark-950 p-4 rounded-lg border border-gray-200 dark:border-dark-600">
                    <div className="flex items-center gap-2 mb-3">
                        <Tag value={log.targetType} severity="info" />
                        <span className="text-gray-500 dark:text-white font-mono text-xs">{log.targetId}</span>
                    </div>
                    <ChangesDiff changes={log.changes} />
                </div>
            </div>
        </div>
    );
};

export default AuditLogCard;
