---
title: Spring Security
date: 2026-01-02
---

###  启用Spring Security

引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

```
Spring Security 提供了登录页面。要想通过认证，需要提供用户名和密码。用户名是 `user`。至于密码，它是随机生成并写入了应用程序日志文
件。日志条目应该是这样的：
```Using generated security password: 087cfc6a-027d-44bc-95d7-cbb3a798a1ea```

只需要在项目构建中添加 security starter，就可以获得以下安全特性：
- 所有的 HTTP 请求路径都需要认证。 
- 没有特定的角色或权限。
- 身份验证由 HTTP 基本身份验证提供。 
- 只有一个用户；用户名是 user。

### 配置身份验证
只是声明了一个 `PasswordEncoder` bean，将在创建新用户和登录验证用户身份时使用。在本例中，
我们使用的是 `BCryptPasswordEncoder`，它是 Spring Security 提供的密码编码器之一
```
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```
