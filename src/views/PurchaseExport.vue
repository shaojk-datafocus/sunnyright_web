<template>
    <h1>导出采购单</h1>
    <!--startprint-->
    <table id="table">
        <tr>
            <td>1</td>
            <td>爱神的箭看浪费</td>
            <td>32</td>
            <td>345</td>
        </tr>
        <tr>
            <td>1</td>
            <td>爱神的箭看浪费</td>
            <td>32</td>
            <td>345</td>
        </tr>
        <tr>
            <td>1</td>
            <td>爱神的箭看浪费</td>
            <td>32</td>
            <td>345</td>
        </tr>
        <tr>
            <td>1</td>
            <td>爱神的箭看浪费</td>
            <td>32</td>
            <td>345</td>
        </tr>
        <tr>
            <td>1</td>
            <td>爱神的箭看浪费</td>
            <td>32</td>
            <td>345</td>
        </tr>
    </table>
    <!--endprint-->
    <el-button @click="print">打印</el-button>
</template>

<script>
export default {
  data () {
    return {
      purchaseExportData: []
    }
  },
  created () {
    this.purchaseExportData = JSON.parse(localStorage.getItem('purchaseExportData'))
    console.log(this.purchaseExportData)
  },
  methods: {
    print () {
    //   const table = document.getElementById('table')
    //   table.print()
    }
  }
}
</script>

<style scoped>

</style>
