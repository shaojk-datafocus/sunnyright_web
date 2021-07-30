import {
  ElButton,
  ElInput,
  ElSwitch,
  ElContainer,
  ElHeader,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElMenuItemGroup,
  ElSubmenu,
  ElTable,
  ElTableColumn,
  ElRow,
  ElCol,
  ElPagination,
  ElDatePicker
} from 'element-plus'
// import lang from 'element-plus/lib/locale/lang/zh-cn'
// import locale from 'element-plus/lib/locale'
export default (app) => {
  // locale.use(lang)
  app.use(ElButton)
  app.use(ElContainer)
  app.use(ElHeader)
  app.use(ElMain)
  app.use(ElMenu)
  app.use(ElMenuItem)
  app.use(ElMenuItemGroup)
  app.use(ElSubmenu)
  app.use(ElTable)
  app.use(ElTableColumn)
  app.use(ElInput)
  app.use(ElRow)
  app.use(ElCol)
  app.use(ElPagination)
  app.use(ElSwitch)
  app.use(ElDatePicker)
}
