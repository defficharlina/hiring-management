import { EnvironmentOutlined, DollarOutlined } from '@ant-design/icons';
import { Job } from '../../types';
import './JobCard.css';

interface Props {
    job: Job;
    isActive?: boolean;
    onClick?: () => void;
}

const JobCard = ({ job, isActive, onClick }: Props) => {
    const formatSalary = (min: number, max: number) => {
        return `Rp. ${(min / 1000000).toFixed(0)} - ${(max / 1000000).toFixed(0)}`;
    };

    return (
        <div 
            className={`job-card ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <div className="job-card-header">
                <div className="job-card-logo">
                    {'</>'}
                </div>
                <div className="job-card-info">
                    <h3 className="job-card-title">{job.title}</h3>
                    <p className="job-card-company">{job.company}</p>
                </div>
            </div>

            <div className="job-card-meta">
                <EnvironmentOutlined className="job-card-meta-icon" />
                <span>{job.location}</span>
            </div>

            <div className="job-card-footer">
                <div className="job-card-salary">
                    <DollarOutlined className="job-card-meta-icon" />
                    <span className="job-card-salary-text">{formatSalary(job.salaryMin, job.salaryMax)}</span>
                </div>
                <div className="job-card-badges">
                    {job.type && (
                        <span className="job-card-badge">{job.type}</span>
                    )}
                </div>
            </div>

            {job.postedTime && (
                <div className="job-card-time">{job.postedTime}</div>
            )}
        </div>
    );
};

export default JobCard;
