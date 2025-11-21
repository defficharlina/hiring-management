import { useEffect, useState } from 'react';
import { JobList as JobListComponent, JobApplicationForm } from '../../components';
import { Job } from '../../types';
import { jobService } from '../../services/jobService';
import { message } from 'antd';

const JobList = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [applyingJob, setApplyingJob] = useState<Job | null>(null);

    const loadJobs = async () => {
        try {
            // Get active jobs from Supabase
            const supabaseJobs = await jobService.getActiveJobs();
            
            // Transform data untuk UI
            const transformedJobs: Job[] = supabaseJobs.map(job => ({
                id: job.id,
                title: job.title,
                company: job.company,
                location: job.location,
                salaryMin: job.salary_min,
                salaryMax: job.salary_max,
                type: job.job_type as Job['type'],
                level: job.level,
                description: job.description,
                about: job.about,
                requirements: job.requirements || [],
                tools: job.tools || [],
                competency: job.competency || [],
                postedTime: new Date(job.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })
            }));
            
            // Hanya gunakan jobs dari Supabase
            setJobs(transformedJobs);
            
            // Auto select first job
            if (transformedJobs.length > 0) {
                setSelectedJob(transformedJobs[0]);
            }
        } catch (error) {
            console.error('Error loading jobs:', error);
            message.error('Gagal memuat daftar pekerjaan');
        }
    };

    useEffect(() => {
        loadJobs();
        
        // Reload jobs every 30 seconds to catch new published jobs
        const interval = setInterval(loadJobs, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const handleJobSelect = (job: Job) => {
        setSelectedJob(job);
    };

    const handleApply = (jobId: string) => {
        const job = jobs.find(j => j.id === jobId);
        if (job) {
            setApplyingJob(job);
            setShowApplicationForm(true);
        }
    };

    const handleApplicationSubmit = async (data: any) => {
        try {
            const { applicationService } = await import('../../services/applicationService');
            
            await applicationService.submitApplication({
                jobId: applyingJob!.id,
                fullName: data.fullName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                countryCode: data.countryCode,
                dateOfBirth: data.dateOfBirth,
                gender: data.gender,
                domicile: data.domicile,
                linkedinUrl: data.linkedinUrl,
                photoData: data.photoData
            });
            
            message.success('Lamaran berhasil dikirim!');
        } catch (error: any) {
            console.error('Error submitting application:', error);
            
            if (error.message?.includes('duplicate')) {
                message.error('Anda sudah melamar pekerjaan ini');
            } else {
                message.error('Gagal mengirim lamaran. Silakan coba lagi.');
            }
        }
    };

    const handleCloseForm = () => {
        setShowApplicationForm(false);
        setApplyingJob(null);
    };

    return (
        <>
            <JobListComponent 
                jobs={jobs} 
                selectedJob={selectedJob}
                onJobSelect={handleJobSelect}
                onApply={handleApply} 
            />
            
            {applyingJob && (
                <JobApplicationForm
                    visible={showApplicationForm}
                    jobTitle={applyingJob.title}
                    company={applyingJob.company}
                    onClose={handleCloseForm}
                    onSubmit={handleApplicationSubmit}
                />
            )}
        </>
    );
};

export default JobList;
