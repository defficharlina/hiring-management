# Supabase Setup Guide untuk Rakamin Job Portal

## Prerequisites
- Akun Supabase (gratis di https://supabase.com)
- Node.js dan npm terinstall

## Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
```

## Step 2: Buat Project di Supabase

1. Login ke https://supabase.com
2. Klik "New Project"
3. Isi detail project:
   - Name: `hiring-management`
   - Database Password: Hiring1234*
   - Region: pilih yang terdekat (Singapore untuk Indonesia)
4. Tunggu project selesai dibuat (~2 menit)

## Step 3: Setup Database

1. Di Supabase Dashboard, buka **SQL Editor**
2. Copy semua isi file `supabase-schema.sql`
3. Paste ke SQL Editor
4. Klik **Run** untuk execute schema

## Step 4: Setup Storage untuk Photos

1. Di Supabase Dashboard, buka **Storage**
2. Klik **New Bucket**
3. Nama bucket: `application-photos`
4. Public bucket: **Yes** (centang)
5. Klik **Create Bucket**

## Step 5: Setup Environment Variables

1. Di Supabase Dashboard, buka **Settings** > **API**
2. Copy:
   - **Project URL** (contoh: https://xxxxx.supabase.co)
   - **anon public** key (key yang panjang)

3. Buat file `.env` di root project:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

4. Tambahkan `.env` ke `.gitignore`:

```
# Environment variables
.env
.env.local
```

## Step 6: Setup Authentication

1. Di Supabase Dashboard, buka **Authentication** > **Providers**
2. Enable **Email** provider
3. Disable email confirmation (untuk development):
   - Buka **Authentication** > **Settings**
   - Scroll ke **Email Auth**
   - Disable "Enable email confirmations"

## Step 7: Create Test Users

### Via Supabase Dashboard:

1. Buka **Authentication** > **Users**
2. Klik **Add User**
3. Buat 2 users:

**Admin User:**
- Email: `admin@example.com`
- Password: `Admin123`
- Auto Confirm User: **Yes**

**Regular User:**
- Email: `user@example.com`
- Password: `User1234`
- Auto Confirm User: **Yes**

4. Setelah user dibuat, buka **Table Editor** > **users**
5. Update role untuk masing-masing user:
   - admin@example.com → role: `admin`
   - user@example.com → role: `user`

## Step 8: Test Connection

1. Restart development server:
```bash
npm run dev
```

2. Buka browser dan test login dengan:
   - Admin: `admin@example.com` / `Admin123`
   - User: `user@example.com` / `User1234`

## Step 9: Update Existing Code

Ganti localStorage dengan Supabase di file-file berikut:

### 1. Update Login Container (`src/containers/Login/index.tsx`)

```typescript
import { authService } from '../../services/authService';

const handleLogin = async (credentials) => {
    try {
        const result = await authService.login(credentials);
        
        // Save to localStorage
        localStorage.setItem('token', result.session.access_token);
        localStorage.setItem('userRole', result.role);
        localStorage.setItem('username', result.user.email);
        
        // Redirect based on role
        if (result.role === 'admin') {
            window.location.replace('/admin/jobs');
        } else {
            window.location.replace('/jobs');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed!');
    }
};
```

### 2. Update AdminJobList Container

```typescript
import { jobService } from '../../services/jobService';

// Load jobs from Supabase
const loadJobs = async () => {
    try {
        const jobs = await jobService.getMyJobs();
        setJobs(jobs);
    } catch (error) {
        console.error('Error loading jobs:', error);
    }
};

// Create job
const handleCreateJob = async (jobData) => {
    try {
        await jobService.createJob(jobData);
        loadJobs(); // Reload
        setShowSuccess(true);
    } catch (error) {
        console.error('Error creating job:', error);
    }
};
```

### 3. Update JobList Container (User)

```typescript
import { jobService } from '../../services/jobService';

const loadJobs = async () => {
    try {
        const jobs = await jobService.getActiveJobs();
        setJobs(jobs);
    } catch (error) {
        console.error('Error loading jobs:', error);
    }
};
```

### 4. Update JobApplicationForm

```typescript
import { applicationService } from '../../services/applicationService';

const handleSubmit = async (formData) => {
    try {
        await applicationService.submitApplication({
            jobId: job.id,
            ...formData
        });
        message.success('Application submitted successfully!');
        onClose();
    } catch (error) {
        console.error('Error submitting application:', error);
        message.error('Failed to submit application');
    }
};
```

## Troubleshooting

### Error: "Invalid API key"
- Pastikan `.env` file sudah dibuat
- Restart development server setelah membuat `.env`
- Check VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah benar

### Error: "Row Level Security"
- Pastikan RLS policies sudah di-setup dengan benar
- Check di **Authentication** > **Policies**

### Error: "Storage bucket not found"
- Pastikan bucket `application-photos` sudah dibuat
- Pastikan bucket di-set sebagai **public**

### Error: "User not found"
- Pastikan user sudah dibuat di **Authentication** > **Users**
- Pastikan role sudah di-set di table **users**

## Production Checklist

- [ ] Enable email confirmation
- [ ] Setup custom SMTP for emails
- [ ] Add rate limiting
- [ ] Setup backup policies
- [ ] Enable database replication
- [ ] Setup monitoring and alerts
- [ ] Add proper error logging
- [ ] Implement proper password hashing
- [ ] Add CAPTCHA for signup/login
- [ ] Setup CDN for storage

## Useful Links

- Supabase Docs: https://supabase.com/docs
- Supabase JS Client: https://supabase.com/docs/reference/javascript
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security
- Storage: https://supabase.com/docs/guides/storage
