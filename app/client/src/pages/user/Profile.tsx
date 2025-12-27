import React from 'react';
import { useAuth } from '../../lib/auth'; // Assuming you have a custom hook for auth
import { User } from 'lucide-react';

const Profile = () => {
    // const { user } = useAuth(); // Example of getting user data

    // Placeholder user data
    const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.edu',
        collegeId: 'ID123456',
        role: { name: 'Student' }
    };

    if (!user) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
                    <p className="mt-1 text-sm text-gray-600">
                        This information is private and will not be shared publicly.
                    </p>
                </div>
                <div className="md:col-span-2">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <p className="mt-1 text-lg text-gray-900">{user.firstName} {user.lastName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <p className="mt-1 text-lg text-gray-900">{user.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">College ID</label>
                            <p className="mt-1 text-lg text-gray-900">{user.collegeId}</p>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <p className="mt-1 text-lg text-gray-900 capitalize">{user.role.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Password</h3>
                    <p className="mt-1 text-sm text-gray-600">
                        Update your password here.
                    </p>
                </div>
                <div className="md:col-span-2">
                    <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
