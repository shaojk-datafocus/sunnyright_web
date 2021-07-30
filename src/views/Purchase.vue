<template>
  <div>
    <el-row :gutter="10" style="margin-bottom: 15px">
      <el-col :span="2"><span style="font-weight:800 font-size:20px">采购单</span></el-col>
      <el-col :span="22">
        <el-form>
          <el-col :span="10">
            <el-form-item label="创建时间">
              <el-date-picker v-model="createDate" type="datetimerange" :shortcuts="shortcuts" range-separator="至"
                start-placeholder="开始创建时间" end-placeholder="结束创建时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="审核时间">
              <el-date-picker v-model="approveDate" type="datetimerange" :shortcuts="shortcuts" range-separator="至"
                start-placeholder="开始审核时间" end-placeholder="结束审核时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-form-item>
            <el-button type="primary" @click="queryPurchase">查询</el-button>
            <el-button @click="exportPurchase">导出采购单</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%" size="mini" ref="multipleTable" @row-click="toggleSelection">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed prop="code" label="采购订单编号" sortable width="150"></el-table-column>
      <el-table-column prop="supplier_name" label="供应商名称" sortable></el-table-column>
      <el-table-column prop="create_date" label="创建时间" sortable></el-table-column>
      <el-table-column prop="approve_date" label="审核时间" sortable></el-table-column>
      <el-table-column prop="create_name" label="制单人" sortable></el-table-column>
      <el-table-column prop="status" label="状态" sortable width="100"></el-table-column>
      <el-table-column prop="warehouse_name" label="仓库" sortable></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 25, 50, 100, 200, 500]"
      :current-page="page"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
function parseDate (date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3) // 季度
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

export default {
  data () {
    return {
      tableData: [],
      total: 0,
      page: 1,
      pageSize: 10,
      itemCode: null,
      cancel: 0,
      form: {},
      createDate: [],
      approveDate: [],
      shortcuts: [{
        text: '今天',
        value: [new Date().setHours(0, 0, 0, 0), new Date()]
      }]
    }
  },
  methods: {
    async queryPurchase () {
      const { data: res } = await this.$axios.get('/api/purchase/query',
        { params: { startCreateDate: this.createDate.length ? parseDate(this.createDate[0]) : null, endCreateDate: this.createDate.length ? parseDate(this.createDate[1]) : null, startApproveDate: this.approveDate.length ? parseDate(this.approveDate[0]) : null, endApproveDate: this.approveDate.length ? parseDate(this.approveDate[1]) : null, page: this.page, pageSize: this.pageSize } })
      if (!res.success) return this.$message.error(res.errCode)
      console.log(res.data)
      this.tableData = res.data.purchaseOrderList
      this.total = res.data.total
    },
    exportPurchase () {
      // this.$router.push('/purchase/export')
      const routeData = this.$router.resolve({ path: '/purchase/export', target: '_target' })
      window.open(routeData.href, '_blank')
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.queryPurchase()
    },
    handleCurrentChange (val) {
      this.page = val
      this.queryPurchase()
      console.log(`当前页: ${val}`)
    },
    toggleSelection (row, column, event) {
      if (column.no <= 2) {
        if (row) {
          this.$refs.multipleTable.toggleRowSelection(row)
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
