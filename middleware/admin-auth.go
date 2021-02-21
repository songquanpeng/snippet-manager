package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"snippet-manager/common"
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
				"code":    common.StatusPermissionDenied,
				"message": "admin required",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
