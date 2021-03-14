<template>
  <div>
    <!-- navigator area -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">Homepage</el-breadcrumb-item>
      <el-breadcrumb-item>Goods Management</el-breadcrumb-item>
      <el-breadcrumb-item>Goods List</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card area -->
    <el-card>
      <!-- search and append area -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="Please input" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">add goods</el-button>
        </el-col>
      </el-row>

      <!-- table grid area -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="Goods Name" prop="goods_name"></el-table-column>
        <el-table-column label="Goods Price" prop="goods_price" width="120"></el-table-column>
        <el-table-column label="Goods Weight" prop="goods_weight" width="130"></el-table-column>
        <el-table-column label="Created Time" prop="add_time" width="160">
          <template v-slot="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="130">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- pagination area -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>

    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        goodsList: [],
        total: 0

      };
    },
    created() {
      this.getGoodsList()
    },
    methods: {
      async getGoodsList() {
        const {
          data: res
        } = await this.$http.get('goods', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) return this.$message.error('Failed to access goods info')
        this.$message.success('Succeed to access goods info')
        // console.log(res.data)
        this.goodsList = res.data.goods
        this.total = res.data.total
        // console.log(this.goodsList)
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getGoodsList
      }
    }
  };
</script>

<style>
</style>