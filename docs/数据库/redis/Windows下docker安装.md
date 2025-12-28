---
title: Docker安装Redis
date: 2025-12-28
---

### 创建持久化目录

```bash
mkdir F:\dockerAll\redis\conf  # 存放 Redis 配置文件
mkdir F:\dockerAll\redis\data  # 存放 Redis 持久化数据
```

下载到[配置文件](http://download.redis.io/redis-stable/redis.conf)到`F:\dockerAll\redis\conf`，并添加下面的配置

```
1. 允许远程访问（注释 bind 127.0.0.1）
bind 127.0.0.1 -::1  # 注释此行
Redis 只监听来自本地的连接。通过注释掉 bind 127.0.0.1 -::1，
Redis 将会监听所有网络接口上的连接，这意味着外部网络上的设备也可以连接到 Redis 服务器。
这会使 Redis 变得可从外部访问，而不仅仅是从本地。

2. 开启密码认证, 将该配置项注释放开，并填写连接密码
requirepass 123456

# 3. 开启持久化（默认 RDB 模式，按需开启 AOF
# appendonly yes  # 开启 AOF 持久化（推荐）
# appendfilename "appendonly.aof"

# 4. 数据存储目录（容器内路径，与主机挂载对应）
# dir /data
```

### 启动容器

```bash
docker run 
-p 6379:6379 # 宿主机的 6379 端口映射到容器的 6379 端口
--name redis2 # 容器名称
-v F:\dockerAll\redis\conf:/etc/redis  # 这使得 Redis 容器使用宿主机上的配置文件  
-v F:\dockerAll\redis\data:/data  # 即使容器被删除，数据也不会丢失
-d  # 以守护进程（后台）模式运行容器
redis:latest 
redis-server /etc/redis/redis.conf --appendonly yes
# 这是容器启动后执行的命令。它启动 Redis 服务器，并指定使用 /etc/redis/redis.conf 作为配置文件，
# 同时启用 AOF（Append-Only File）持久化模式。
```