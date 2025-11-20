import { Job } from '../../types';
import JobCard from '../JobCard';
import JobDetail from '../JobDetail';
import './JobList.css';

interface Props {
    jobs: Job[];
    selectedJob: Job | null;
    onJobSelect: (job: Job) => void;
    onApply?: (jobId: string) => void;
}

const JobList = ({ jobs, selectedJob, onJobSelect, onApply }: Props) => {
    return (
        <div className="job-list-layout">
            <div className="job-list-sidebar">
                <div className="job-list-header">
                    <h2 className="job-list-title">{jobs.length} Vacancy</h2>
                </div>
                <div className="job-list-scroll">
                    {jobs.length === 0 ? (
                        <div className="job-list-empty">
                            <p>Tidak ada lowongan pekerjaan tersedia</p>
                        </div>
                    ) : (
                        <div className="job-list-items">
                            {jobs.map((job) => (
                                <JobCard 
                                    key={job.id} 
                                    job={job} 
                                    isActive={selectedJob?.id === job.id}
                                    onClick={() => onJobSelect(job)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="job-list-detail">
                <JobDetail job={selectedJob} onApply={onApply} />
            </div>
        </div>
    );
};

export default JobList;
