import { Modal, Button } from 'antd';
import { CloseOutlined, RightOutlined, WarningOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import './WebcamCapture.css';

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

            // Initialize MediaPipe Hands
            const hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
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

            // Initialize Camera
            const camera = new Camera(videoRef.current, {
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
    };

    const onHandsResults = (results: Results) => {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            setDetectedFingers(0);
            return;
        }

        const landmarks = results.multiHandLandmarks[0];
        const fingersUp = countFingersUp(landmarks);
        setDetectedFingers(fingersUp);

        // Check if current pose is detected
        if (status === 'detecting' && fingersUp === requiredFingers[currentPose]) {
            // Hold the pose for a moment to confirm
            setTimeout(() => {
                if (detectedFingers === requiredFingers[currentPose]) {
                    handlePoseDetected();
                }
            }, 500);
        }
    };

    const countFingersUp = (landmarks: any) => {
        let count = 0;

        // Thumb (special case - check horizontal distance)
        if (landmarks[4].x < landmarks[3].x) {
            count++;
        }

        // Index finger
        if (landmarks[8].y < landmarks[6].y) {
            count++;
        }

        // Middle finger
        if (landmarks[12].y < landmarks[10].y) {
            count++;
        }

        // Ring finger
        if (landmarks[16].y < landmarks[14].y) {
            count++;
        }

        // Pinky
        if (landmarks[20].y < landmarks[18].y) {
            count++;
        }

        return count;
    };

    const handlePoseDetected = () => {
        const nextPose = currentPose + 1;
        
        if (nextPose >= poses.length) {
            setStatus('success');
            startCountdown();
        } else {
            setCurrentPose(nextPose);
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
                return `Detecting... (${detectedFingers} finger${detectedFingers !== 1 ? 's' : ''} detected - need ${requiredFingers[currentPose]})`;
            case 'success':
                return 'All poses detected! Preparing to capture...';
            case 'countdown':
                return `Capturing in ${countdown}...`;
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
                    </div>

                    <div className={`webcam-capture-status ${status}`}>
                        {getStatusMessage()}
                    </div>

                    <p className="webcam-capture-instruction">
                        To take a picture, follow the hand poses in the order shown below. 
                        Show 1 finger (index finger), then 2 fingers (peace sign), then 3 fingers.
                        The system will detect each pose and move to the next automatically.
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
                                        {index === 0 && (
                                            <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
                                                <rect x="16" y="5" width="4" height="35" rx="2" fill="currentColor"/>
                                                <ellipse cx="18" cy="42" rx="10" ry="6" fill="currentColor"/>
                                            </svg>
                                        )}
                                        {index === 1 && (
                                            <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
                                                <rect x="12" y="5" width="4" height="35" rx="2" fill="currentColor"/>
                                                <rect x="20" y="8" width="4" height="32" rx="2" fill="currentColor"/>
                                                <ellipse cx="18" cy="42" rx="10" ry="6" fill="currentColor"/>
                                            </svg>
                                        )}
                                        {index === 2 && (
                                            <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
                                                <rect x="10" y="5" width="4" height="35" rx="2" fill="currentColor"/>
                                                <rect x="16" y="8" width="4" height="32" rx="2" fill="currentColor"/>
                                                <rect x="22" y="12" width="4" height="28" rx="2" fill="currentColor"/>
                                                <ellipse cx="18" cy="42" rx="10" ry="6" fill="currentColor"/>
                                            </svg>
                                        )}
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
