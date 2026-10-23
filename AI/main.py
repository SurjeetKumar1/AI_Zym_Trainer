import time
import base64
import numpy as np
import cv2
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from services.config.workout_config import EXERCISE_OPTIONS, POSE_CONNECTIONS
from services.vision.exercise_video_processor import VideoProcessorClass

# Initialize Video Processor
processor = VideoProcessorClass()

app = FastAPI(title="AI Zym Trainer - Skeleton Lines & Pose Monitor")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "status": "online",
        "service": "AI Zym Trainer - Skeleton Lines Monitor",
        "exercises": list(EXERCISE_OPTIONS),
        "total_skeleton_connections": len(POSE_CONNECTIONS),
    }


@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": time.time()}


@app.websocket("/ws/live")
async def live_webcam_stream(websocket: WebSocket):
    """
    WebSocket endpoint that receives live camera frames from the frontend,
    detects body skeleton lines via MediaPipe, calculates rep counters & angles,
    and returns full skeleton connections to draw on the user's video feed.
    """
    await websocket.accept()
    current_exercise = "Squats"
    print("\n🟢 [WEBSOCKET] Client connected to live skeleton stream!\n")

    try:
        while True:
            data = await websocket.receive_json()

            # Exercise change
            if data.get("type") == "set_exercise":
                current_exercise = data.get("exercise", "Squats")
                processor.set_exercise(current_exercise)
                await websocket.send_json({"type": "exercise_set", "exercise": current_exercise})
                continue

            # Reset signal
            if data.get("type") == "reset":
                processor.reset_exercise(current_exercise)
                await websocket.send_json({"type": "reset_done", "reps": 0})
                continue

            image_b64 = data.get("image", "")
            if not image_b64:
                continue

            # Strip base64 header if present
            if "," in image_b64:
                image_b64 = image_b64.split(",")[1]

            # Decode base64 to OpenCV BGR image
            image_bytes = base64.b64decode(image_b64)
            nparr = np.frombuffer(image_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is None:
                continue

            ex_name = data.get("exercise", current_exercise)

            # Process frame with MediaPipe (skeleton lines & biomechanics)
            result = processor.process_frame(frame, ex_name)

            # Send back skeleton connections and metrics
            await websocket.send_json(result)

    except WebSocketDisconnect:
        print("\n🔴 [WEBSOCKET] Client disconnected.\n")
    except Exception as e:
        print(f"⚠️ [WEBSOCKET] Stream error: {e}")


if __name__ == "__main__":
    print("\n🚀 Starting AI Skeleton Monitor Server at http://0.0.0.0:8000")
    print("   WebSocket ready at ws://localhost:8000/ws/live\n")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)