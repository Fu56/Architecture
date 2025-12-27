import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function Users() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { (async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } finally {
            setLoading(false);
        }
    })(); }, []);

    const update = async (id: string, role: string, isActive: boolean) => {
        const { data } = await api.patch(`/admin/users/${id}`, { role, isActive });
        setUsers((u) => u.map((x) => (x._id === id ? data : x)));
    };

    if (loading) return <div className="p-4">Loading users...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Manage users</h2>
            <div className="bg-white rounded border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-3 font-medium text-gray-600">User</th>
                            <th className="p-3 font-medium text-gray-600">Role</th>
                            <th className="p-3 font-medium text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map((u) => (
                            <tr key={u._id} className="hover:bg-gray-50">
                                <td className="p-3">
                                    <p className="font-medium">{u.name}</p>
                                    <p className="text-xs text-gray-500">{u.email} • {u.collegeId}</p>
                                </td>
                                <td className="p-3">
                                    <select 
                                        className="border p-1 rounded text-sm bg-white" 
                                        value={u.role} 
                                        onChange={(e) => update(u._id, e.target.value, u.isActive)}
                                    >
                                        <option value="student">Student</option>
                                        <option value="faculty">Faculty</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="p-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="rounded text-blue-600"
                                            checked={u.isActive} 
                                            onChange={(e) => update(u._id, u.role, e.target.checked)} 
                                        />
                                        <span className={u.isActive ? 'text-green-600' : 'text-red-600'}>
                                            {u.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
