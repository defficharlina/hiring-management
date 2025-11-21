import { useState, useEffect } from 'react';
import { AdminJobList as AdminJobListComponent, CreateJobModal } from '../../components';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { message } from 'antd';

interface AdminJob {
    id: string;
    title: string;
    salaryMin: number;
    salaryMax: number;
    status: 'active' | 'inactive' | 'draft';
    startDate: string;
    applicants: Array<{ id: string; name: string; color: string }>;
}

const AdminJobList = () => {
    const [jobs, setJobs] = useState<AdminJob[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loadJobs = async () => {
        setLoading(true);
        try {
            // Load jobs dari Supabase
            const supabaseJobs = await jobService.getMyJobs();
            
            // Transform data untuk UI
            const transformedJobs = supabaseJobs.map(job => ({
                id: job.id,
                title: job.title,
                salaryMin: job.salary_min,
                salaryMax: job.salary_max,
                status: job.status as 'active' | 'inactive' | 'draft',
                startDate: new Date(job.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }),
                applicants: [] // Will be populated from applications table
            }));
            
            setJobs(transformedJobs);
        } catch (error) {
            console.error('Error loading jobs:', error);
            message.error('Gagal memuat daftar pekerjaan');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobs();
    }, []);

    const handleManageJob = (jobId: string) => {
        navigate(`/admin/jobs/${jobId}`);
    };

    const handleCreateJob = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleSubmitJob = async (data: any) => {
        setLoading(true);
        try {
            // Create job di Supabase
            await jobService.createJob({
                title: data.jobName,
                company: 'Company',
                location: 'Jakarta',
                salary_min: data.minSalary,
                salary_max: data.maxSalary,
                job_type: data.jobType,
                level: 'Associate (0 - 3 years)',
                description: data.jobDescription,
                about: data.jobDescription,
                requirements: [],
                tools: [],
                competency: [],
                status: 'active',
                candidates_needed: data.candidatesNeeded,
                profile_fields: data.profileFields
            });

            // Reload jobs
            await loadJobs();
            
            // Show success message
            setShowSuccess(true);
            message.success('Job berhasil dipublish!');
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Error creating job:', error);
            message.error('Gagal membuat job. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
    };

    return (
        <>
            <AdminJobListComponent
                jobs={jobs}
                onManageJob={handleManageJob}
                onCreateJob={handleCreateJob}
                showSuccessMessage={showSuccess}
                onCloseSuccess={handleCloseSuccess}
            />
            
            <CreateJobModal
                visible={showCreateModal}
                onClose={handleCloseCreateModal}
                onSubmit={handleSubmitJob}
            />
        </>
    );
};

export default AdminJobList;
