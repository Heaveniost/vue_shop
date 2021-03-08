<template>
    <div>
        <!-- navigator area -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">Homepage</el-breadcrumb-item>
            <el-breadcrumb-item>Goods Management</el-breadcrumb-item>
            <el-breadcrumb-item>Goods Category</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- add category button -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addCateDialogVisible = true">Add Category</el-button>
                </el-col>
            </el-row>

            <!-- table  -->
            <tree-table :data="goodsList" :columns="columns" :selection-type="false" :expand-type="false" show-index
                index-text="#" border :show-row-hover="false">
               <template v-slot:isok="scope">
                   <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
                   <i class="el-icon-error" v-else style="color: lightgreen;"></i>
               </template>
            </tree-table>

            <!-- pagination area -->
            <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="currentPage3" :page-size="100" layout="prev, pager, next, jumper" :total="total">
            </el-pagination> -->
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                addCateDialogVisible: false,
                goodsList: [],
                queryInfo: { // query parameters
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                total: 0, // total data 
                columns: [{
                        label: 'CateName',
                        prop: 'cat_name'
                    },
                    {
                        label: 'IsValid',
                        type: 'template',
                        template: 'isok'
                    }
                ]
            }
        },
        created() {
            this.getGoodsList()
        },
        methods: {
            async getGoodsList() {
                const {
                    data: res
                } = await this.$http.get('categories', {
                    params: this.queryInfo
                })
                if (res.meta.status !== 200) return this.$message.error('Failed to access goods info')
                this.goodsList = res.data.result
                this.total = res.data.total
                console.log(this.goodsList)
            }
        }

    }
</script>

<style lang="less" scoped>

</style>>