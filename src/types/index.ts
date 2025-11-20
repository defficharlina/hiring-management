export interface GetCategoryResponse {
    data: Category[];
    current_page: number;
    total_item: number;
    total_page: number;
}

export interface Category {
    id_vehicle: number;
    model: string;
    type: string;
    colour: string;
    fuel: string;
    chassis: string;
    engine_no: string;
    date_reg: Date; // Assuming date_reg should be a Date object
    curr: string;
    price: number; // Assuming price should be a number (double in database terms)
}

export type CategoryForm = Omit<Category,'id_vehicle'>

export interface LoginForm {
    username: string;
    password: string;
}

export interface LoginResponse {
    data: {
        token: string;
      };
}

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    type?: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship' | 'Intern' | 'Remote' | 'Freelance';
    level?: string;
    description?: string;
    about?: string;
    requirements?: string[];
    tools?: string[];
    competency?: string[];
    postedTime?: string;
}

export interface GetJobResponse {
    data: Job[];
}