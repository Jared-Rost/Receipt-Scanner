package tts

import (
	"fmt"
	"time"

	htgotts "github.com/hegedustibor/htgo-tts"
	"github.com/hegedustibor/htgo-tts/handlers"
	"github.com/hegedustibor/htgo-tts/voices"
	"github.com/khalidzahra/receipt-scanner/ocr"
)

// Generate a unique filename based on the current timestamp
func generateFilename() string {
	return fmt.Sprintf("output_%d", time.Now().UnixNano())
}

func formatReceiptText(receipt ocr.Receipt) string {
	text := fmt.Sprintf("Receipt from %s on %s. ", receipt.Establishment.Name, receipt.Transaction.Date)
	for _, item := range receipt.Items {
		text += fmt.Sprintf("Item: %s, Quantity: %d, Unit Price: %.2f, Subtotal: %.2f. ", item.Name, item.Quantity, item.UnitPrice, item.TotalPrice)
	}
	text += fmt.Sprintf("Tip: %.2f. Total: %.2f.", receipt.Tip, receipt.Total)
	return text
}

func SendTextToSpeech(receipt ocr.Receipt) (string, error) {
	text := formatReceiptText(receipt)
	outputFile := generateFilename()
	speech := htgotts.Speech{Folder: "audio", Language: voices.English, Handler: &handlers.Native{}}
	file, err := speech.CreateSpeechFile(text, outputFile)
	if err != nil {
		return "", err
	}

	return file, nil
}
