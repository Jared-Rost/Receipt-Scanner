package main

import (
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/khalidzahra/receipt-scanner/ocr"
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

	app.Get("/receipt", func(c fiber.Ctx) error {

		text, err := ocr.ExtractTextFromImage("receipt.jpeg")

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		log.Printf("Extracted text: %s", text)

		return c.JSON(fiber.Map{
			"text": text,
		})
	})

	app.Get("/gemini", func(c fiber.Ctx) error {
		text, err := ocr.ExtractTextFromImage("receipt.jpeg")

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		log.Printf("Extracted text: %s", text)

		geminiText, err := ocr.SendTextToGemini(text)

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		log.Printf("Gemini response: %s", geminiText)

		return c.JSON(fiber.Map{
			"text": geminiText,
		})
	})

	// Start the server on port 3000
	log.Fatal(app.Listen(":3000"))
}
