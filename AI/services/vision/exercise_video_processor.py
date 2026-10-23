import os
import time
import cv2
import threading
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

from detectors.squat import SquatDetector
from detectors.pushup import PushUpDetector
from detectors.biceps_curl import BicepsCurlDetector
from detectors.shoulder_press import ShoulderPressDetector
from detectors.lunges import LungesDetector
from services.config.workout_config import POSE_CONNECTIONS


class VideoProcessorClass:
    """
    Video Processor for AI Gym Trainer.
    Processes webcam frames, tracks full body skeleton lines & joints,
    and runs real-time exercise biomechanics detectors.
    """

    def __init__(self):
        self._lock = threading.Lock()
        self._latest_metrics = None
        self._exercise_type = "Squats"
        self._last_print_time = 0

        # Locate model file
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        model_path = os.path.join(base_dir, "ml_model", "pose_landmarker_full.task")

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}")

        base_option = python.BaseOptions(model_asset_path=model_path)
        options = vision.PoseLandmarkerOptions(
            base_options=base_option,
            running_mode=vision.RunningMode.IMAGE,
            min_pose_detection_confidence=0.5,
            min_tracking_confidence=0.5,
            output_segmentation_masks=False,
        )

        self._landmarker = vision.PoseLandmarker.create_from_options(options)

        self._detectors = {
            "Squats": SquatDetector(),
            "Push-ups": PushUpDetector(),
            "Biceps Curls (Dumbbell)": BicepsCurlDetector(),
            "Shoulder Press": ShoulderPressDetector(),
            "Lunges": LungesDetector(),
        }

        print("\n✅ [AI] PoseLandmarker initialized with skeleton lines & detectors ready!\n")

    def set_exercise(self, exercise_type: str):
        with self._lock:
            self._exercise_type = exercise_type

    def get_exercise(self) -> str:
        with self._lock:
            return self._exercise_type

    def reset_exercise(self, exercise_type: str = None):
        with self._lock:
            target = exercise_type or self._exercise_type
            if target in self._detectors:
                self._detectors[target].reset()
            self._latest_metrics = None

    def process_frame(self, frame_bgr, exercise_name: str = None):
        """
        Processes one BGR frame.
        Detects body skeleton lines, runs exercise detector,
        and logs live state to the terminal.
        """
        if frame_bgr is None:
            return {"detected": False, "metrics": {}}

        ex_type = exercise_name or self.get_exercise()
        detector = self._detectors.get(ex_type) or self._detectors["Squats"]

        # Convert to RGB for MediaPipe
        rgb_frame = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

        result = self._landmarker.detect(mp_image)

        if not result.pose_landmarks or len(result.pose_landmarks) == 0:
            now = time.time()
            if now - self._last_print_time > 1.5:
                print(f"⏳ [AI MONITOR] Looking for person in camera frame ({ex_type})...")
                self._last_print_time = now
            return {
                "detected": False,
                "exercise": ex_type,
                "metrics": {"pose_detected": False, "reps": getattr(detector, "reps", 0)},
                "connections": POSE_CONNECTIONS,
                "landmarks": [],
            }

        landmarks = result.pose_landmarks[0]

        # Process exercise detector
        metrics = detector.process(landmarks)
        metrics["pose_detected"] = True
        metrics["reps"] = detector.reps
        metrics["stage"] = getattr(detector, "stage", None)

        with self._lock:
            self._latest_metrics = metrics.copy()

        # Terminal output (throttled every 0.5s)
        now = time.time()
        if now - self._last_print_time > 0.5:
            print("──────────────────────────────────────────────────────────")
            print(f"⚡ [AI SKELETON MONITOR] {ex_type.upper()}:")
            print(f"   🔢 Reps: {detector.reps} | Stage: {getattr(detector, 'stage', 'READY')}")
            for k, v in metrics.items():
                if k not in ["reps", "stage", "pose_detected"]:
                    print(f"   📊 {k}: {v}")
            print(f"   🦴 Skeleton: {len(POSE_CONNECTIONS)} Bone Connections Active")
            print("──────────────────────────────────────────────────────────")
            self._last_print_time = now

        # Format landmarks for WebSocket transmission
        formatted_landmarks = [
            {
                "id": idx,
                "x": round(lm.x, 4),
                "y": round(lm.y, 4),
                "vis": round(getattr(lm, "visibility", 1.0) or 1.0, 2),
            }
            for idx, lm in enumerate(landmarks)
        ]

        return {
            "detected": True,
            "exercise": ex_type,
            "metrics": metrics,
            "connections": POSE_CONNECTIONS,
            "landmarks": formatted_landmarks,
        }