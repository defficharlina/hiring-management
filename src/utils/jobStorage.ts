// Utility untuk manage jobs di localStorage

export interface JobData {
    id: string;
    title: string;
    company: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    type?: string;
    level?: string;
    description?: string;
    about?: string;
    requirements?: string[];
    tools?: string[];
    competency?: string[];
    postedTime?: string;
    status: 'active' | 'inactive' | 'draft';
    startDate: string;
    candidatesNeeded: number;
    profileFields?: any;
}

const JOBS_STORAGE_KEY = 'rakamin_jobs';

export const getJobs = (): JobData[] => {
    const jobsJson = localStorage.getItem(JOBS_STORAGE_KEY);
    if (jobsJson) {
        return JSON.parse(jobsJson);
    }
    return [];
};

export const saveJob = (job: JobData): void => {
    const jobs = getJobs();
    jobs.push(job);
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
};

export const updateJob = (jobId: string, updatedJob: Partial<JobData>): void => {
    const jobs = getJobs();
    const index = jobs.findIndex(j => j.id === jobId);
    if (index !== -1) {
        jobs[index] = { ...jobs[index], ...updatedJob };
        localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
    }
};

export const deleteJob = (jobId: string): void => {
    const jobs = getJobs();
    const filteredJobs = jobs.filter(j => j.id !== jobId);
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(filteredJobs));
};

export const getJobById = (jobId: string): JobData | undefined => {
    const jobs = getJobs();
    return jobs.find(j => j.id === jobId);
};

export const getActiveJobs = (): JobData[] => {
    const jobs = getJobs();
    return jobs.filter(j => j.status === 'active');
};
