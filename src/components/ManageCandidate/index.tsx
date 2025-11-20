import { Table, Checkbox } from 'antd';
import { RightOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './ManageCandidate.css';

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

interface Props {
    jobTitle: string;
    candidates: Candidate[];
    selectedCandidates: string[];
    onSelectCandidate: (candidateIds: string[]) => void;
    onBackToJobList: () => void;
}

const ManageCandidate = ({ 
    jobTitle, 
    candidates, 
    selectedCandidates, 
    onSelectCandidate,
    onBackToJobList 
}: Props) => {

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            onSelectCandidate(candidates.map(c => c.id));
        } else {
            onSelectCandidate([]);
        }
    };

    const handleSelectOne = (candidateId: string, checked: boolean) => {
        if (checked) {
            onSelectCandidate([...selectedCandidates, candidateId]);
        } else {
            onSelectCandidate(selectedCandidates.filter(id => id !== candidateId));
        }
    };

    const columns: ColumnsType<Candidate> = [
        {
            title: (
                <Checkbox
                    checked={selectedCandidates.length === candidates.length && candidates.length > 0}
                    indeterminate={selectedCandidates.length > 0 && selectedCandidates.length < candidates.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                />
            ),
            key: 'checkbox',
            width: 50,
            render: (_, record) => (
                <Checkbox
                    checked={selectedCandidates.includes(record.id)}
                    onChange={(e) => handleSelectOne(record.id, e.target.checked)}
                />
            ),
        },
        {
            title: 'NAMA LENGKAP',
            dataIndex: 'name',
            key: 'name',
            render: (name) => <span className="manage-candidate-name">{name}</span>,
        },
        {
            title: 'EMAIL ADDRESS',
            dataIndex: 'email',
            key: 'email',
            render: (email) => <span className="manage-candidate-email">{email}</span>,
        },
        {
            title: 'PHONE NUMBERS',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone) => <span className="manage-candidate-phone">{phone}</span>,
        },
        {
            title: 'DATE OF BIRTH',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (date) => <span className="manage-candidate-date">{date}</span>,
        },
        {
            title: 'DOMICILE',
            dataIndex: 'domicile',
            key: 'domicile',
            render: (domicile) => <span className="manage-candidate-domicile">{domicile}</span>,
        },
        {
            title: 'GENDER',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender) => <span className="manage-candidate-gender">{gender}</span>,
        },
        {
            title: 'LINK LINKEDIN',
            dataIndex: 'linkedinUrl',
            key: 'linkedinUrl',
            render: (url) => (
                <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="manage-candidate-linkedin"
                >
                    {url.length > 30 ? url.substring(0, 30) + '...' : url}
                </a>
            ),
        },
    ];

    return (
        <div className="manage-candidate-container">
            <div className="manage-candidate-breadcrumb">
                <span 
                    className="manage-candidate-breadcrumb-item"
                    onClick={onBackToJobList}
                >
                    Job list
                </span>
                <RightOutlined className="manage-candidate-breadcrumb-separator" />
                <span className="manage-candidate-breadcrumb-active">
                    Manage Candidate
                </span>
            </div>

            <div className="manage-candidate-header">
                <h1 className="manage-candidate-title">{jobTitle}</h1>
            </div>

            {candidates.length === 0 ? (
                <div className="manage-candidate-empty">
                    <UserOutlined className="manage-candidate-empty-icon" />
                    <p className="manage-candidate-empty-text">
                        Belum ada kandidat yang melamar untuk posisi ini
                    </p>
                </div>
            ) : (
                <div className="manage-candidate-table">
                    <Table
                        columns={columns}
                        dataSource={candidates}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} kandidat`,
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ManageCandidate;
