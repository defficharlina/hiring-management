import { supabase } from '../lib/supabase';

export interface CreateJobData {
    title: string;
    company?: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    jobType?: string;
    level?: string;
    description?: string;
    about?: string;
    requirements?: string[];
    tools?: string[];
    competency?: string[];
    status?: 'active' | 'inactive' | 'draft';
    candidatesNeeded?: number;
    profileFields?: any;
}

export const jobService = {
    // Get all active jobs (for users)
    async getActiveJobs() {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get all jobs (for admin)
    async getAllJobs() {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get job by ID
    async getJobById(jobId: string) {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', jobId)
            .single();

        if (error) throw error;
        return data;
    },

    // Create new job (admin only)
    async createJob(jobData: CreateJobData) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('jobs')
            .insert({
                ...jobData,
                company: jobData.company || 'Rakamin',
                status: jobData.status || 'active',
                created_by: user.id,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update job (admin only)
    async updateJob(jobId: string, jobData: Partial<CreateJobData>) {
        const { data, error } = await supabase
            .from('jobs')
            .update(jobData)
            .eq('id', jobId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete job (admin only)
    async deleteJob(jobId: string) {
        const { error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', jobId);

        if (error) throw error;
    },

    // Get jobs created by current user (admin)
    async getMyJobs() {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('created_by', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },
};
