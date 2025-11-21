import { Modal, Button } from 'antd';
import { CloseOutlined, RightOutlined, WarningOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import './WebcamCapture.css';

// Declare global MediaPipe types
declare global {
    interface Window {
        Hands: any;
        Camera: any;
    }
}

type Results = any;
type Hands = any;
type Camera = any;

interface Props {
    visible: boolean;
    onClose: () => void;
    onCapture: (imageData: string) => void;
}

const WebcamCapture = ({ visible, onClose, onCapture }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const handsRef = useRef<Hands | null>(null);
    const cameraRef = useRef<Camera | null>(null);
    const detectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [currentPose, setCurrentPose] = useState(0);
    const [status, setStatus] = useState<'waiting' | 'detecting' | 'success' | 'countdown'>('waiting');
    const [error, setError] = useState<string>('');
    const [countdown, setCountdown] = useState(3);
    const [detectedFingers, setDetectedFingers] = useState(0);

    const poses = ['☝️', '✌️', '🤟']; // 1 finger, 2 fingers, 3 fingers
    const requiredFingers = [1, 2, 3]; // Required finger count for each pose

    useEffect(() => {
        if (visible) {
            initializeMediaPipe();
        } else {
            cleanup();
        }

        return () => {
            cleanup();
        };
    }, [visible]);

    const initializeMediaPipe = async () => {
        try {
            if (!videoRef.current) return;

            // Wait for MediaPipe to load from CDN
            if (!window.Hands || !window.Camera) {
                setError('MediaPipe library belum ter-load. Silakan refresh halaman.');
                return;
            }

            // Initialize MediaPipe Hands using global window object
            const hands = new window.Hands({
                locateFile: (file: string) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`;
                }
            });

            hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.7,
                minTrackingConfidence: 0.7
            });

            hands.onResults(onHandsResults);
            handsRef.current = hands;

            // Initialize Camera using global window object
            const camera = new window.Camera(videoRef.current, {
                onFrame: async () => {
                    if (videoRef.current && handsRef.current) {
                        await handsRef.current.send({ image: videoRef.current });
                    }
                },
                width: 640,
                height: 480
            });

            await camera.start();
            cameraRef.current = camera;
            setStatus('detecting');
            setError('');
        } catch (err) {
            console.error('Error initializing MediaPipe:', err);
            setError('Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.');
        }
    };

    const cleanup = () => {
        if (cameraRef.current) {
            cameraRef.current.stop();
            cameraRef.current = null;
        }
        if (handsRef.current) {
            handsRef.current.close();
            handsRef.current = null;
        }
        if (detectionTimeoutRef.current) {
            clearTimeout(detectionTimeoutRef.current);
            detectionTimeoutRef.current = null;
        }
    };

    const onHandsResults = (results: Results) => {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            setDetectedFingers(0);
            return;
        }

        const landmarks = results.multiHandLandmarks[0];
        const fingersUp = countFingersUp(landmarks);
        setDetectedFingers(fingersUp);

        // Check if current pose is detected with debounce
        if (status === 'detecting' && fingersUp === requiredFingers[currentPose]) {
            // Clear previous timeout
            if (detectionTimeoutRef.current) {
                clearTimeout(detectionTimeoutRef.current);
            }
            
            // Set new timeout to confirm pose is held for 800ms
            detectionTimeoutRef.current = setTimeout(() => {
                if (fingersUp === requiredFingers[currentPose]) {
                    handlePoseDetected();
                }
            }, 800);
        } else {
            // Clear timeout if pose doesn't match
            if (detectionTimeoutRef.current) {
                clearTimeout(detectionTimeoutRef.current);
                detectionTimeoutRef.current = null;
            }
        }
    };

    const countFingersUp = (landmarks: any) => {
        // Check each finger individually with more lenient thresholds
        const isIndexUp = landmarks[8].y < landmarks[6].y - 0.02;
        const isMiddleUp = landmarks[12].y < landmarks[10].y - 0.02;
        const isRingUp = landmarks[16].y < landmarks[14].y - 0.02;
        const isPinkyUp = landmarks[20].y < landmarks[18].y - 0.02;
        
        // Count extended fingers (excluding thumb for simplicity)
        let count = 0;
        if (isIndexUp) count++;
        if (isMiddleUp) count++;
        if (isRingUp) count++;
        if (isPinkyUp) count++;

        return count;
    };

    const handlePoseDetected = () => {
        const nextPose = currentPose + 1;
        
        if (nextPose >= poses.length) {
            // Semua pose selesai, mulai countdown untuk capture
            setStatus('success');
            setTimeout(() => {
                startCountdown();
            }, 500);
        } else {
            // Lanjut ke pose berikutnya
            setCurrentPose(nextPose);
            setStatus('detecting');
        }
    };

    const startCountdown = () => {
        setStatus('countdown');
        setCountdown(3);
        
        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    // Auto capture setelah countdown selesai
                    setTimeout(() => {
                        handleCapture();
                    }, 1000);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                const imageData = canvas.toDataURL('image/jpeg');
                onCapture(imageData);
                handleClose();
            }
        }
    };

    const handleClose = () => {
        cleanup();
        setCurrentPose(0);
        setStatus('waiting');
        setCountdown(3);
        setDetectedFingers(0);
        onClose();
    };

    const getStatusMessage = () => {
        switch (status) {
            case 'waiting':
                return 'Bersiap untuk mengambil foto...';
            case 'detecting':
                const poseNames = ['1 jari (telunjuk)', '2 jari (telunjuk + tengah)', '3 jari (telunjuk + tengah + manis)'];
                return `Tunjukkan ${poseNames[currentPose]} - Terdeteksi: ${detectedFingers} jari`;
            case 'success':
                return 'Semua pose terdeteksi! Bersiap mengambil foto...';
            case 'countdown':
                return `Foto akan diambil dalam ${countdown}...`;
            default:
                return '';
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={handleClose}
            footer={null}
            width={700}
            className="webcam-capture-modal"
            closable={false}
        >
            <div className="webcam-capture-header">
                <div className="webcam-capture-title-section">
                    <h2 className="webcam-capture-title">Show Numbers to Capture</h2>
                    <p className="webcam-capture-subtitle">
                        We'll take the photo once numbers 1, 2, and 3 are detected
                    </p>
                </div>
                <CloseOutlined className="webcam-capture-close" onClick={handleClose} />
            </div>

            {error ? (
                <div className="webcam-capture-error">
                    <WarningOutlined className="webcam-capture-error-icon" />
                    <p className="webcam-capture-error-text">{error}</p>
                </div>
            ) : (
                <>
                    <div className="webcam-capture-video-container">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="webcam-capture-video"
                        />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                        
                        {/* Countdown Overlay */}
                        {status === 'countdown' && countdown > 0 && (
                            <div className="webcam-countdown-overlay">
                                <div className="webcam-countdown-number">{countdown}</div>
                            </div>
                        )}
                        
                        {/* Success Message Overlay */}
                        {status === 'success' && (
                            <div className="webcam-success-overlay">
                                <div className="webcam-success-message">✓ Semua pose terdeteksi!</div>
                            </div>
                        )}
                    </div>

                    <div className={`webcam-capture-status ${status}`}>
                        {getStatusMessage()}
                    </div>

                    <p className="webcam-capture-instruction">
                        Tunjukkan pose tangan sesuai urutan: 1 jari (telunjuk), 2 jari (telunjuk + tengah), 3 jari (telunjuk + tengah + manis).
                        Pastikan jari lainnya tertekuk. Sistem akan otomatis mendeteksi dan lanjut ke pose berikutnya.
                    </p>

                    <div className="webcam-capture-poses">
                        {poses.map((pose, index) => (
                            <>
                                <div key={index} className="webcam-capture-pose">
                                    <div 
                                        className={`webcam-capture-pose-icon ${
                                            index === currentPose && status === 'detecting' ? 'active' : ''
                                        } ${
                                            index < currentPose ? 'completed' : ''
                                        }`}
                                    >
                                        {poses[index]}
                                    </div>
                                </div>
                                {index < poses.length - 1 && (
                                    <RightOutlined className="webcam-capture-arrow" />
                                )}
                            </>
                        ))}
                    </div>

                    <div className="webcam-capture-actions">
                        <Button
                            className="webcam-capture-btn webcam-capture-btn-cancel"
                            onClick={handleClose}
                            block
                            disabled={status === 'countdown'}
                        >
                            Cancel
                        </Button>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default WebcamCapture;
