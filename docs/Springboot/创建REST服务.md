---
title: 创建REST服务
date: 2026-01-09
author: zyc
---

### 编写REST ful 控制器

#### 从服务器获取数据

```java
@RestController
@RequestMapping(path = "/api/tacos", produces = "application/json")
@CrossOrigin(origins = "*")
public class TacoController {
    private TacoRepository tacoRepo;

    public TacoController(TacoRepository tacoRepo) {
        this.tacoRepo = tacoRepo;
    }
    
    @GetMapping(params = "recent")
    public Iterable<Taco> recentTacos() {
        PageRequest page = PageRequest.of(
                0, 12, Sort.by("createdAt").descending());
        return tacoRepo.findAll(page).getContent();
    }
}
```

`@RestController`注解有两个用途。首先，它是一个像 `@Controller` 和 `@Service` 这样的原型注解，它通过组件扫
描来标记一个类。但是与 `REST` 的讨论最相关的是， `@RestController` 注解告诉
Spring：控制器中的所有处理程序方法都应该将它们的返回值直接写入响应体，而不是在模型中被带到视图中进行呈现。
实际上，可以使用 `@Controller` + `@ResponseBody`以获得相同的结果。

`@RequestMapping`注解还设置了一个 `produces` 属性。这指定了 TacoController 中的任何处理程序方法只在
请求的 `Accept` 头包含 `“application/json”` 时才处理请求。这不仅**限制了 API 只生成 JSON 结果**，还允许另一个
控制器（可能是第 2 章中的 TacoController）**处理具有相同路径的请求**，只要这些请求不需要 JSON 输出。

```
@RequestMapping(path="/api/tacos", produces={"application/json", "text/xml"})
```

由于应用程序的 Angular 部分将运行在独立于 API 的主机或端口上（至少目前是这样），web 浏览器将阻止 Angular 客户端使用 API。这个
限制可以通过在服务器响应中包含 CORS（跨源资源共享）头来克服。Spring 使得使用 `@CrossOrigin` 注解应用
CORS 变得很容易。`@CrossOrigin` 允许来自任何域的客户端使用 API。
> 当你的 Angular 前端运行在 http://localhost:4200，而 Spring Boot API 运行在 http://localhost:8080 时，浏览器会因为同源策略阻止跨域请求。


假设需要提供一个端点，该端点通过其 ID 获取单个 taco。通过在处理程序方法的路径中使用占位符变量
并接受 path 变量的方法，可以捕获该 ID 并使用它通过存储库查找 taco 对象：

```
@GetMapping("/{id}")
public Optional<Taco> tacoById(@PathVariable("id") Long id) {
    return tacoRepo.findById(id);
}
```

这个控制器方法处理 `/api/tacos/{id}` 的 GET 请求，其中路径的 `{id}` 部分是占位符。请求中的实际值指定给 id 参数，
该参数通过 `@PathVariable` 映射到 `{id}` 占位符。

```java
@GetMapping("/{id}")
public ResponseEntity<Taco> tacoById(@PathVariable("id") Long id) {
    Optional<Taco> optTaco = tacoRepo.findById(id);
    if (optTaco.isPresent()) {
        return new ResponseEntity<>(optTaco.get(), HttpStatus.OK);
    }
    return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
}
```

现在， tacoById() 不返回 Taco 对象，而是返回一个 `ResponseEntity<Taco>` 。如果发现 taco，
则将 taco 对象**包装在 HTTP 状态为 OK 的 ResponseEntity 中**。
但是，如果没有找到 taco，则在 ResponseEntity 中包装一个 null，并加上一个 `HTTP status（NOT FOUND）`，
以指示客户端试图获取一个不存在的 taco。

#### 向服务器发送数据

```java
@PostMapping(consumes="application/json")
@ResponseStatus(HttpStatus.CREATED)
public Taco postTaco(@RequestBody Taco taco) {
  return tacoRepo.save(taco);
}
```

因为 postTaco() 将处理 HTTP POST 请求，所以它用 `@PostMapping` 注解，而不是 `@GetMapping` 。这里没有指定
path 属性，因此 postTaco() 方法将处理对 `/api/tacos` 的请求。路径是在 `TacoController` 类中由注解
`@RequestMapping` 指定的。

consumes 属性是请求输入，products 是请求输出。这里使用 consumes 表示
该方法将只处理内容为 `application/json` 类型的请求。

该方法的 Taco 参数用 `@RequestBody`注解，以指示请求应转换为 Taco 对象并绑定到参数上。此注解很重要：如
果没有它，Spring MVC 将假定您需要请求参数（查询参数或表单参数）。但是 `@RequestBody` 注解**确保请求主
体中的 JSON 绑定到 Taco 对象上**。

