import { Modal, DatePicker, message, Select } from 'antd';
import { ArrowLeftOutlined, CameraOutlined, InfoCircleOutlined, DownOutlined } from '@ant-design/icons';
import { useState } from 'react';
import WebcamCapture from '../WebcamCapture';
import './JobApplicationForm.css';

interface Props {
    visible: boolean;
    jobTitle: string;
    company: string;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

interface CountryCode {
    code: string;
    dial: string;
    flag: string;
    name: string;
}

const COUNTRY_CODES: CountryCode[] = [
    { code: 'ID', dial: '+62', flag: '🇮🇩', name: 'Indonesia' },
    { code: 'US', dial: '+1', flag: '🇺🇸', name: 'United States' },
    { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: 'SG', dial: '+65', flag: '🇸🇬', name: 'Singapore' },
    { code: 'MY', dial: '+60', flag: '🇲🇾', name: 'Malaysia' },
    { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: 'JP', dial: '+81', flag: '🇯🇵', name: 'Japan' },
    { code: 'KR', dial: '+82', flag: '🇰🇷', name: 'South Korea' },
    { code: 'CN', dial: '+86', flag: '🇨🇳', name: 'China' },
    { code: 'IN', dial: '+91', flag: '🇮🇳', name: 'India' },
];

const JobApplicationForm = ({ visible, jobTitle, company, onClose, onSubmit }: Props) => {
    const [formData, setFormData] = useState({
        photoData: '',
        fullName: '',
        dateOfBirth: null,
        gender: '',
        domicile: '',
        countryCode: '+62',
        phoneNumber: '',
        email: '',
        linkedinUrl: ''
    });
    const [showWebcam, setShowWebcam] = useState(false);

    const handleOpenWebcam = () => {
        setShowWebcam(true);
    };

    const handleCloseWebcam = () => {
        setShowWebcam(false);
    };

    const handleWebcamCapture = (imageData: string) => {
        setFormData({ ...formData, photoData: imageData });
        message.success('Foto berhasil diambil!');
    };

    const handleSubmit = () => {
        // Validasi form
        if (!formData.fullName || !formData.dateOfBirth || !formData.gender || 
            !formData.domicile || !formData.phoneNumber || !formData.email || 
            !formData.linkedinUrl) {
            message.error('Mohon lengkapi semua field yang wajib diisi!');
            return;
        }

        const submitData = {
            ...formData,
            fullPhoneNumber: `${formData.countryCode}${formData.phoneNumber}`
        };

        onSubmit(submitData);
        message.success('Aplikasi berhasil dikirim!');
        onClose();
    };

    return (
        <>
            <Modal
                open={visible}
                onCancel={onClose}
                footer={null}
                width={600}
                className="job-application-modal"
                closable={false}
            >
            <div className="job-application-header">
                <ArrowLeftOutlined className="job-application-back" onClick={onClose} />
                <h2 className="job-application-title">
                    Apply {jobTitle} at {company}
                </h2>
            </div>

            <div className="job-application-required">* Required</div>

            <div className="job-application-info">
                <InfoCircleOutlined />
                <span>This field required to fill</span>
            </div>

            <form>
                {/* Photo Profile */}
                <div className="job-application-form-item">
                    <label className="job-application-label">
                        Photo Profile
                    </label>
                    <div className="job-application-photo-upload">
                        <div className="job-application-avatar">
                            {formData.photoData ? (
                                <img 
                                    src={formData.photoData} 
                                    alt="Profile" 
                                />
                            ) : (
                                <div className="job-application-avatar-placeholder">
                                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                                        <circle cx="40" cy="30" r="12" fill="#457b9d"/>
                                        <path d="M20 60c0-11 9-20 20-20s20 9 20 20" fill="#457b9d"/>
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="job-application-upload-btn" onClick={handleOpenWebcam}>
                            <CameraOutlined />
                            <span>Take a Picture</span>
                        </div>
                    </div>
                </div>

                {/* Full Name */}
                <div className="job-application-form-item">
                    <label className="job-application-label">
                        Full name<span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        className="job-application-input"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                </div>

                {/* Date of Birth */}
                <div className="job-application-form-item">
                    <label className="job-application-label">
                        Date of birth<span className="required">*</span>
                    </label>
                    <div className="job-application-datepicker">
                        <DatePicker
                            placeholder="Select date of birth"
                            style={{ width: '100%' }}
                            onChange={(date) => setFormData({ ...formData, dateOfBirth: date as any })}
                        />
                    </div>
                </div>

                {/* Gender */}
                <div className="job-application-form-item">
                    <label className="job-application-label">
                        Pronoun (gender)<span className="required">*</span>
                    </label>
                    <div className="job-application-radio-group">
                        <div className="job-application-radio">
                            <input
                                type="radio"
                                id="female"
                                name="gender"
                                value="female"
                                checked={formData.gender === 'female'}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            />
                            <label htmlFor="female">She/her (Female)</label>
                        </div>
                        <div className="job-application-radio">
                            <input
                                type="radio"
                                id="male"
                                name="gender"
                                value="male"
                                checked={formData.gender === 'male'}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            />
                            <label htmlFor="male">He/him (Male)</label>
                        </div>
                    </div>
                </div>

                {/* Domicile */}
                <div className="job-application-form-item">
                    <label className="job-application-label">
                        Domicile<span className="required">*</span>
                    </label>
                    <select
                        className="job-application-select"
                        value={formData.domicile}
                        onChange={(e) => setFormData({ ...formData, domicile: e.target.value })}
                    >
                        <option value="">Choose your domicile</option>
                        <option value="Jakarta">Jakarta</option>
                        <option value="Bandung">Bandung</option>
                        <option value="Surabaya">Surabaya</option>
                        <option value="Yogyakarta">Yogyakarta</option>
                        <option value="Semarang">Semarang</option>
                        <option value="Medan">Medan</option>
                        <option value="Makassar">Makassar</option>
                        <option value="Other">Lainnya</option>
                    </select>
                </div>

                {/* Phone Number */}
                <div className="job-application-form-item">
                    <label className="job-application-label">
                        Phone number<span className="required">*</span>
                    </label>
                    <div className="job-application-phone">
                        <Select
                            value={formData.countryCode}
                            onChange={(value) => setFormData({ ...formData, countryCode: value })}
                            style={{ width: 120 }}
                            bordered={false}
                            suffixIcon={<DownOutlined style={{ fontSize: 10 }} />}
                        >
                            {COUNTRY_CODES.map((country) => (
                                <Select.Option key={country.code} value={country.dial}>
                                    <span style={{ marginRight: 8 }}>{country.flag}</span>
                                    {country.dial}
                                </Select.Option>
                            ))}
                        </Select>
                        <input
                            type="tel"
                            className="job-application-phone-input"
                            placeholder="81214636365"
                            value={formData.phoneNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setFormData({ ...formData, phoneNumber: value });
                            }}
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="job-application-form-item">
                    <label className="job-application-label">
                        Email<span className="required">*</span>
                    </label>
                    <input
                        type="email"
                        className="job-application-input"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                {/* LinkedIn URL */}
                <div className="job-application-form-item">
                    <label className="job-application-label">
                        Link LinkedIn<span className="required">*</span>
                    </label>
                    <input
                        type="url"
                        className="job-application-input"
                        placeholder="https://linkedin.com/in/username"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    />
                </div>

                <button
                    type="button"
                    className="job-application-submit"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </form>
        </Modal>

        <WebcamCapture
            visible={showWebcam}
            onClose={handleCloseWebcam}
            onCapture={handleWebcamCapture}
        />
        </>
    );
};

export default JobApplicationForm;
