package main

import (
	"encoding/json"
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/khalidzahra/receipt-scanner/ocr"
	"github.com/khalidzahra/receipt-scanner/tts"
)

func main() {
	// Initialize the OCR package
	ocr.Init()

	// Initialize a new Fiber app
	app := fiber.New()

	// Define a route for the GET method on the root path '/'
	app.Get("/", func(c fiber.Ctx) error {
		// Send a string response to the client
		return c.SendString("Hello, World 👋!")
	})

	// Create an endpoint for receiving an image and returning the extracted text
	app.Post("/process", func(c fiber.Ctx) error {
		// Parse the form file
		file, err := c.FormFile("image")
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		// Save the file to the server
		err = c.SaveFile(file, "./images/"+file.Filename)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		// Extract text from the image
		text, err := ocr.ExtractTextFromImage("./images/" + file.Filename)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		log.Println(text)

		receipt, categories, err := ocr.SendTextToGemini(text)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		// Return the extracted text
		return c.JSON(fiber.Map{
			"receipt":    receipt,
			"categories": categories,
			"rawText":    text,
		})
	})

	app.Post("/tts", func(c fiber.Ctx) error {
		var request struct {
			Text string `json:"text"`
		}

		if err := json.Unmarshal(c.Body(), &request); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid JSON payload",
			})
		}

		if request.Text == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Text field is required",
			})
		}

		outputFile, err := tts.SendTextToSpeech(request.Text)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.SendFile(outputFile)
	})

	log.Fatal(app.Listen(":3000"))
}
