package handlers

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"time"

	"course-backend/middleware"
	"course-backend/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type PaymentHandler struct {
	Users       *mongo.Collection
	Payments    *mongo.Collection
	Razorpay    *razorpayClient
	AmountPaise int64
	WebhookKey  string
}

func NewPaymentHandler(db *mongo.Database, keyID, keySecret, webhookSecret string, amountPaise int64) *PaymentHandler {
	return &PaymentHandler{
		Users:       db.Collection("users"),
		Payments:    db.Collection("payments"),
		Razorpay:    newRazorpayClient(keyID, keySecret),
		AmountPaise: amountPaise,
		WebhookKey:  webhookSecret,
	}
}

func (h *PaymentHandler) currentUser(c *gin.Context) (*models.User, error) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()
	var user models.User
	err := h.Users.FindOne(ctx, bson.M{"firebase_uid": middleware.UID(c)}).Decode(&user)
	return &user, err
}

// CreateOrder: POST /api/payment/order  { "course_id": "cloud-computing" }
func (h *PaymentHandler) CreateOrder(c *gin.Context) {
	var body struct {
		CourseID string `json:"course_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "course_id is required"})
		return
	}

	user, err := h.currentUser(c)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found, call /api/user/sync first"})
		return
	}

	order, err := h.Razorpay.CreateOrder(h.AmountPaise, "INR", user.ID.Hex()+"-"+body.CourseID)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "could not create razorpay order"})
		return
	}

	payment := models.Payment{
		ID:              primitive.NewObjectID(),
		UserID:          user.ID,
		CourseID:        body.CourseID,
		RazorpayOrderID: order.ID,
		AmountPaise:     h.AmountPaise,
		Status:          models.StatusCreated,
		CreatedAt:       time.Now().UTC(),
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()
	if _, err := h.Payments.InsertOne(ctx, payment); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save payment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"order_id": order.ID,
		"amount":   order.Amount,
		"currency": order.Currency,
		"key_id":   h.Razorpay.keyID, // safe to expose: this is the public key
	})
}

// Verify: POST /api/payment/verify
// { "razorpay_order_id", "razorpay_payment_id", "razorpay_signature" }
// This is the primary confirmation path right after Checkout.js succeeds.
func (h *PaymentHandler) Verify(c *gin.Context) {
	var body struct {
		OrderID   string `json:"razorpay_order_id" binding:"required"`
		PaymentID string `json:"razorpay_payment_id" binding:"required"`
		Signature string `json:"razorpay_signature" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing verification fields"})
		return
	}

	if !h.Razorpay.VerifyPaymentSignature(body.OrderID, body.PaymentID, body.Signature) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "signature verification failed"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	now := time.Now().UTC()
	res, err := h.Payments.UpdateOne(ctx,
		bson.M{"razorpay_order_id": body.OrderID},
		bson.M{"$set": bson.M{
			"razorpay_payment_id": body.PaymentID,
			"status":              models.StatusPaid,
			"verified_at":         now,
		}},
	)
	if err != nil || res.MatchedCount == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to record payment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "paid"})
}

// Webhook: POST /api/webhooks/razorpay
// Source of truth for payment status — covers cases where the browser
// callback in Verify() never fires (tab closed, network drop, etc).
// Must read the RAW body before any JSON binding, since the signature
// is computed over the exact bytes Razorpay sent.
func (h *PaymentHandler) Webhook(c *gin.Context) {
	rawBody, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	signature := c.GetHeader("X-Razorpay-Signature")
	if !VerifyWebhookSignature(rawBody, signature, h.WebhookKey) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid webhook signature"})
		return
	}

	var event struct {
		Event   string `json:"event"`
		Payload struct {
			Payment struct {
				Entity struct {
					ID     string `json:"id"`
					OrderID string `json:"order_id"`
					Status string `json:"status"`
				} `json:"entity"`
			} `json:"payment"`
		} `json:"payload"`
	}
	if err := json.Unmarshal(rawBody, &event); err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	if event.Event == "payment.captured" {
		ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
		defer cancel()
		now := time.Now().UTC()
		_, _ = h.Payments.UpdateOne(ctx,
			bson.M{"razorpay_order_id": event.Payload.Payment.Entity.OrderID},
			bson.M{"$set": bson.M{
				"razorpay_payment_id": event.Payload.Payment.Entity.ID,
				"status":              models.StatusPaid,
				"verified_at":         now,
			}},
		)
	}

	c.Status(http.StatusOK)
}

// HasAccess: GET /api/course/:courseId/access
// Access is simply "does a paid payment doc exist for this user+course".
func (h *PaymentHandler) HasAccess(c *gin.Context) {
	courseID := c.Param("courseId")
	user, err := h.currentUser(c)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"has_access": false})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()
	count, _ := h.Payments.CountDocuments(ctx, bson.M{
		"user_id":   user.ID,
		"course_id": courseID,
		"status":    models.StatusPaid,
	})

	c.JSON(http.StatusOK, gin.H{"has_access": count > 0})
}