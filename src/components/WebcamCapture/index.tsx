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
                                            <svg width="60" height="70" viewBox="0 0 100 140" fill="none">
                                                {/* Wrist */}
                                                <path d="M 35 130 Q 30 125 30 115 L 30 100 Q 30 95 35 95 L 65 95 Q 70 95 70 100 L 70 115 Q 70 125 65 130 Z" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Palm base */}
                                                <ellipse cx="50" cy="85" rx="22" ry="18" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5"/>
                                                {/* Thumb side curve */}
                                                <path d="M 28 85 Q 20 80 18 70 Q 17 60 22 52 L 28 55" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Thumb */}
                                                <path d="M 22 52 Q 20 48 20 44 Q 20 38 24 35 Q 28 32 32 35 Q 35 38 35 44 Q 35 50 33 55 L 28 60" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Index finger (extended) */}
                                                <ellipse cx="45" cy="15" rx="6" ry="8" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5"/>
                                                <path d="M 42 65 L 42 23 Q 42 18 45 15" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                <path d="M 48 65 L 48 23 Q 48 18 45 15" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Middle finger (folded) */}
                                                <path d="M 50 65 Q 52 60 54 58 Q 56 56 58 58 Q 60 60 58 64 Q 56 68 54 70" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Ring finger (folded) */}
                                                <path d="M 56 68 Q 58 64 60 62 Q 62 60 64 62 Q 66 64 64 68 Q 62 72 60 74" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Pinky (folded) */}
                                                <path d="M 62 72 Q 64 68 66 66 Q 68 64 70 66 Q 72 68 70 72 Q 68 76 66 78" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Palm detail line */}
                                                <path d="M 35 75 Q 40 80 45 82" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5"/>
                                            </svg>
                                        )}
                                        {index === 1 && (
                                            <svg width="60" height="70" viewBox="0 0 100 140" fill="none">
                                                {/* Wrist */}
                                                <path d="M 35 130 Q 30 125 30 115 L 30 100 Q 30 95 35 95 L 65 95 Q 70 95 70 100 L 70 115 Q 70 125 65 130 Z" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Palm base */}
                                                <ellipse cx="50" cy="85" rx="22" ry="18" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5"/>
                                                {/* Thumb side curve */}
                                                <path d="M 28 85 Q 20 80 18 70 Q 17 60 22 52 L 28 55" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Thumb */}
                                                <path d="M 22 52 Q 20 48 20 44 Q 20 38 24 35 Q 28 32 32 35 Q 35 38 35 44 Q 35 50 33 55 L 28 60" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Index finger (extended) */}
                                                <ellipse cx="42" cy="12" rx="6" ry="8" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5"/>
                                                <path d="M 39 65 L 39 20 Q 39 15 42 12" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                <path d="M 45 65 L 45 20 Q 45 15 42 12" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Middle finger (extended) */}
                                                <ellipse cx="52" cy="8" rx="6" ry="8" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5"/>
                                                <path d="M 49 65 L 49 16 Q 49 11 52 8" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                <path d="M 55 65 L 55 16 Q 55 11 52 8" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Ring finger (folded) */}
                                                <path d="M 58 68 Q 60 64 62 62 Q 64 60 66 62 Q 68 64 66 68 Q 64 72 62 74" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Pinky (folded) */}
                                                <path d="M 64 72 Q 66 68 68 66 Q 70 64 72 66 Q 74 68 72 72 Q 70 76 68 78" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Palm detail line */}
                                                <path d="M 35 75 Q 40 80 45 82" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5"/>
                                            </svg>
                                        )}
                                        {index === 2 && (
                                            <svg width="60" height="70" viewBox="0 0 100 140" fill="none">
                                                {/* Wrist */}
                                                <path d="M 35 130 Q 30 125 30 115 L 30 100 Q 30 95 35 95 L 65 95 Q 70 95 70 100 L 70 115 Q 70 125 65 130 Z" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Palm base */}
                                                <ellipse cx="50" cy="85" rx="22" ry="18" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5"/>
                                                {/* Thumb side curve */}
                                                <path d="M 28 85 Q 20 80 18 70 Q 17 60 22 52 L 28 55" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Thumb */}
                                                <path d="M 22 52 Q 20 48 20 44 Q 20 38 24 35 Q 28 32 32 35 Q 35 38 35 44 Q 35 50 33 55 L 28 60" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Index finger (extended) */}
                                                <ellipse cx="38" cy="10" rx="6" ry="8" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5"/>
                                                <path d="M 35 65 L 35 18 Q 35 13 38 10" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                <path d="M 41 65 L 41 18 Q 41 13 38 10" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Middle finger (extended) */}
                                                <ellipse cx="48" cy="5" rx="6" ry="8" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5"/>
                                                <path d="M 45 65 L 45 13 Q 45 8 48 5" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                <path d="M 51 65 L 51 13 Q 51 8 48 5" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Ring finger (extended) */}
                                                <ellipse cx="58" cy="12" rx="6" ry="8" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5"/>
                                                <path d="M 55 68 L 55 20 Q 55 15 58 12" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                <path d="M 61 68 L 61 20 Q 61 15 58 12" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Pinky (folded) */}
                                                <path d="M 64 72 Q 66 68 68 66 Q 70 64 72 66 Q 74 68 72 72 Q 70 76 68 78" fill="#f5f5f5" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                                                {/* Palm detail line */}
                                                <path d="M 35 75 Q 40 80 45 82" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5"/>
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
