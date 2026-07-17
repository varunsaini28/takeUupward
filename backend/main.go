package main

import (
	"context"
	"log"

	"course-backend/config"
	"course-backend/db"
	"course-backend/handlers"
	"course-backend/middleware"

	firebase "firebase.google.com/go/v4"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/option"
)

func main() {
	cfg := config.Load()

	// --- Mongo ---
	database, disconnect, err := db.Connect(cfg.MongoURI, cfg.MongoDBName)
	if err != nil {
		log.Fatalf("mongo connect failed: %v", err)
	}
	defer disconnect()

	// --- Firebase Admin SDK ---
	// FirebaseCredsPath points at the service-account JSON downloaded from
	// Firebase Console > Project Settings > Service Accounts.
	// Never commit this file or ship it to the frontend.
	opt := option.WithCredentialsFile(cfg.FirebaseCredsPath)
	fbApp, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("firebase app init failed: %v", err)
	}
	authClient, err := fbApp.Auth(context.Background())
	if err != nil {
		log.Fatalf("firebase auth client init failed: %v", err)
	}

	// --- Handlers ---
	userHandler := handlers.NewUserHandler(database)
	paymentHandler := handlers.NewPaymentHandler(
		database,
		cfg.RazorpayKeyID,
		cfg.RazorpayKeySecret,
		cfg.RazorpayWebhookSecret,
		cfg.CourseAmountPaise,
	)

	// --- Router ---
	r := gin.Default()
	r.Use(corsMiddleware("*"))

	r.GET("/healthz", func(c *gin.Context) { c.JSON(200, gin.H{"status": "ok"}) })

	// Webhook has its own signature check, not Firebase auth — Razorpay
	// itself is the caller, not a signed-in user.
	r.POST("/api/webhooks/razorpay", paymentHandler.Webhook)

	api := r.Group("/api")
	api.Use(middleware.FirebaseAuth(authClient))
	{
		api.POST("/user/sync", userHandler.Sync)
		api.POST("/payment/order", paymentHandler.CreateOrder)
		api.POST("/payment/verify", paymentHandler.Verify)
		api.GET("/course/:courseId/access", paymentHandler.HasAccess)
	}

	log.Printf("listening on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("server error: %v", err)
	}
}

// corsMiddleware allows the Next.js frontend (a different origin/port in
// dev) to call this API with credentials/headers like Authorization.
func corsMiddleware(allowedOrigin string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", allowedOrigin)
		c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}