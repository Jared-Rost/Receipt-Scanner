package ocr

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"github.com/otiai10/gosseract/v2"
)

var geminiAPI string

type Text struct {
	Categories []string `json:"categories"`
}

type ResponsePart struct {
	Text Text `json:"text"`
}

type RequestPart struct {
	Text string `json:"text"`
}

type Content struct {
	Parts []RequestPart `json:"parts"`
}

type Payload struct {
	Contents []Content `json:"contents"`
}

type Response struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

type Categories struct {
	Categories []string `json:"categories"`
}

type Config struct {
	Query string `json:"geminiQuery"`
}

var config Config

func Init() {
	var err = godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	geminiAPI = os.Getenv("GEMINI_API_KEY")

	// Load config
	file, err := os.Open("config.json")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&config)
	if err != nil {
		log.Fatal(err)
	}
}

// ExtractTextFromImage extracts text from an image using Tesseract OCR
func ExtractTextFromImage(imagePath string) (string, error) {
	client := gosseract.NewClient()
	defer client.Close()

	err := client.SetImage(imagePath)
	if err != nil {
		return "", err
	}

	text, err := client.Text()
	if err != nil {
		return "", err
	}

	return text, nil
}

func SendTextToGemini(text string) ([]string, error) {
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=%s", geminiAPI)
	log.Println(url)

	constrcutedQuery := fmt.Sprintf("%s%s", text, config.Query)

	log.Println(constrcutedQuery)

	payload := Payload{
		Contents: []Content{
			{
				Parts: []RequestPart{
					{Text: constrcutedQuery},
				},
			},
		},
	}
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonPayload))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Gemini API request failed with status code: %d", resp.StatusCode)
	}

	var response Response
	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		return nil, err
	}

	cleanedText := strings.ReplaceAll(response.Candidates[0].Content.Parts[0].Text, "`", "")
	cleanedText = strings.ReplaceAll(cleanedText, "json", "")

	var categories Categories
	err = json.Unmarshal([]byte(cleanedText), &categories)
	if err != nil {
		return nil, err
	}

	return categories.Categories, nil
}
