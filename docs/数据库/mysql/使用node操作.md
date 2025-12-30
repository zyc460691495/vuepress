---
title: 使用Node操作mysql
date: 2025-12-30
author: zyc
---

### 常见错误

1. 远程连接失败

`"Host 'xxx' is not allowed to connect to this MySQL server的解决`

用localhost的电脑修改登录权限
```sql
update user set host = '%' where user = 'root'; 
```