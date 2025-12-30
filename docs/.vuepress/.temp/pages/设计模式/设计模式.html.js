import comp from "G:/JetBrains/vuepress/docs/.vuepress/.temp/pages/设计模式/设计模式.html.vue"
const data = JSON.parse("{\"path\":\"/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F.html\",\"title\":\"二、设计模式\",\"lang\":\"en-US\",\"frontmatter\":{},\"git\":{\"updatedTime\":1766743677000,\"contributors\":[{\"name\":\"zyc\",\"username\":\"zyc\",\"email\":\"460691495@qq.com\",\"commits\":2,\"url\":\"https://github.com/zyc\"}],\"changelog\":[{\"hash\":\"0ab894fc9e7b0ce2ed34342d4e723d7a06ad4d5a\",\"time\":1766743677000,\"email\":\"460691495@qq.com\",\"author\":\"zyc\",\"message\":\"添加文档\"},{\"hash\":\"8a62181facd48331c7b2bdf7f895fc05eb284ae9\",\"time\":1766715630000,\"email\":\"460691495@qq.com\",\"author\":\"zyc\",\"message\":\"第一次提交\"}]},\"filePathRelative\":\"设计模式/设计模式.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
