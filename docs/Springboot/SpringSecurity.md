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
声明了一个 `PasswordEncoder` bean，将在创建新用户和登录验证用户身份时使用。在本例中，
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
使用示例
```
PasswordEncoder encoder
encoder.encode("password")
```

### 保护Web请求


```
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
   return http.build();
}
```

这个`filterChain()`方法接受 HttpSecurity 对象，充当的生成器，用于 web 级别安全配置。一旦安全配置通过
HttpSecurity 对象完成设置，调用 build() 方法将创建并返回一个 SecurityFilterChain 对象。可以配置 HttpSecurity 的属性包括：
- 在允许服务请求之前，需要满足特定的安全条件 
- 配置自定义登录页面 
- 使用户能够退出应用程序 
- 配置跨站请求伪造保护

1. 拦截请求
```
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
  return http
    .authorizeRequests()
    .antMatchers("/design", "/orders").hasRole("USER")
    .antMatchers("/", "/**").permitAll()
   .and()
   .build();
}
```
对 `authorizeRequests()` 的调用返回一个对象（`ExpressionUrlAuthorizationConfigurer.ExpressionInterceptUrlRegistry`），可以在该对象上指定 URL 路径和
模式以及这些路径的安全需求。
对于 /design 和 /orders 的请求应该是授予 ROLE USER 权限的用户的请求。
传递给 hasRole() 的角色上不要包含“ROLE”前缀，否则会被 hasRole() 认为有相应权限。
所有的请求都应该被允许给所有的用户。
首先声明的安全规则优先于后声明的安全规则。如果交换这两个安全规则的顺序，所
有请求都将应用 permitAll() ，那么关于 /design 和 /orders 请求的规则将不起作用。

2. 自定义登录页面

```
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
return http
.authorizeRequests()
.antMatchers("/design", "/orders").access("hasRole('USER')")
.antMatchers("/", "/**").access("permitAll()")
.and()
.formLogin()
.loginPage("/login")
.and()
.build();
}
```

Spring Security 的 DSL 使用流式API和构建器模式。每个配置方法（如 authorizeRequests()、formLogin()）返回的是特定类型的配置对象，需要 and() 来返回到 HttpSecurity 主对象。

3. 路径映射

```
@Configuration
public class WebConfig implements WebMvcConfigurer {

  
  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
     // 将 "/" 映射到名为 "home" 的视图
    registry.addViewController("/").setViewName("home");
    // 将 "/login" 映射到名为 "login" 的视图（同名）
    registry.addViewController("/login");
  }
}
```

