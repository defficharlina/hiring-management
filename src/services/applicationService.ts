import { supabase } from '../lib/supabase';

export interface CreateApplicationData {
    jobId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
    dateOfBirth: string;
    gender: string;
    domicile: string;
    linkedinUrl: string;
    photoData?: string; // Base64 image data
}

export const applicationService = {
    // Submit job application
    async submitApplication(applicationData: CreateApplicationData) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('User not authenticated');

        let photoUrl = null;

        // Upload photo if provided
        if (applicationData.photoData) {
            photoUrl = await applicationService.uploadPhoto(
                applicationData.photoData,
                user.id,
                applicationData.jobId
            );
        }

        const { data, error } = await supabase
            .from('applications')
            .insert({
                job_id: applicationData.jobId,
                user_id: user.id,
                full_name: applicationData.fullName,
                email: applicationData.email,
                phone_number: applicationData.phoneNumber,
                country_code: applicationData.countryCode,
                date_of_birth: applicationData.dateOfBirth,
                gender: applicationData.gender,
                domicile: applicationData.domicile,
                linkedin_url: applicationData.linkedinUrl,
                photo_url: photoUrl,
                status: 'pending',
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Upload photo to Supabase Storage
    async uploadPhoto(photoData: string, userId: string, jobId: string) {
        // Convert base64 to blob
        const base64Response = await fetch(photoData);
        const blob = await base64Response.blob();

        const fileName = `${userId}_${jobId}_${Date.now()}.jpg`;
        const filePath = `applications/${fileName}`;

        const { data, error } = await supabase.storage
            .from('application-photos')
            .upload(filePath, blob, {
                contentType: 'image/jpeg',
                upsert: false,
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('application-photos')
            .getPublicUrl(filePath);

        return publicUrl;
    },

    // Get applications for a specific job (admin)
    async getJobApplications(jobId: string) {
        const { data, error } = await supabase
            .from('applications')
            .select('*')
            .eq('job_id', jobId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get user's applications
    async getMyApplications() {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('applications')
            .select(`
                *,
                jobs (
                    title,
                    company,
                    location
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Update application status (admin)
    async updateApplicationStatus(
        applicationId: string,
        status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
    ) {
        const { data, error } = await supabase
            .from('applications')
            .update({ status })
            .eq('id', applicationId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Check if user already applied to a job
    async hasApplied(jobId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return false;

        const { data, error } = await supabase
            .from('applications')
            .select('id')
            .eq('job_id', jobId)
            .eq('user_id', user.id)
            .single();

        return !error && data !== null;
    },
};
