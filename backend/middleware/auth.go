package middleware

import (
	"context"
	"net/http"
	"strings"
	"time"

	firebaseauth "firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
)

const ctxUIDKey = "firebase_uid"
const ctxEmailKey = "firebase_email"

// FirebaseAuth verifies the Bearer ID token on every protected route.
// On success it stores the verified UID/email in the Gin context.
func FirebaseAuth(authClient *firebaseauth.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if !strings.HasPrefix(header, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing bearer token"})
			return
		}
		idToken := strings.TrimPrefix(header, "Bearer ")

		ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
		defer cancel()

		// This validates signature, expiry, issuer and audience against
		// Google's public keys — never trust a token without this check.
		token, err := authClient.VerifyIDToken(ctx, idToken)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			return
		}

		c.Set(ctxUIDKey, token.UID)
		if email, ok := token.Claims["email"].(string); ok {
			c.Set(ctxEmailKey, email)
		}
		c.Next()
	}
}

func UID(c *gin.Context) string {
	v, _ := c.Get(ctxUIDKey)
	uid, _ := v.(string)
	return uid
}

func Email(c *gin.Context) string {
	v, _ := c.Get(ctxEmailKey)
	email, _ := v.(string)
	return email
}