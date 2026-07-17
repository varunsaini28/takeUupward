package handlers

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type razorpayClient struct {
	keyID     string
	keySecret string
	http      *http.Client
}

func newRazorpayClient(keyID, keySecret string) *razorpayClient {
	return &razorpayClient{keyID: keyID, keySecret: keySecret, http: &http.Client{}}
}

type createOrderResp struct {
	ID       string `json:"id"`
	Amount   int64  `json:"amount"`
	Currency string `json:"currency"`
	Status   string `json:"status"`
}

// CreateOrder calls POST /v1/orders on Razorpay using Basic Auth (key_id:key_secret).
func (r *razorpayClient) CreateOrder(amountPaise int64, currency, receipt string) (*createOrderResp, error) {
	body := map[string]interface{}{
		"amount":   amountPaise,
		"currency": currency,
		"receipt":  receipt,
	}
	b, _ := json.Marshal(body)

	req, err := http.NewRequest(http.MethodPost, "https://api.razorpay.com/v1/orders", bytes.NewReader(b))
	if err != nil {
		return nil, err
	}
	req.SetBasicAuth(r.keyID, r.keySecret)
	req.Header.Set("Content-Type", "application/json")

	resp, err := r.http.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("razorpay order create failed: %s", string(respBody))
	}

	var out createOrderResp
	if err := json.Unmarshal(respBody, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

// VerifyPaymentSignature checks the client-returned signature for a checkout
// success callback: HMAC-SHA256("order_id|payment_id", key_secret).
func (r *razorpayClient) VerifyPaymentSignature(orderID, paymentID, signature string) bool {
	payload := orderID + "|" + paymentID
	mac := hmac.New(sha256.New, []byte(r.keySecret))
	mac.Write([]byte(payload))
	expected := hex.EncodeToString(mac.Sum(nil))
	return hmac.Equal([]byte(expected), []byte(signature))
}

// VerifyWebhookSignature checks the X-Razorpay-Signature header against the
// raw request body, using the separate webhook secret configured in the
// Razorpay dashboard (NOT the API key secret).
func VerifyWebhookSignature(rawBody []byte, signature, webhookSecret string) bool {
	mac := hmac.New(sha256.New, []byte(webhookSecret))
	mac.Write(rawBody)
	expected := hex.EncodeToString(mac.Sum(nil))
	return hmac.Equal([]byte(expected), []byte(signature))
}