package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	FirebaseUID string             `bson:"firebase_uid" json:"firebase_uid"`
	Email       string             `bson:"email" json:"email"`
	Name        string             `bson:"name" json:"name"`
	PhotoURL    string             `bson:"photo_url,omitempty" json:"photo_url,omitempty"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
}

type PaymentStatus string

const (
	StatusCreated PaymentStatus = "created"
	StatusPaid    PaymentStatus = "paid"
	StatusFailed  PaymentStatus = "failed"
)

type Payment struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID          primitive.ObjectID `bson:"user_id" json:"user_id"`
	CourseID        string             `bson:"course_id" json:"course_id"`
	RazorpayOrderID string             `bson:"razorpay_order_id" json:"razorpay_order_id"`
	RazorpayPayID   string             `bson:"razorpay_payment_id,omitempty" json:"razorpay_payment_id,omitempty"`
	AmountPaise     int64              `bson:"amount_paise" json:"amount_paise"`
	Status          PaymentStatus      `bson:"status" json:"status"`
	CreatedAt       time.Time          `bson:"created_at" json:"created_at"`
	VerifiedAt      *time.Time         `bson:"verified_at,omitempty" json:"verified_at,omitempty"`
}