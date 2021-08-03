<template>
  <div>
    <el-row :gutter="10" style="margin-bottom: 15px">
      <el-col :lg="2" :sm="3" :xs="24"><span style="font-weight:800; font-size:20px">库存查询</span></el-col>
      <el-col :lg="14" :sm="15" :xs="24"><el-input clearable v-model="itemCode" placeholder="输入查询的商品编码"></el-input></el-col>
      <el-col :lg="2" :sm="3" :xs="12" class="center"><el-switch v-model="cancel" active-text="显示停用"></el-switch></el-col>
      <el-col :lg="6" :sm="3" :xs="12"><el-button type="primary" @click="queryInventory">查询</el-button></el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%" size="mini">
      <el-table-column fixed prop="sku_code" label="商品编号" sortable max-width="150"></el-table-column>
      <!-- <el-table-column prop="item_name" label="商品名称" sortable min-width="300"></el-table-column> -->
      <el-table-column prop="item_sku_name" label="SKU" sortable></el-table-column>
      <el-table-column prop="qty" label="库存数量" sortable></el-table-column>
      <el-table-column prop="pick_qty" label="可配数" sortable></el-table-column>
      <el-table-column prop="salable_qty" label="可销售数" sortable></el-table-column>
      <el-table-column prop="road_qty" label="在途数" sortable></el-table-column>
      <el-table-column prop="del" label="停用" sortable width="100"></el-table-column>
      <el-table-column prop="warehouse_name" label="仓库" sortable></el-table-column>
    </el-table>
    <div class="pagination-setion">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 25, 50, 100, 200, 500]"
      :current-page="page"
      :page-size="pageSize"
      :layout="windowWidth>800?'total, sizes, prev, pager, next, jumper':'prev, pager, next'"
      :total="total"
    ></el-pagination>
      <!-- <el-pagination
        small
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination> -->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      total: 0,
      page: 1,
      pageSize: 10,
      itemCode: null,
      cancel: 0,
      windowWidth: 1000
    }
  },
  mounted () {
    console.log(document.body.clientWidth)
    this.windowWidth = document.body.clientWidth
    console.log(window.screenWidth)
    window.onresize = () => {
      return (() => {
        window.screenWidth = 
        that.screenWidth = window.screenWidth
        console.log(that.screenWidth)
        this.windowWidth = document.body.clientWidth
      })()
    }
  },
  methods: {
    async queryInventory () {
      const { data: res } = await this.$axios.get('/api/inventory/query',
        { params: { itemCode: this.itemCode, cancel: this.cancel, page: this.page, pageSize: this.pageSize } })
      if (!res.success) return this.$message.error(res.errCode)
      console.log(res.data)
      this.tableData = res.data.stocks
      this.total = res.data.total
      console.log(document.body.clientWidth)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.queryInventory()
    },
    handleCurrentChange (val) {
      this.page = val
      this.queryInventory()
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style scoped>
.center {
  display: flex !important;
  justify-content: center;
  align-items: center;
}
.el-col {
  margin-bottom: 5px;
}
.pagination-setion {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