这里在 postTaco() 方法上使用了 `@ResponseStatus(HttpStatus.CREATED)` 注解。
在正常情况下，所有响应的 HTTP 状态码为 200（OK），表示请求成功。尽管 HTTP 200 响应总是好的，但它并不总是
具有足够的描述性。对于 POST 请求，HTTP 状态 201（CREATED）更具描述性，它告诉客户机，请求不仅成
功了，而且还创建了一个资源。在适当的地方使用 `@ResponseStatus` 将最具描述性和最准确的 HTTP 状态代码传
递给客户端总是一个好想法。

#### 修改服务器上的数据

在编写任何处理 HTTP `PUT` 或 `PATCH` 命令的控制器代码之前，应该花点时间考虑一下这个问题：为什么有两
种不同的 HTTP 方法来更新资源呢？

虽然 PUT 经常用于更新资源数据，但它实际上是 GET 语义的对立面。GET 请求用于将数据从服务器传输到客
户机，而 PUT 请求用于将数据从客户机发送到服务器。
从这个意义上说，PUT 实际上是用于执行大规模替换操作，而不是更新操作。相反，HTTP PATCH 的目的是执
行补丁或部分更新资源数据。

```java
@PutMapping(path="/{orderId}", consumes="application/json")
public TacoOrder putOrder(
  @PathVariable("orderId") Long orderId,
  @RequestBody TacoOrder order) {
  order.setId(orderId);
  return repo.save(order);
}
```

这可能行得通，但它要求客户端在 PUT 请求中**提交完整的订单数据**。从语义上讲，PUT 的意思是“把这个数据
放到这个 URL 上”，本质上是**替换任何已经存在的数据**。**如果订单的任何属性被省略，该属性的值将被 null 覆
盖**。

如果 PUT 完全替换了资源数据，那么应该如何处理只进行部分更新的请求？这就是 HTTP PATCH 请求和
Spring 的 `@PatchMapping` 的好处。可以这样写一个控制器方法来处理一个订单的 PATCH 请求：

```java
@PatchMapping(path = "/{orderId}", consumes = "application/json")
public TacoOrder patchOrder(@PathVariable("orderId") Long orderId,
                            @RequestBody TacoOrder patch) {
    TacoOrder order = repo.findById(orderId).get();
    if (patch.getDeliveryName() != null) {
        order.setDeliveryName(patch.getDeliveryName());
    }
    if (patch.getDeliveryStreet() != null) {
        order.setDeliveryStreet(patch.getDeliveryStreet());
    }
    if (patch.getDeliveryCity() != null) {
        order.setDeliveryCity(patch.getDeliveryCity());
    }
    // …… 
    return repo.save(order);
}
```

尽管 PATCH 在语义上暗示了部分更新，但是需要在处理程序方法中编写实际执行这种更新的代码。`PatchMapping`更像是一种规范。

#### 删除服务器上的数据

```java
@DeleteMapping("/{orderId}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void deleteOrder(@PathVariable("orderId") Long orderId) {
    try {
        repo.deleteById(orderId);
    } catch (EmptyResultDataAccessException e) {}
}
```

### Spring Data REST

`Spring Data REST` 是 Spring Data 家族中的另一个成员，它为 Spring Data 创建的存储库自动创建REST API。
只需将 Spring Data REST 添加到构建中，就可以获得一个 API，其中包含所定义的每个存储库接口的操作。

```xml

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-rest</artifactId>
</dependency>
```

通过在构建中简单地使用 Spring Data REST starter，应用程序可以自动配置，从而为 Spring Data 创建的任何存
储库（包括 Spring Data JPA、Spring Data Mongo 等）**自动创建 REST API**。

![](./public/img_8.png)

HATEOAS（Hypermedia As The Engine Of Application State） 核心思想: API 应该通过返回的响应告诉客户端下一步可以做什么

![](./public/img_9.png)

```json
{
  "_links": {
    "users": {
      "href": "http://localhost:8080/users{?page,size,sort*}",
      "templated": true
    },
    "profile": {
      "href": "http://localhost:8080/profile"
    }
  }
}

```

- users: 用户资源的入口点
    - href: 访问用户的URL
    - {?page,size,sort*}: 这是 URI 模板，表示支持参数：
        - page: 页码
        - size: 每页大小
        - sort: 排序字段（* 表示可以有多个排序条件）
    - templated: true: 表示这个URL是模板，需要填充参数

- profile: API 元数据描述,访问此链接可以获取API的详细信息

可以发送不同种类的请求，完成CRUD

- `http://localhost:8080/users/1`
- `http://localhost:8080/users?size=5&page=1`

配置基本路径

```yaml
spring:
  data:
  rest:
  base-path: /api
```

通过添加一个简单的注解，可以调整关系名称和路径：

```java
@Data
@Entity
// path="tacos" 是访问路径 rel 是_links显示名称
@RestResource(rel="tacos", path="tacos")
public class Taco {
 ...
}
```

### 使用REST服务

Spring 应用程序既提供 API，又向另一个应用程序的 API 发出请求，这种情况并不少见。事实上，在微服务的
世界里，这正变得越来越普遍。

