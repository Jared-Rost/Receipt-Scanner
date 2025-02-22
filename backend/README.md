## API Documentation

This section documents the API provided by the backend. It is built with [Fiber v3](https://github.com/gofiber/fiber), and depends on [Gosseract](https://github.com/otiai10/gosseract) and [htgo-tts](https://github.com/hegedustibor/htgo-tts).

### Base URL

```bash
http://localhost:3000
```

---

### **Endpoints**
#### 1. Process Receipt Image

`POST /process`

**Description**

Uploads an image of a receipt, extracts text using OCR, and categorizes the receipt based on extracted content.

**Request**

- **Form-Data:**
    - `image` (file, required): The receipt image to be processed.

**cURL command**

```bash
curl -X POST http://localhost:3000/process \
  -F "image=@/path/to/receipt.jpg"

```

**Example Response**

```json
{
  "receipt": {
    "establishment": {
      "name": "Main Street Restaurant"
    },
    "transaction": {
      "date": "2017-04-07"
    },
    "items": [
      {
        "name": "Cheeseburger",
        "quantity": 1,
        "unit_price": 12.50,
        "total_price": 12.50
      },
      {
        "name": "French Fries",
        "quantity": 1,
        "unit_price": 5.00,
        "total_price": 5.00
      }
    ],
    "tip": 3.78,
    "total": 29.01
  },
  "categories": ["dining"],
  "rawText": "Extracted text from receipt..."
}
```
**Possible Error Responses**

`Status 400`: No image provided or invalid file format 


### 2. Convert Receipt Data to Speech

`POST /tts`

**Description**

Takes a structured receipt object and generates a speech file that reads the receipt aloud.

**Request**

- **JSON Body**

```json
{
  "receipt": {
    "establishment": {
      "name": "Main Street Restaurant"
    },
    "transaction": {
      "date": "2017-04-07"
    },
    "items": [
      {
        "name": "Cheeseburger",
        "quantity": 1,
        "unit_price": 12.50,
        "total_price": 12.50
      },
      {
        "name": "French Fries",
        "quantity": 1,
        "unit_price": 5.00,
        "total_price": 5.00
      }
    ],
    "tip": 3.78,
    "total": 29.01
  }
}

```

**cURL command**

```bash
curl -X POST http://localhost:3000/tts \
  -H "Content-Type: application/json" \
  -d '{
    "receipt": {
      "establishment": {
        "name": "Main Street Restaurant"
      },
      "transaction": {
        "date": "2017-04-07"
      },
      "items": [
        {
          "name": "Cheeseburger",
          "quantity": 1,
          "unit_price": 12.50,
          "total_price": 12.50
        },
        {
          "name": "French Fries",
          "quantity": 1,
          "unit_price": 5.00,
          "total_price": 5.00
        }
      ],
      "tip": 3.78,
      "total": 29.01
    }
  }' --output receipt_audio.mp3
```

**Example Response**

Returns an audio file (receipt_audio.mp3) containing the spoken version of the receipt.

**Possible Error Responses**

`Status 400`: Invalid JSON payload (receipt not in standard form)

## Dependencies

[Tesseract](https://github.com/tesseract-ocr/tessdoc) must be installed locally on your machine. You can do so by running:

```bash
sudo apt-get install tesseract-ocr
```

## Running the server

Run the following command to download the needed dependencies:

```bash
go mod tidy
```

To start the server, run:

```bash
go run main.go
```

The server will listen on port `3000` by default.

