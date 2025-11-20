import { useEffect, useState } from 'react';
import { JobList as JobListComponent, JobApplicationForm } from '../../components';
import { Job } from '../../types';
import { jobService } from '../../services/jobService';
import { message } from 'antd';

// Mock data untuk job list
const INITIAL_MOCK_JOBS: Job[] = [
    {
        id: '1',
        title: 'Product Intern (Product Manager Path)',
        company: 'Rakamin',
        location: 'Kota Jakarta Selatan - DKI Jakarta',
        salaryMin: 1000000,
        salaryMax: 1000000,
        type: 'Intern',
        level: 'Associate (0 - 3 years)',
        postedTime: '44 menit yang lalu',
        description: 'The Rakamin Future Talent Program is an internship initiative designed to help early-career and aspiring professionals gain real-world exposure through hands-on learning, mentorship, and practical projects.',
        about: 'The Rakamin Future Talent Program is an internship initiative designed to help early-career and aspiring professionals gain real-world exposure through hands-on learning, mentorship, and practical projects.',
        tools: ['Spreadsheet', 'Figma & Figjam'],
        competency: ['Product & Project Management'],
        requirements: [
            'Develop, test, and maintain responsive, high-performance web applications using modern front-end technologies.',
            'Collaborate with UI/UX designers to translate wireframes and prototypes into functional code.',
            'Integrate front-end components with APIs and backend services.',
            'Ensure cross-browser compatibility and optimize applications for maximum speed and scalability.',
            'Write clean, reusable, and maintainable code following best practices and coding standards.',
            'Participate in code reviews, contributing to continuous improvement and knowledge sharing.',
            'Troubleshoot and debug issues to improve usability and overall application quality.',
            'Stay updated with emerging front-end technologies and propose innovative solutions.',
            'Collaborate in Agile/Scrum ceremonies, contributing to sprint planning, estimation, and retrospectives.'
        ]
    },
    {
        id: '2',
        title: 'Spreadsheet Engineer Freelance',
        company: 'Rakamin',
        location: 'Kota Jakarta Selatan - DKI Jakarta',
        salaryMin: 1000000,
        salaryMax: 1000000,
        type: 'Freelance',
        level: 'Associate (0 - 3 years)',
        postedTime: '3 hari yang lalu',
        description: 'Build and maintain modern web applications using React, TypeScript, and other cutting-edge technologies.',
        requirements: [
            'Proficient in React, TypeScript, and modern JavaScript (ES6+)',
            'Experience with state management libraries (Redux, Zustand)',
            'Strong understanding of HTML5, CSS3, and responsive design',
            'Familiar with RESTful APIs and GraphQL',
            'Experience with version control (Git)',
            'Good understanding of web performance optimization',
            'Excellent problem-solving skills',
            'Team player with good communication skills'
        ]
    },
    {
        id: '3',
        title: 'Frontend Engineer',
        company: 'Rakamin',
        location: 'Kota Yogyakarta - Daerah Istimewa Yogyakarta',
        salaryMin: 7500000,
        salaryMax: 8700000,
        type: 'Full-Time',
        level: 'Associate (2 - 5 years)',
        postedTime: '6 hari yang lalu',
        description: 'Design and develop scalable backend systems and APIs to support our growing platform.',
        requirements: [
            'Strong experience with Node.js or Python',
            'Database design and optimization (PostgreSQL, MongoDB)',
            'RESTful API design and implementation',
            'Understanding of microservices architecture',
            'Experience with cloud platforms (AWS, GCP)',
            'Knowledge of Docker and Kubernetes',
            'Security best practices',
            'Agile development methodology'
        ]
    }
];

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
            
            // Combine with initial mock jobs (optional - bisa dihapus jika tidak perlu)
            const allJobs = [...INITIAL_MOCK_JOBS, ...transformedJobs];
            
            setJobs(allJobs);
            
            // Auto select first job
            if (allJobs.length > 0) {
                setSelectedJob(allJobs[0]);
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
