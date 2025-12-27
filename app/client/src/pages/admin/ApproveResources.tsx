import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

const ApproveResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/admin/resources/pending');
                setResources(data);
            } catch (err) {
                setError('Failed to fetch resources for approval.');
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            await api.patch(`/admin/resources/${id}/approve`);
            setResources(resources.filter((r: any) => r.id !== id));
        } catch (err) {
            console.error('Failed to approve resource');
        }
    };

    const handleReject = async (id: number) => {
        try {
            await api.patch(`/admin/resources/${id}/reject`);
            setResources(resources.filter((r: any) => r.id !== id));
        } catch (err) {
            console.error('Failed to reject resource');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Approve Resources</h2>
            <div className="space-y-4">
                {resources.map((resource: any) => (
                    <div key={resource.id} className="p-4 border rounded-lg bg-white flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold">{resource.title}</h3>
                            <p className="text-sm text-gray-600">{resource.uploader.first_name} {resource.uploader.last_name}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleApprove(resource.id)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Approve</button>
                            <button onClick={() => handleReject(resource.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApproveResources;
