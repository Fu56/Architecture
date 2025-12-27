import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Resource } from '../../models';
import { Loader2, Check, X, Download, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Approvals = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPendingResources = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/admin/resources?status=pending');
                if (Array.isArray(data.resources)) {
                    setResources(data.resources);
                }
            } catch (err) {
                console.error('Failed to fetch pending resources:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPendingResources();
    }, []);

    const handleDecision = async (resourceId: number, status: 'approved' | 'rejected') => {
        // Optimistic update
        setResources(resources.filter(r => r.id !== resourceId));
        try {
            await api.patch(`/admin/resources/${resourceId}/status`, { status });
        } catch (err) {
            // TODO: Add error handling and potentially revert state
            console.error(`Failed to set status to ${status}:`, err);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
    }

    return (
        <div>
            {resources.length > 0 ? (
                <div className="space-y-4">
                    {resources.map(resource => (
                        <div key={resource.id} className="bg-gray-50 p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-4 sm:mb-0">
                                <Link to={`/resources/${resource.id}`} className="font-bold text-lg text-gray-900 hover:text-indigo-600">{resource.title}</Link>
                                <p className="text-sm text-gray-600">
                                    Uploaded by {resource.uploader.firstName} on {new Date(resource.uploadedAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex-shrink-0 flex gap-2">
                                <a href={`${import.meta.env.VITE_API_URL}/resources/${resource.id}/download`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                    <Download className="h-4 w-4" /> Review
                                </a>
                                <button onClick={() => handleDecision(resource.id, 'approved')} className="inline-flex items-center gap-2 px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                                    <Check className="h-4 w-4" /> Approve
                                </button>
                                <button onClick={() => handleDecision(resource.id, 'rejected')} className="inline-flex items-center gap-2 px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                                    <X className="h-4 w-4" /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-800">Approval Queue is Empty</h3>
                    <p className="mt-1 text-sm text-gray-500">No new resources are waiting for review.</p>
                </div>
            )}
        </div>
    );
};

export default Approvals;
