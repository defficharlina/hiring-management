import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ManageCandidate as ManageCandidateComponent } from '../../components';

interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    domicile: string;
    gender: string;
    linkedinUrl: string;
}

// Mock data kandidat
const MOCK_CANDIDATES: Record<string, Candidate[]> = {
    '1': [
        {
            id: '1',
            name: 'Aurelie Yukiko',
            email: 'aurelieyukiko@yahoo.com',
            phone: '082120908766',
            dateOfBirth: '30 January 2001',
            domicile: 'Jakarta',
            gender: 'Female',
            linkedinUrl: 'https://www.linkedin.com/in/user...'
        },
        {
            id: '2',
            name: 'Dityo Hendyawan',
            email: 'dityohendyawan@yaho...',
            phone: '081184180678',
            dateOfBirth: '30 January 2001',
            domicile: 'Jakarta',
            gender: 'Female',
            linkedinUrl: 'https://www.linkedin.com/in/user...'
        },
        {
            id: '3',
            name: 'Mira Workman',
            email: 'miraworkman@yahoo.c...',
            phone: '081672007108',
            dateOfBirth: '30 January 2001',
            domicile: 'Jakarta',
            gender: 'Female',
            linkedinUrl: 'https://www.linkedin.com/in/user...'
        },
        {
            id: '4',
            name: 'Psityn Culhane',
            email: 'psitynculhane@yahoo...',
            phone: '081521500714',
            dateOfBirth: '30 January 2001',
            domicile: 'Jakarta',
            gender: 'Male',
            linkedinUrl: 'https://www.linkedin.com/in/user...'
        },
        {
            id: '5',
            name: 'Emerson Baptista',
            email: 'emersonbaptista@yah...',
            phone: '082167008244',
            dateOfBirth: '30 January 2001',
            domicile: 'Jakarta',
            gender: 'Male',
            linkedinUrl: 'https://www.linkedin.com/in/user...'
        },
        {
            id: '6',
            name: 'Indra Zen',
            email: 'indrazen@yahoo.com',
            phone: '081181630568',
            dateOfBirth: '30 January 2001',
            domicile: 'Jakarta',
            gender: 'Male',
            linkedinUrl: 'https://www.linkedin.com/in/user...'
        },
        {
            id: '7',
            name: 'Joyce',
            email: 'joyce@yahoo.com',
            phone: '084288771015',
            dateOfBirth: '30 January 2001',
            domicile: 'Jakarta',
            gender: 'Male',
            linkedinUrl: 'https://www.linkedin.com/in/user...'
        },
        {
            id: '8',
            name: 'Eriberto',
            email: 'eriberto@yahoo.com',
            phone: '083862419121',
            dateOfBirth: '30 January 2001',
            domicile: 'Jakarta',
            gender: 'Male',
            linkedinUrl: 'https://www.linkedin.com/in/user...'
        },
        {
            id: '9',
            name: 'Javon',
            email: 'javon@yahoo.com',
            phone: '083283445502',
            dateOfBirth: '30 January 2001',
            domicile: 'Jakarta',
            gender: 'Male',
            linkedinUrl: 'https://www.linkedin.com/in/user...'
        },
        {
            id: '10',
            name: 'Emory',
            email: 'emory@yahoo.com',
            phone: '087188286367',
            dateOfBirth: '30 January 2001',
            domicile: 'Jakarta',
            gender: 'Male',
            linkedinUrl: 'https://www.linkedin.com/in/user...'
        },
        {
            id: '11',
            name: 'Ella',
            email: 'ella@yahoo.com',
            phone: '088306913834',
            dateOfBirth: '30 January 2001',
            domicile: 'Jakarta',
            gender: 'Male',
            linkedinUrl: 'https://www.linkedin.com/in/user...'
        }
    ],
    '2': [],
    '3': []
};

const MOCK_JOB_TITLES: Record<string, string> = {
    '1': 'Front End Developer',
    '2': 'Data Scientist',
    '3': 'Data Scientist'
};

const ManageCandidate = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
    const [jobTitle, setJobTitle] = useState('');

    useEffect(() => {
        if (jobId) {
            // Load candidates for this job
            setCandidates(MOCK_CANDIDATES[jobId] || []);
            setJobTitle(MOCK_JOB_TITLES[jobId] || 'Job Position');
        }
    }, [jobId]);

    const handleSelectCandidate = (candidateIds: string[]) => {
        setSelectedCandidates(candidateIds);
    };

    const handleBackToJobList = () => {
        navigate('/admin/jobs');
    };

    return (
        <ManageCandidateComponent
            jobTitle={jobTitle}
            candidates={candidates}
            selectedCandidates={selectedCandidates}
            onSelectCandidate={handleSelectCandidate}
            onBackToJobList={handleBackToJobList}
        />
    );
};

export default ManageCandidate;
