package handlers

import (
	"context"
	"net/http"
	"time"

	"course-backend/middleware"
	"course-backend/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type UserHandler struct {
	Users *mongo.Collection
}

func NewUserHandler(db *mongo.Database) *UserHandler {
	return &UserHandler{Users: db.Collection("users")}
}

// Sync is called once after the frontend completes Firebase sign-in.
// It upserts the user by firebase_uid so repeat logins don't duplicate rows.
func (h *UserHandler) Sync(c *gin.Context) {
	uid := middleware.UID(c)
	email := middleware.Email(c)

	var body struct {
		Name     string `json:"name"`
		PhotoURL string `json:"photo_url"`
	}
	_ = c.ShouldBindJSON(&body)

	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	filter := bson.M{"firebase_uid": uid}
	update := bson.M{
		"$set": bson.M{
			"firebase_uid": uid,
			"email":        email,
			"name":         body.Name,
			"photo_url":    body.PhotoURL,
		},
		"$setOnInsert": bson.M{"created_at": time.Now().UTC()},
	}
	opts := options.Update().SetUpsert(true)

	if _, err := h.Users.UpdateOne(ctx, filter, update, opts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to sync user"})
		return
	}

	var user models.User
	_ = h.Users.FindOne(ctx, filter).Decode(&user)
	c.JSON(http.StatusOK, user)
}