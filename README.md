# Receipt Scanner 📱💰

> A mobile application that uses your phone camera to scan, digitize, and organize receipt information.

Created for **.devhacks 2025** - A smart solution for expense tracking and receipt management.

## 🌟 Overview

Receipt Scanner is a full-stack mobile application that transforms physical receipts into structured digital data. Simply snap a photo of your receipt, and the app automatically extracts and categorizes all relevant information including establishment name, items purchased, prices, and totals.

### Key Features

- 📸 **Camera-Based Scanning** - Capture receipts instantly using your phone camera
- 🔍 **OCR Text Extraction** - Powered by Tesseract OCR for accurate text recognition
- 🤖 **AI-Powered Parsing** - Automatically structures receipt data (items, prices, dates, etc.)
- 🏷️ **Smart Categorization** - Receipts are automatically categorized (dining, shopping, etc.)
- 🔊 **Text-to-Speech** - Listen to receipt details with audio playback
- 💾 **Data Storage** - Save and organize your receipts digitally

## 🛠️ Tech Stack

### Frontend (71.6% TypeScript, 9.8% JavaScript)
- **React Native** with Expo
- Mobile-first design for iOS and Android
- Camera integration for receipt capture

### Backend (18.6% Go)
- **Go** with Fiber v3 web framework
- **Tesseract OCR** for text extraction
- **Text-to-Speech** capabilities
- RESTful API architecture

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Go 1.x or later
- Tesseract OCR installed locally
- Expo CLI (for mobile development)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Jared-Rost/Receipt-Scanner.git
cd Receipt-Scanner
```

#### 2. Backend Setup

Install Tesseract OCR:
```bash
sudo apt-get install tesseract-ocr
```

Navigate to the backend directory and install dependencies:
```bash
cd backend
go mod tidy
```

Start the backend server:
```bash
go run main.go
```

The server will run on `http://localhost:3000`

#### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend/MyApp
npm install
```

Start the Expo development server:
```bash
npx expo start
```

Follow the on-screen instructions to run the app on:
- iOS Simulator
- Android Emulator
- Physical device with Expo Go

## 📱 How It Works

1. **Capture** - Open the app and take a photo of your receipt
2. **Process** - The image is sent to the backend where OCR extracts the text
3. **Parse** - AI algorithms structure the data into a standardized format
4. **Categorize** - The receipt is automatically categorized based on content
5. **Store** - Save the digitized receipt for future reference
6. **Review** - View organized receipt data or listen to it via text-to-speech

## 📚 API Documentation

For detailed API endpoints, request/response formats, and integration examples, see the [Backend API Documentation](./backend/README.md).

**Quick API Overview:**
- `POST /process` - Upload and process a receipt image
- `POST /tts` - Convert receipt data to speech

## 🏗️ Project Structure

```
Receipt-Scanner/
├── frontend/          # React Native mobile app (TypeScript)
│   └── MyApp/        # Expo application
├── backend/          # Go API server
│   └── README.md     # Detailed API documentation
└── README.md         # This file
```

## 💡 Acknowledgments

- Tesseract OCR for text extraction
- Fiber framework for the Go backend
- Expo and React Native for mobile development
- .devhacks 2025 for the opportunity to build this project

---

**Need Help?** Check out the [Backend API Documentation](./backend/README.md) for technical details.
## Backend Documentation
The backend API documentation and usage instructions can be found [Here](./backend/README.md).
