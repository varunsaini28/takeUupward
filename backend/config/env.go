package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port                  string
	MongoURI              string
	MongoDBName           string
	FirebaseCredsPath     string // path to service-account JSON
	RazorpayKeyID         string
	RazorpayKeySecret     string
	RazorpayWebhookSecret string
	CourseAmountPaise     int64 // e.g. 1900 = ₹19.00
}

// Load reads environment variables (and a local .env file in dev).
// It never logs secret values.
func Load() *Config {
	// Only used for local dev; in prod, env vars are injected by the platform.
	if err := godotenv.Load(); err != nil {
		log.Println("no .env file found, relying on real environment variables")
	}

	cfg := &Config{
		Port:                  getEnv("PORT", "8080"),
		MongoURI:              mustGetEnv("MONGODB_URI"),
		MongoDBName:           getEnv("MONGODB_DB_NAME", "course_platform"),
		FirebaseCredsPath:     mustGetEnv("FIREBASE_SERVICE_ACCOUNT_JSON"),
		RazorpayKeyID:         mustGetEnv("RAZORPAY_KEY_ID"),
		RazorpayKeySecret:     mustGetEnv("RAZORPAY_KEY_SECRET"),
		RazorpayWebhookSecret: mustGetEnv("RAZORPAY_WEBHOOK_SECRET"),
		CourseAmountPaise:     1900,
	}
	return cfg
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func mustGetEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("missing required env var: %s", key)
	}
	return v
}