从客户的角度来看，与 REST 资源进行交互需要做很多工作 —— 主要是单调乏味的样板文件。使用低级 HTTP
库，客户端需要创建一个客户端实例和一个请求对象，执行请求，解释响应，将响应映射到域对象，并处理过
程中可能抛出的任何异常。不管发送什么 HTTP 请求，所有这些样板文件都会重复。
为了避免这样的样板代码，Spring 提供了 `RestTemplate`。正如 JDBCTemplate 处理使用 JDBC 糟糕的那部分一
样，RestTemplate 使你不必为调用 REST 资源而做单调的工作。

要使用 RestTemplate，需要创建一个实例,或是将它声明为一个 bean，在需要它的时候将其注入

```java
RestTemplate rest = new RestTemplate();

@Bean
public RestTemplate restTemplate() {
 return new RestTemplate();
}
```

#### GET 资源

```java
public Ingredient getIngredientById(String ingredientId) {
   return rest.getForObject("http://localhost:8080/ingredients/{id}",
                                            Ingredient.class, ingredientId);
}
```
这里使用的是 `getForObject()` ，它接受一个字符串 URL 并为 URL 变量使用一个变量列表。传递给
`getForObject()` 的 `ingredientId` 参数用于填充给定 URL 中的 `{id}` 占位符。虽然在本例中只有一个 URL 变量，
但重要的是要知道变量参数是按**给定的顺序**分配给占位符的。

getForObject() 的第二个参数是响应应该绑定的类型。在这种情况下，应该将响应数据（可能是 JSON 格式）
反序列化为将要返回的 Ingredient 对象。
```java
public Ingredient getIngredientById(String ingredientId) {
    Map<String, String> urlVariables = new HashMap<>();
    urlVariables.put("id", ingredientId);
    return rest.getForObject("http://localhost:8080/ingredients/{id}",
    Ingredient.class, urlVariables);
```

构造一个 URI 对象

```java
public Ingredient getIngredientById(String ingredientId) {
    Map<String, String> urlVariables = new HashMap<>();
    urlVariables.put("id", ingredientId);
    URI url = UriComponentsBuilder
            .fromHttpUrl("http://localhost:8080/ingredients/{id}")
            .build(urlVariables);
    return rest.getForObject(url, Ingredient.class);
}
```

getForObject() 方法是获取资源的一种有效方法。但是，如果客户端需要的不仅仅是有效负载，可能需要考虑使用 `getForEntity()` 。

getForEntity() 的工作方式与 getForObject() 非常相似，但它返回的不是表示响应有效负载的域对象，而是包
装该域对象的 ResponseEntity 对象。ResponseEntity 允许访问附加的响应细节，比如响应头。
例如，假设除了 Ingredient 数据之外，还希望检查响应中的 Date 头信息，有了 getForEntity() 

```java
// getForObject()：只返回响应体（payload）
// 只得到：Ingredient{id="flour", name="面粉", ...}

// response包含：
// - 响应体：response.getBody() → Ingredient对象
// - HTTP状态码：response.getStatusCode() → 200 OK
// - 响应头：response.getHeaders() → Content-Type, Server等
// - 其他元数据
```

```java
public Ingredient getIngredientById(String ingredientId) {
    ResponseEntity<Ingredient> responseEntity =
            rest.getForEntity("http://localhost:8080/ingredients/{id}",
                    Ingredient.class, ingredientId);
    log.info("Fetched time: " + responseEntity.getHeaders().getDate());
    return responseEntity.getBody();
}
```


#### PUT 资源

```java

public void updateIngredient(Ingredient ingredient) {
   rest.put("http://localhost:8080/ingredients/{id}",
   ingredient, ingredient.getId());
}
```


#### DELETE 资源
```java
public void deleteIngredient(Ingredient ingredient) {
  rest.delete("http://localhost:8080/ingredients/{id}",
          ingredient.getId());
}
```


#### POST 资源数据

```java
public Ingredient createIngredient(Ingredient ingredient) {
  return rest.postForObject("http://localhost:8080/ingredients",
          ingredient, Ingredient.class);
}

public java.net.URI createIngredient(Ingredient ingredient) {
   return rest.postForLocation("http://localhost:8080/ingredients", ingredient);
}
```
`postForLocation()` 的工作方式与 `postForObject()` 非常相似，只是它返回的是新创建资源的 URI，而不是
资源对象本身。返回的 URI 派生自响应的 Location 头信息。如果同时需要位置和响应负载，可以调用
`postForEntity()` ：

```java
public Ingredient createIngredient(Ingredient ingredient) {
  ResponseEntity<Ingredient> responseEntity =
          rest.postForEntity("http://localhost:8080/ingredients",
                  ingredient,
                  Ingredient.class);
  log.info("New resource created at " +
          responseEntity.getHeaders().getLocation());
  return responseEntity.getBody();
}
```