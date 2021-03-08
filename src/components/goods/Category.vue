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
                    <i class="el-icon-error" v-else style="color: red;"></i>
                </template>
                <template v-slot:order="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <template v-slot:operate="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">Edit</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">Delete</el-button>
                </template>
            </tree-table>

            <!-- pagination area -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="queryInfo.pagenum" :page-sizes="[3,5,10,15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
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
                    },
                    {
                        label: 'Sorting',
                        type: 'template',
                        template: 'order'
                    },
                    {
                        label: 'Operation',
                        type: 'template',
                        template: 'operate'
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
            },
            // Monitor the change of pagesize -- 每页显示几条数据
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                this.getGoodsList()
            },
            // Monitor the change of pagenum -- 页码的改变
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                this.getGoodsList()
            }
        }

    }
</script>

<style lang="less" scoped>

</style>>