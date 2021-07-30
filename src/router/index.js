import { createRouter, createWebHashHistory } from 'vue-router'
import Inventory from '../views/Inventory.vue'
import Purchase from '../views/Purchase.vue'
import PurchaseExport from '../views/PurchaseExport.vue'
// import Home from '../views/Home.vue'

const routes = [
  { path: '/', redirect: '/inventory' },
  { path: '/inventory', component: Inventory, meta: { title: 'ERP - 库存查询' } },
  { path: '/purchase', component: Purchase, meta: { title: 'ERP - 采购单' } },
  { path: '/purchase/export', component: PurchaseExport, meta: { hideHeader: true, title: 'ERP - 导出采购单' } }
  // { path: '/purchase/export', component: PurchaseExport }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
