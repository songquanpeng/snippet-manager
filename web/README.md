## 难点
+ [ ] 全局弹窗。
+ [ ] 全局状态共享。

## API
```go
router.GET("/status", controller.GetStatus)
router.POST("/auth", controller.Auth)
apiGroup := router.Group("/api/")
{
    basicAuth := apiGroup.Group("/")
    basicAuth.Use(middleware.JWTAuthMiddleware())
    {
        basicAuth.GET("/user", controller.GetUser)
        basicAuth.PUT("/user", controller.UpdateUser)

        basicAuth.GET("/tag/:tag", controller.GetSnippetsByTag)

        basicAuth.GET("/snippet", controller.GetSnippetsByUser)
        basicAuth.POST("/snippet", controller.CreateSnippet)
        basicAuth.PUT("/snippet", controller.UpdateSnippet)
        basicAuth.DELETE("/snippet/:id", controller.DeleteSnippet)

        adminAuth := basicAuth.Group("/")
        adminAuth.Use(middleware.AdminAuthMiddleware())
        {
            adminAuth.GET("/user/:username", controller.GetUser)
            adminAuth.PUT("/user/:username", controller.UpdateUser)
            adminAuth.DELETE("/user/:username", controller.DeleteUser)
        }
    }
    apiGroup.GET("/snippet/:id", controller.GetSnippet)
    apiGroup.GET("/search/snippet", controller.SearchSnippet)
    apiGroup.GET("/search/snippet/:query", controller.SearchSnippet)
    apiGroup.POST("/user", controller.CreateUser)
}
```