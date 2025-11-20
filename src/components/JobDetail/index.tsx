import { Button } from 'antd';
import { EnvironmentOutlined, DollarOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { Job } from '../../types';
import './JobDetail.css';

interface Props {
    job: Job | null;
    onApply?: (jobId: string) => void;
}

const JobDetail = ({ job, onApply }: Props) => {
    if (!job) {
        return (
            <div className="job-detail-empty">
                <FileTextOutlined className="job-detail-empty-icon" />
                <p className="job-detail-empty-text">Pilih lowongan untuk melihat detail</p>
            </div>
        );
    }

    const formatSalary = (min: number, max: number) => {
        return `Rp ${(min / 1000000).toFixed(1)} juta - Rp ${(max / 1000000).toFixed(1)} juta`;
    };

    return (
        <div className="job-detail-container">
            <div className="job-detail-header">
                <div className="job-detail-left">
                    <div className="job-detail-logo">
                        {'</>'}
                    </div>
                    <div className="job-detail-info">
                        <h1 className="job-detail-title">{job.title}</h1>
                        <p className="job-detail-company">{job.company}</p>
                    </div>
                </div>
                <Button 
                    type="primary" 
                    className="job-detail-apply-btn"
                    onClick={() => onApply && onApply(job.id)}
                >
                    Apply
                </Button>
            </div>

            <div className="job-detail-meta">
                <div className="job-detail-meta-item">
                    <EnvironmentOutlined className="job-detail-meta-icon" />
                    <span>{job.location}</span>
                </div>
                <div className="job-detail-meta-item">
                    <DollarOutlined className="job-detail-meta-icon" />
                    <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                </div>
                {job.postedTime && (
                    <div className="job-detail-meta-item">
                        <ClockCircleOutlined className="job-detail-meta-icon" />
                        <span>{job.postedTime}</span>
                    </div>
                )}
            </div>

            <div className="job-detail-badges">
                {job.type && (
                    <span className="job-detail-badge type">
                        {job.type}
                    </span>
                )}
                {job.level && (
                    <span className="job-detail-badge level">
                        {job.level}
                    </span>
                )}
            </div>

            {job.description && (
                <div className="job-detail-section">
                    <h2 className="job-detail-section-title">Description</h2>
                    <div className="job-detail-description">
                        {job.description}
                    </div>
                </div>
            )}

            {job.about && (
                <div className="job-detail-section">
                    <h2 className="job-detail-section-title">About the Program</h2>
                    <div className="job-detail-description">
                        {job.about}
                    </div>
                </div>
            )}

            {job.requirements && job.requirements.length > 0 && (
                <div className="job-detail-section">
                    <h2 className="job-detail-section-title">Requirements</h2>
                    <ul className="job-detail-list">
                        {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                        ))}
                    </ul>
                </div>
            )}

            {job.tools && job.tools.length > 0 && (
                <div className="job-detail-section">
                    <h2 className="job-detail-section-title">Tools</h2>
                    <div className="job-detail-badges">
                        {job.tools.map((tool, index) => (
                            <span key={index} className="job-detail-badge type">
                                {tool}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {job.competency && job.competency.length > 0 && (
                <div className="job-detail-section">
                    <h2 className="job-detail-section-title">Competency</h2>
                    <div className="job-detail-badges">
                        {job.competency.map((comp, index) => (
                            <span key={index} className="job-detail-badge level">
                                {comp}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetail;
