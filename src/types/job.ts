export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    type: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
    description: string;
    requirements: string[];
}

export interface GetJobResponse {
    data: Job[];
}
