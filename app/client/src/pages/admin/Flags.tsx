import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Flag as FlagModel } from '../../../models';
import { Loader2, Eye, Archive, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Flags = () => {
    const [flags, setFlags] = useState<FlagModel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlags = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/admin/flags?status=open');
                if (Array.isArray(data.flags)) {
                    setFlags(data.flags);
                }
            } catch (err) {
                console.error('Failed to fetch flags:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFlags();
    }, []);

    const handleResolveFlag = async (flagId: number) => {
        setFlags(flags.filter(f => f.id !== flagId));
        try {
            await api.patch(`/admin/flags/${flagId}/status`, { status: 'resolved' });
        } catch (err) {
            console.error('Failed to resolve flag:', err);
            // TODO: Revert state on error
        }
    };
    
    const handleArchiveResource = async (resourceId: number) => {
        // This might resolve all flags for this resource
        setFlags(flags.filter(f => f.resourceId !== resourceId));
        try {
            await api.patch(`/admin/resources/${resourceId}/archive`);
        } catch (err) {
            console.error('Failed to archive resource:', err);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
    }

    return (
        <div>
            {flags.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-lg border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {flags.map((flag) => (
                                <tr key={flag.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <Link to={`/resources/${flag.resourceId}`} className="hover:text-indigo-600">{flag.resource.title}</Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{flag.reason}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{flag.reporter.firstName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Link to={`/resources/${flag.resourceId}`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900"><Eye className="h-4 w-4" />View</Link>
                                        <button onClick={() => handleArchiveResource(flag.resourceId)} className="inline-flex items-center gap-1 text-yellow-600 hover:text-yellow-900"><Archive className="h-4 w-4" />Archive</button>
                                        <button onClick={() => handleResolveFlag(flag.id)} className="inline-flex items-center gap-1 text-green-600 hover:text-green-900"><ShieldCheck className="h-4 w-4" />Resolve</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <Flag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-800">No Open Flags</h3>
                    <p className="mt-1 text-sm text-gray-500">All reported content has been reviewed.</p>
                </div>
            )}
        </div>
    );
};

export default Flags;
