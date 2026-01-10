/voice-note-pro
|-- frontend/
|   |-- public/
|   |   |-- index.html
|   |-- src/
|       |-- components/
|           |-- Recorder.jsx       # Main voice recorder component
|       |-- App.js                 # Main React App component
|       |-- style.css              # Frontend styling
|
|-- backend/
|   |-- server.js                  # Node.js server
|   |-- routes/
|       |-- audioRoutes.js         # API route for file uploads
|   |-- controllers/
|       |-- audioController.js     # Handles upload logic
|   |-- uploads/                   # Folder to store uploaded files
|   |-- package.json
|
|-- .gitignore                     # Ignore node_modules and uploads
|-- README.md
