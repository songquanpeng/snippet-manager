package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"snippet-manager/common"
	"testing"
)

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func TestStatusRoute(t *testing.T) {
	server := httptest.NewServer(setupServer())
	defer server.Close()

	resp, err := http.Get(fmt.Sprintf("%s/status", server.URL))
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	if resp.StatusCode != 200 {
		t.Fatalf("Expected status code 200, got %v", resp.StatusCode)
	}
	data := &Response{}
	json.NewDecoder(resp.Body).Decode(data)
	if data.Code != common.StatusOk {
		t.Fatalf("Expected message status code %d, got %v", common.StatusOk, resp.StatusCode)
	}
}

func TestUserRelatedRoute(t *testing.T) {
	server := httptest.NewServer(setupServer())
	defer server.Close()
	client := &http.Client{}

	// Create an user
	var url = fmt.Sprintf("%s/api/user", server.URL)
	var jsonStr = []byte(`{"username":"test","password":"123456"}`)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := client.Do(req)
	defer resp.Body.Close()
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	if resp.StatusCode != 200 {
		t.Fatalf("Expected status code 200, got %v", resp.StatusCode)
	}
	data := &Response{}
	json.NewDecoder(resp.Body).Decode(data)
	if data.Code != common.StatusOk {
		t.Fatalf("Expected message status code %d, got %v", common.StatusOk, data.Code)
	}

	// Get token
	url = fmt.Sprintf("%s/auth", server.URL)
	jsonStr = []byte(`{"username":"test","password":"123456"}`)
	req, err = http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	req.Header.Set("Content-Type", "application/json")
	resp2, err := client.Do(req)
	defer resp2.Body.Close()
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	if resp2.StatusCode != 200 {
		t.Fatalf("Expected status code 200, got %v", resp.StatusCode)
	}
	data = &Response{}
	json.NewDecoder(resp2.Body).Decode(data)
	if data.Code != common.StatusOk {
		t.Fatalf("Expected message status code %d, got %v", common.StatusOk, data.Code)
	}
}
