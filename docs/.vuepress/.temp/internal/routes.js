export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"G:/JetBrains/vuepress/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":""} }],
  ["/Node.js/Node%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80.html", { loader: () => import(/* webpackChunkName: "Node.js_Node编程基础.html" */"G:/JetBrains/vuepress/docs/.vuepress/.temp/pages/Node.js/Node编程基础.html.js"), meta: {"title":"Node编程基础"} }],
  ["/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/%E4%B8%83%E5%A4%A7%E5%8E%9F%E5%88%99.html", { loader: () => import(/* webpackChunkName: "设计模式_七大原则.html" */"G:/JetBrains/vuepress/docs/.vuepress/.temp/pages/设计模式/七大原则.html.js"), meta: {"title":"设计模式的七大原则"} }],
  ["/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F.html", { loader: () => import(/* webpackChunkName: "设计模式_设计模式.html" */"G:/JetBrains/vuepress/docs/.vuepress/.temp/pages/设计模式/设计模式.html.js"), meta: {"title":"二、设计模式"} }],
  ["/%E6%95%B0%E6%8D%AE%E5%BA%93/mysql/DataGrip%E8%BF%9E%E6%8E%A5MySQL.html", { loader: () => import(/* webpackChunkName: "数据库_mysql_DataGrip连接MySQL.html" */"G:/JetBrains/vuepress/docs/.vuepress/.temp/pages/数据库/mysql/DataGrip连接MySQL.html.js"), meta: {"title":"datagrip连接mysql"} }],
  ["/%E6%95%B0%E6%8D%AE%E5%BA%93/mysql/zip%E7%A6%BB%E7%BA%BF%E5%AE%89%E8%A3%85.html", { loader: () => import(/* webpackChunkName: "数据库_mysql_zip离线安装.html" */"G:/JetBrains/vuepress/docs/.vuepress/.temp/pages/数据库/mysql/zip离线安装.html.js"), meta: {"title":"以zip方式本地安装"} }],
  ["/%E9%A1%B9%E7%9B%AE%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7/Maven/maven.html", { loader: () => import(/* webpackChunkName: "项目管理工具_Maven_maven.html" */"G:/JetBrains/vuepress/docs/.vuepress/.temp/pages/项目管理工具/Maven/maven.html.js"), meta: {"title":"maven"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"G:/JetBrains/vuepress/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
