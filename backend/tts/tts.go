package tts

import (
	"fmt"
	"time"

	htgotts "github.com/hegedustibor/htgo-tts"
	"github.com/hegedustibor/htgo-tts/handlers"
	"github.com/hegedustibor/htgo-tts/voices"
)

// Generate a unique filename based on the current timestamp
func generateFilename() string {
	return fmt.Sprintf("output_%d", time.Now().UnixNano())
}

func SendTextToSpeech(text string) (string, error) {
	outputFile := generateFilename()
	speech := htgotts.Speech{Folder: "audio", Language: voices.English, Handler: &handlers.Native{}}
	file, err := speech.CreateSpeechFile(text, outputFile)
	if err != nil {
		return "", err
	}

	return file, nil
}
