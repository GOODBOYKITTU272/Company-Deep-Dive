import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useJobListings } from '../hooks/useJobListings';

export function JobListings() {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    const { jobData, roles, loading, error } = useJobListings(selectedDate);

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Navigate dates
    const goToPreviousDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate.toISOString().split('T')[0]);
    };

    const goToNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate.toISOString().split('T')[0]);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading job listings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-red-800 font-semibold text-lg mb-2">Error loading job data</h3>
                    <p className="text-red-700 text-sm">{error.message}</p>
                </div>
            </div>
        );
    }

    const currentRole = selectedRole || roles[0];
    const currentRoleGroup = currentRole && jobData ? jobData[currentRole] : null;
    const currentJobs = currentRoleGroup?.jobs || [];

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            Manage Job Roles
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                            + Upload Jobs
                        </button>
                    </div>
                </div>

                {/* Date Navigation */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={goToPreviousDay}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous Day
                    </button>
                    <div className="flex items-center gap-2 px-6 py-2 bg-gray-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{formatDate(selectedDate)}</span>
                    </div>
                    <button
                        onClick={goToNextDay}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Next Day
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Roles List */}
                <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="p-4">
                        <h2 className="text-sm font-semibold text-gray-900 mb-3">Jobs by Role</h2>
                        {roles.length === 0 ? (
                            <p className="text-sm text-gray-500">No roles found for this date.</p>
                        ) : (
                            <div className="space-y-1">
                                {roles.map((role) => {
                                    const jobCount = jobData?.[role]?.count || 0;
                                    return (
                                        <button
                                            key={role}
                                            onClick={() => setSelectedRole(role)}
                                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${currentRole === role
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="text-sm font-medium truncate">{role}</span>
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full ml-2">
                                                {jobCount} jobs
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Job Details */}
                <div className="flex-1 overflow-y-auto p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">{currentRole || 'Jobs'} Jobs</h2>

                    {currentJobs.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No jobs found for this role</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {currentJobs.map((job, index) => (
                                <div
                                    key={`${job.id}-${index}`}
                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">{job.job_title}</h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {job.company_name} • {job.location}
                                            </p>
                                            {job.experience_required && (
                                                <p className="text-sm text-gray-500">
                                                    {job.experience_required} years experience required
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-2 ml-4">
                                            {job.posted_date && (
                                                <span className="text-xs text-gray-500">
                                                    {new Date(job.posted_date).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            )}
                                            <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                                PENDING
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
