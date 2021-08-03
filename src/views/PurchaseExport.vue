<template>
  <div>
    <el-row style="margin-bottom: 10px" id="panel">
      <el-col :span="3"><strong>导出采购单</strong></el-col>
      <el-col :span="3"><el-switch v-model="onlyStockOut" active-text="仅显示缺货项"></el-switch></el-col>
      <el-col :span="3"><el-switch v-model="mergeItems" active-text="合并同类项"></el-switch></el-col>
      <el-col :span="6"><el-switch v-model="sortItems" active-text="升序排列" inactive-text="降序排列"></el-switch></el-col>
      <el-col :span="6">
        <el-button size="small" @click="printPurchase">打印</el-button>
        <el-button size="small" @click="exportCSV">导出</el-button>
      </el-col>
    </el-row>
    <table>
        <tr>
          <th>#</th>
          <th>商品编号</th>
          <th>规格编号</th>
          <th>规格</th>
          <th>数量</th>
          <th>可销售数量</th>
          <th>供应商货号</th>
          <th>供应商</th>
        </tr>
        <tr v-for="(item,i) in tableData" :key="i">
          <td>{{i+1}}</td>
          <td>{{item.item_code}}</td>
          <td>{{item.sku_code}}</td>
          <td>{{item.sku_name}}</td>
          <td><input :value="item.qty"></td>
          <td>{{item.salable_qty}}</td>
          <td>{{item.supplier_outerid}}</td>
          <td>{{item.supplier_name}}</td>
        </tr>
    </table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      purchaseExportData: [],
      tableData: [],
      onlyStockOut: true,
      mergeItems: true,
      inventory: [],
      sortItems: true,
      printing: false
    }
  },
  created () {
    const purchaseOrders = JSON.parse(localStorage.getItem('purchaseExportData'))
    purchaseOrders.forEach((order) => {
      order.detailList.forEach(item => {
        item.supplier_name = order.supplier_name
        this.purchaseExportData.push(item)
      })
    })
    console.log(this.purchaseExportData)
    this.queryInventoryByBatch()
  },
  watch: {
    onlyStockOut (value, origin) {
      this.render(value, this.mergeItems)
    },
    mergeItems (value, origin) {
      this.render(this.onlyStockOut, value)
    },
    sortItems (value, origin) {
      if (value) {
        this.tableData.sort(this.ascend_)
        this.tableData.sort(this.ascend)
      } else {
        this.tableData.sort(this.descend_)
        this.tableData.sort(this.descend)
      }
    }
  },
  methods: {
    render (onlyStockOut, mergeItems) {
      this.tableData = []
      this.purchaseExportData.forEach((item_) => {
        const item = { item_code: item_.item_code, sku_code: item_.sku_code, sku_name: item_.sku_name, qty: item_.qty, salable_qty: item_.salable_qty, supplier_outerid: item_.supplier_outerid, supplier_name: item_.supplier_name } // 深拷贝item
        if (onlyStockOut) { // 开启仅缺货 与 可销售为负数
          if (item.salable_qty < 0) {
            if (item.qty > Math.abs(item.salable_qty)) { // 这使得采购的数量最多只会等于欠的数量
              item.qty = Math.abs(item.salable_qty)
            }
            this.tableData.push(item)
          }
        } else {
          this.tableData.push(item)
        }
      })
      if (mergeItems) { // 聚合相同sku_code项
        const itemMap = {}
        this.tableData.forEach((item) => {
          if (!Object.prototype.hasOwnProperty.call(itemMap, item.sku_code)) {
            itemMap[item.sku_code] = item
          } else {
            itemMap[item.sku_code].qty += item.qty
            console.log(itemMap[item.sku_code].qty + ' ' + itemMap[item.sku_code].salable_qty)
            if (itemMap[item.sku_code].qty > Math.abs(itemMap[item.sku_code].salable_qty)) { // 合并之后可能导致数量变多
              console.log(itemMap[item.sku_code])
              itemMap[item.sku_code].qty = Math.abs(itemMap[item.sku_code].salable_qty)
            }
          }
        })
        this.tableData = []
        for (const key in itemMap) {
          this.tableData.push(itemMap[key])
        }
      }
      if (this.sortItems) {
        this.tableData.sort(this.ascend_)
        this.tableData.sort(this.ascend)
      } else {
        this.tableData.sort(this.descend_)
        this.tableData.sort(this.descend)
      }
      console.log(this.tableData)
    },
    ascend (x, y) {
      return x.supplier_name.localeCompare(y.supplier_name, 'zh-CN') // 按照数组的第4个值升序排列
    },
    ascend_ (x, y) {
      return x.sku_code.localeCompare(y.sku_code, 'zh-CN') // 按照数组的第4个值升序排列
    },
    descend (x, y) {
      return y.supplier_name.localeCompare(x.supplier_name, 'zh-CN') // 按照数组的第4个值升序排列
    },
    descend_ (x, y) {
      return y.sku_code.localeCompare(x.sku_code, 'zh-CN') // 按照数组的第4个值升序排列
    },
    printPurchase () {
      document.getElementById('panel').style = 'display:none'
      print()
      document.getElementById('panel').style = 'margin-bottom: 10px'
    },
    exportCSV () {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()

      // const data = document.getElementsByClassName('table')[0].innerText.replace(/\t/g, '\t,').replace(/\n\n/g, '\n')
      let purchaseData = '商品编号,规格编号,规格,数量,可销售数量,供应商货号,供应商\n'
      this.tableData.forEach(item => {
        purchaseData += item.item_code + ','
        purchaseData += item.sku_code + ','
        purchaseData += item.sku_name + ','
        purchaseData += item.qty + ','
        purchaseData += item.salable_qty + ','
        purchaseData += item.supplier_outerid + ','
        purchaseData += item.supplier_name + '\n' // 深拷贝item
      })
      const blob = new Blob(['\ufeff' + purchaseData], { type: 'text/csv,charset=utf-8' })
      const csvUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = '采购单' + year + '-' + month + '-' + day + ' ' + hour + '-' + minute + '-' + second + '.csv'
      link.href = csvUrl
      link.click()
    },
    async queryInventoryByBatch () {
      const itemList = []
      this.purchaseExportData.forEach(item => {
        itemList.push(item.item_code)
      })
      const { data: res } = await this.$axios.post('/api/inventory/queryBatch', { itemList: itemList })
      if (!res.success) return this.$message.error(res.errCode)
      this.inventory = res.data // 返回的是整个商品的信息，需要分别获取每个sku的数据
      this.purchaseExportData.forEach(item => { // 遍历每个商品，查询对应的数据
        const stock = this.inventory[item.item_code]
        item.salable_qty = stock[item.sku_code].salable_qty
        item.supplier_outerid = stock.supplier_outerid
      })
      this.render(this.onlyStockOut, this.mergeItems)
    }
  }
}
</script>

<style scoped>
table {
  border: 1px solid black;
  border-collapse: collapse;
  font-size: 14px;
}
table input {
  border: 0px;
  width: 50px;
}
td {
  border: 1px solid black;
  margin: 0;
  padding: 1px 15px 1px 1px;
}
</style>
