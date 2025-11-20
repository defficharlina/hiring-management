import { Modal, Select, InputNumber, Button } from 'antd';
import { useState } from 'react';
import './CreateJobModal.css';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

type ProfileFieldStatus = 'mandatory' | 'optional' | 'off';

interface ProfileFields {
    fullName: ProfileFieldStatus;
    photoProfile: ProfileFieldStatus;
    gender: ProfileFieldStatus;
    domicile: ProfileFieldStatus;
    email: ProfileFieldStatus;
    phoneNumber: ProfileFieldStatus;
    linkedinLink: ProfileFieldStatus;
    dateOfBirth: ProfileFieldStatus;
}

const CreateJobModal = ({ visible, onClose, onSubmit }: Props) => {
    const [formData, setFormData] = useState({
        jobName: '',
        jobType: '',
        jobDescription: '',
        candidatesNeeded: 0,
        minSalary: 0,
        maxSalary: 0,
    });

    const [profileFields, setProfileFields] = useState<ProfileFields>({
        fullName: 'mandatory',
        photoProfile: 'mandatory',
        gender: 'mandatory',
        domicile: 'mandatory',
        email: 'mandatory',
        phoneNumber: 'mandatory',
        linkedinLink: 'mandatory',
        dateOfBirth: 'mandatory',
    });

    const handleProfileFieldChange = (field: keyof ProfileFields, status: ProfileFieldStatus) => {
        setProfileFields({
            ...profileFields,
            [field]: status
        });
    };

    const handleSubmit = () => {
        const submitData = {
            ...formData,
            profileFields
        };
        onSubmit(submitData);
        onClose();
    };

    const jobTypes = [
        'Full-Time',
        'Part-Time',
        'Contract',
        'Internship',
        'Freelance',
        'Remote'
    ];

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            className="create-job-modal"
            title={<h2 className="create-job-modal-title">Job Opening</h2>}
        >
            <form>
                {/* Job Name */}
                <div className="create-job-form-item">
                    <label className="create-job-label">
                        Job Name<span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        className="create-job-input"
                        placeholder="Ex. Front End Engineer"
                        value={formData.jobName}
                        onChange={(e) => setFormData({ ...formData, jobName: e.target.value })}
                    />
                </div>

                {/* Job Type */}
                <div className="create-job-form-item">
                    <label className="create-job-label">
                        Job Type<span className="required">*</span>
                    </label>
                    <Select
                        placeholder="Select job type"
                        className="create-job-select"
                        size="large"
                        value={formData.jobType || undefined}
                        onChange={(value) => setFormData({ ...formData, jobType: value })}
                    >
                        {jobTypes.map((type) => (
                            <Select.Option key={type} value={type}>
                                {type}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                {/* Job Description */}
                <div className="create-job-form-item">
                    <label className="create-job-label">
                        Job Description<span className="required">*</span>
                    </label>
                    <textarea
                        className="create-job-textarea"
                        placeholder="Ex."
                        value={formData.jobDescription}
                        onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                    />
                </div>

                {/* Number of Candidates Needed */}
                <div className="create-job-form-item">
                    <label className="create-job-label">
                        Number of Candidate Needed<span className="required">*</span>
                    </label>
                    <InputNumber
                        className="create-job-input"
                        placeholder="Ex. 2"
                        min={1}
                        style={{ width: '100%' }}
                        value={formData.candidatesNeeded || undefined}
                        onChange={(value) => setFormData({ ...formData, candidatesNeeded: value || 0 })}
                    />
                </div>

                {/* Job Salary */}
                <div className="create-job-form-item">
                    <label className="create-job-label">Job Salary</label>
                    <div className="create-job-salary-row">
                        <div>
                            <label className="create-job-label" style={{ fontSize: 12, color: '#666' }}>
                                Minimum Estimated Salary
                            </label>
                            <InputNumber
                                className="create-job-salary-input"
                                placeholder="Rp 7.000.000"
                                min={0}
                                style={{ width: '100%' }}
                                formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                parser={value => Number(value!.replace(/Rp\s?|(\.*)/g, ''))}
                                value={formData.minSalary || undefined}
                                onChange={(value) => setFormData({ ...formData, minSalary: value || 0 })}
                            />
                        </div>
                        <div>
                            <label className="create-job-label" style={{ fontSize: 12, color: '#666' }}>
                                Maximum Estimated Salary
                            </label>
                            <InputNumber
                                className="create-job-salary-input"
                                placeholder="Rp 8.000.000"
                                min={0}
                                style={{ width: '100%' }}
                                formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                parser={value => Number(value!.replace(/Rp\s?|(\.*)/g, ''))}
                                value={formData.maxSalary || undefined}
                                onChange={(value) => setFormData({ ...formData, maxSalary: value || 0 })}
                            />
                        </div>
                    </div>
                </div>

                {/* Minimum Profile Information Required */}
                <h3 className="create-job-section-title">Minimum Profile Information Required</h3>
                <div className="create-job-profile-fields">
                    {Object.entries({
                        fullName: 'Full name',
                        photoProfile: 'Photo Profile',
                        gender: 'Gender',
                        domicile: 'Domicile',
                        email: 'Email',
                        phoneNumber: 'Phone number',
                        linkedinLink: 'Linkedin link',
                        dateOfBirth: 'Date of birth'
                    }).map(([key, label]) => (
                        <div key={key} className="create-job-profile-field">
                            <span className="create-job-profile-field-name">{label}</span>
                            <div className="create-job-profile-field-options">
                                <span
                                    className={`create-job-profile-option ${
                                        profileFields[key as keyof ProfileFields] === 'mandatory' ? 'mandatory active' : ''
                                    }`}
                                    onClick={() => handleProfileFieldChange(key as keyof ProfileFields, 'mandatory')}
                                >
                                    Mandatory
                                </span>
                                <span
                                    className={`create-job-profile-option ${
                                        profileFields[key as keyof ProfileFields] === 'optional' ? 'optional active' : ''
                                    }`}
                                    onClick={() => handleProfileFieldChange(key as keyof ProfileFields, 'optional')}
                                >
                                    Optional
                                </span>
                                <span
                                    className={`create-job-profile-option ${
                                        profileFields[key as keyof ProfileFields] === 'off' ? 'off active' : ''
                                    }`}
                                    onClick={() => handleProfileFieldChange(key as keyof ProfileFields, 'off')}
                                >
                                    Off
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <Button
                    type="primary"
                    className="create-job-submit-btn"
                    onClick={handleSubmit}
                    disabled={!formData.jobName || !formData.jobType || !formData.jobDescription || !formData.candidatesNeeded}
                >
                    Publish Job
                </Button>
            </form>
        </Modal>
    );
};

export default CreateJobModal;
