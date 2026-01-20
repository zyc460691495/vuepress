<template><div><h3 id="解压" tabindex="-1"><a class="header-anchor" href="#解压"><span>解压</span></a></h3>
<p><img src="@source/数据库/mysql/public/img.png" alt=""></p>
<h3 id="配置环境变量" tabindex="-1"><a class="header-anchor" href="#配置环境变量"><span>配置环境变量</span></a></h3>
<p><img src="@source/数据库/mysql/public/img_1.png" alt="">
可以看到已经生效了
<img src="@source/数据库/mysql/public/img_2.png" alt=""></p>
<h3 id="写入配置文件" tabindex="-1"><a class="header-anchor" href="#写入配置文件"><span>写入配置文件</span></a></h3>
<p>在解压根目录下新建my.ini文件，写入下面的内容</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code class="language-text"><span class="line">[mysqld]</span>
<span class="line"># 设置3306端口</span>
<span class="line">port=3306</span>
<span class="line"># 设置mysql的安装目录</span>
<span class="line">basedir=D:\mysql-8.0.37-winx64\database</span>
<span class="line"># 设置mysql数据库的数据的存放目录</span>
<span class="line">datadir=D:\mysql-8.0.37-winx64\database\data</span>
<span class="line"># 允许最大连接数</span>
<span class="line">max_connections=200</span>
<span class="line"># 允许连接失败的次数。</span>
<span class="line">max_connect_errors=10</span>
<span class="line"># 服务端使用的字符集默认为utf8mb4</span>
<span class="line">character-set-server=utf8mb4</span>
<span class="line"># 创建新表时将使用的默认存储引擎</span>
<span class="line">default-storage-engine=INNODB</span>
<span class="line"># 默认使用“mysql_native_password”插件认证</span>
<span class="line">#mysql_native_password</span>
<span class="line">default_authentication_plugin=mysql_native_password</span>
<span class="line">#禁用sqlmode模式</span>
<span class="line">sql_mode=''</span>
<span class="line">[mysql]</span>
<span class="line"># 设置mysql客户端默认字符集</span>
<span class="line">default-character-set=utf8mb4</span>
<span class="line">[client]</span>
<span class="line"># 设置mysql客户端连接服务端时默认使用的端口</span>
<span class="line">port=3306</span>
<span class="line">default-character-set=utf8mb4</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="开始安装" tabindex="-1"><a class="header-anchor" href="#开始安装"><span>开始安装</span></a></h3>
<p>在解压目录下新建刚刚配置的安装目录和数据存放目录
<img src="@source/数据库/mysql/public/img_3.png" alt="">
切换到解压目录下运行初始化命令</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line">mysqld <span class="token parameter variable">--initialize</span> <span class="token parameter variable">--console</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><img src="@source/数据库/mysql/public/img_4.png" alt="">
记住最后的初始密码<code v-pre>ZAEU&gt;e..y7p5</code></p>
<p>切换到解压目录下运行安装命令</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 后面的服务名可以不写，默认的名字为 mysql。</span></span>
<span class="line"><span class="token comment"># 当然，如果你的电脑上需要安装多个MySQL服务，就可以用不同的名字区分了，比如 mysql8 和 mysql9。</span></span>
<span class="line">mysqld <span class="token parameter variable">--install</span> <span class="token punctuation">[</span>服务名称<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="日常运维" tabindex="-1"><a class="header-anchor" href="#日常运维"><span>日常运维</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code class="language-bash"><span class="line"><span class="token comment"># 启动服务</span></span>
<span class="line">net start mysql</span>
<span class="line"><span class="token comment"># 停止服务</span></span>
<span class="line">net stop mysql</span>
<span class="line"><span class="token comment"># 修改密码，先登录输入旧密码</span></span>
<span class="line">mysql <span class="token parameter variable">-u</span> root <span class="token parameter variable">-p</span></span>
<span class="line">ALTER <span class="token environment constant">USER</span> <span class="token string">'root'</span>@<span class="token string">'localhost'</span> IDENTIFIED WITH mysql_native_password BY <span class="token string">'新密码'</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="@source/数据库/mysql/public/img_5.png" alt=""></p>
</div></template>


