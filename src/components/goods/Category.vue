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
                    <el-button type="primary" @click="showAddCateDialog">Add Category</el-button>
                </el-col>
            </el-row>

            <!-- table  -->
            <tree-table class="tree-table" :data="goodsList" :columns="columns" :selection-type="false"
                :expand-type="false" show-index index-text="#" border :show-row-hover="false">
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

        <!-- add category dialog -->
        <el-dialog title="Add Category" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateRef" label-width="150px">
                <el-form-item label="Category name: " prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="Parent Category: ">
                    <!-- options: data origin -->
                    <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps"
                        @change="parentCateChange" clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="addCategory">Confirm</el-button>
            </span>
        </el-dialog>
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
                ],
                addCateForm: {
                    cat_name: '', // category name 
                    cat_pid: 0, // parent id
                    cat_level: 0
                },
                addCateFormRules: {
                    cat_name: [{
                        required: true,
                        message: 'Please input Category name',
                        trigger: 'blur'
                    }]
                },
                parentCateList: [], // for add dialog
                cascaderProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    checkStrictly: true
                },
                selectedKeys: [], // selected parent keys 
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
            },
            // show and hide add category dialog
            showAddCateDialog() {
                this.addCateDialogVisible = true
                this.getParentCateList()
            },
            async getParentCateList() {
                const {
                    data: res
                } = await this.$http.get('categories', {
                    type: 2
                })
                if (res.meta.status !== 200) return this.$message.error('Failed to access goods info')
                this.parentCateList = res.data
                console.log(res)
            },
            // selected option changed
            parentCateChange() {
                // console.log(this.selectedKeys)
                const l = this.selectedKeys.length
                if (l > 0) {
                    this.addCateForm.cat_pid = this.selectedKeys[l - 1]
                    this.addCateForm.cat_level = l
                    return
                } else {
                    this.addCateForm.cat_pid = 0
                    this.addCateForm.cat_level = 0
                }
            },
            addCategory() {
                this.$refs.addCateRef.validate(async valid => {
                    if(!valid) return 
                    const {data:res} = await this.$http.post('categories', this.addCateForm)
                    if(res.meta.status !== 201) return this.$message.error('Failed to add cate')
                    this.$message.success('Succeed to add cate')
                    this.getGoodsList()
                    this.addCateDialogVisible = false 
                })
            },
            // when dialog closed, reset data
            addCateDialogClosed() {
                this.$refs.addCateRef.resetFields()
                this.selectedKeys = []
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        }
    }
</script>

<style lang="less" scoped>
    .tree-table {
        margin-top: 15px;
    }

    .el-cascader {
        width: 100%;
    }
</style>>