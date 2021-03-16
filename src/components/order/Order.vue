<template>
  <div>
    <!-- navigator area -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">Homepage</el-breadcrumb-item>
      <el-breadcrumb-item>Order Management</el-breadcrumb-item>
      <el-breadcrumb-item>Order List</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card area -->
    <el-card>
      <!-- search and append area -->
      <el-row>
        <el-col :span="10">
          <el-input placeholder="Please input content" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- table grid area -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="Order Number" prop="order_number"></el-table-column>
        <el-table-column label="Order Price" prop="order_price" width="120"></el-table-column>
        <el-table-column label="Whether Payment" prop="pay_status" width="150">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.order_pay === '1'">Paid</el-tag>
            <el-tag type="danger" v-else>Not Paid</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Whether Delivery" prop="is_send" width="150">
        </el-table-column>
        <el-table-column label="Order Time" prop="create_time" width="160">
          <template v-slot="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="130">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- pagination area -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>

    <!-- edit address dialog -->
    <el-dialog title="Edit Address" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="addr_main">
          <el-cascader v-model="addressForm.addr_main" :options="citydata" :props="{ expandTrigger: 'hover' }"
            @change="handleAddrChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addr_detail">
          <el-input v-model="addressForm.addr_detail"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="editAddrInfo">Confirm</el-button>
      </span>
    </el-dialog>

    <!-- logistics progress -->
    <el-dialog title="progress" :visible.sync="progressDialogVisible" width="50%">
      <!-- timeline -->
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in logisticsInfo" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
  import citydata from '@/components/order/citydata'
  import logisticsInfo from '@/components/order/logisticsInfo'

  export default {
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        orderList: [],
        total: 0,
        // edit address related data
        editDialogVisible: false,
        addressForm: {
          addr_main: [],
          addr_detail: ''
        },
        addressFormRules: {
          addr_main: [{
            required: true,
            message: 'Please choose address',
            trigger: 'blur'
          }],
          addr_detail: [{
            required: true,
            message: 'Please input address',
            trigger: 'blur'
          }]
        },
        citydata: citydata,
        // logistics progress related data
        progressDialogVisible: false,
        logisticsInfo: logisticsInfo
      }
    },
    created() {
      this.getOrderList()
    },
    methods: {
      async getOrderList() {
        const {
          data: res
        } = await this.$http.get('orders', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) return this.$message.error('Failed to access orders info')
        this.$message.success('Succeed to access orders info')
        // console.log(res.data)
        this.orderList = res.data.goods
        this.total = res.data.total
        // console.log(this.goodsList)
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getOrderList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getOrderList()
      },
      showEditDialog() {
        this.editDialogVisible = true
      },
      editDialogClosed() {
        this.$refs.addressFormRef.resetFields()
      },
      editAddrInfo() {},
      handleAddrChange() {},
      async showProgressBox() {
        // const {
        //   data: res
        // } = await this.$http.get('/kuaidi/1106975712662')
        // if (res.meta.status !== 200) return this.$message.error('Failed to access logistics info')
        // this.$message.success('Succeed to access logistics info')
        // this.logisticsInfo = res.data
        this.progressDialogVisible = true
        console.log(this.logisticsInfo)
      }
    }

  }
</script>

<style lang="less" scoped>
  .el-cascader {
    width: 100%;
  }
</style>