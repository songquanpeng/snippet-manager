package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"snippet-manager/common"
	"strings"
)

func JWTAuthMiddleware() func(c *gin.Context) {
	return func(c *gin.Context) {
		authHeader := c.Request.Header.Get("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "auth is blank",
			})
			c.Abort()
			return
		}
		parts := strings.SplitN(authHeader, " ", 2)
		if !(len(parts) == 2 && parts[0] == "Bearer") {
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "the format of auth is incorrect",
			})
			c.Abort()
			return
		}
		claims, err := common.ParseToken(parts[1])
		if err != nil {
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "invalid token",
			})
			c.Abort()
			return
		}
		if claims.IsBanned {
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": "you has been banned",
			})
			c.Abort()
			return
		}
		c.Set("username", claims.Username)
		c.Set("is_admin", claims.IsAdmin)
		c.Set("is_banned", claims.IsBanned)
		c.Next()
	}
}
