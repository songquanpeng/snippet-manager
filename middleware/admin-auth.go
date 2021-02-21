package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func AdminAuthMiddleware() func(c *gin.Context) {
	return func(c *gin.Context) {
		value, ok := c.Get("is_admin")
		isAdmin := false
		if ok {
			isAdmin = value.(bool)
		}
		if !isAdmin {
			c.JSON(http.StatusOK, gin.H{
				"code":    false,
				"message": "admin required",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
