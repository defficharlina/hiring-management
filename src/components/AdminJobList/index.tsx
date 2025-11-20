import { Input, Button } from 'antd';
import { SearchOutlined, CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './AdminJobList.css';

interface AdminJob {
    id: string;
    title: string;
    salaryMin: number;
    salaryMax: number;
    status: 'active' | 'inactive' | 'draft';
    startDate: string;
    applicants: Array<{ id: string; name: string; color: string }>;
}

interface Props {
    jobs: AdminJob[];
    onManageJob: (jobId: string) => void;
    onCreateJob: () => void;
    showSuccessMessage?: boolean;
    onCloseSuccess?: () => void;
}

const AdminJobList = ({ jobs, onManageJob, onCreateJob, showSuccessMessage, onCloseSuccess }: Props) => {
    const [searchQuery, setSearchQuery] = useState('');

    const formatSalary = (min: number, max: number) => {
        return `Rp${(min / 1000000).toFixed(1)}.000.000 - Rp${(max / 1000000).toFixed(1)}.000.000`;
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'inactive':
                return 'Inactive';
            case 'draft':
                return 'Draft';
            default:
                return status;
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-job-list-container">
            <div className="admin-job-list-header">
                <h1 className="admin-job-list-title">Job List</h1>
            </div>

            <div className="admin-job-list-search">
                <Input
                    placeholder="Search by job details"
                    prefix={<SearchOutlined />}
                    size="large"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ maxWidth: 400 }}
                />
            </div>

            <div className="admin-job-list-items">
                {filteredJobs.map((job) => (
                    <div key={job.id} className="admin-job-card">
                        <div className="admin-job-card-left">
                            <div className="admin-job-card-info">
                                <div className="admin-job-card-header">
                                    <span className={`admin-job-card-status ${job.status}`}>
                                        {getStatusLabel(job.status)}
                                    </span>
                                    <span className="admin-job-card-date">
                                        started on {job.startDate}
                                    </span>
                                </div>
                                <h3 className="admin-job-card-title">{job.title}</h3>
                                <p className="admin-job-card-salary">
                                    {formatSalary(job.salaryMin, job.salaryMax)}
                                </p>
                            </div>
                        </div>

                        <div className="admin-job-card-actions">
                            <Button
                                type="primary"
                                className="admin-job-card-manage-btn"
                                onClick={() => onManageJob(job.id)}
                            >
                                Manage Job
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sidebar */}
            <div className="admin-job-list-sidebar">
                <h2 className="admin-job-list-sidebar-title">Recruit the best candidates</h2>
                <p className="admin-job-list-sidebar-subtitle">Create jobs, invite, and hire with ease</p>
                <Button
                    type="primary"
                    className="admin-job-list-create-btn"
                    onClick={onCreateJob}
                >
                    Create a new Job
                </Button>
            </div>

            {/* Success Message */}
            {showSuccessMessage && (
                <div className="admin-job-list-success">
                    <CheckCircleOutlined className="admin-job-list-success-icon" />
                    <p className="admin-job-list-success-text">Job vacancy successfully created</p>
                    <CloseOutlined
                        className="admin-job-list-success-close"
                        onClick={onCloseSuccess}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminJobList;
