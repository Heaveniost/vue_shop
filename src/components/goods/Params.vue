<template>
    <div>
        <!-- navigator area -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">Homepage</el-breadcrumb-item>
            <el-breadcrumb-item>Goods Management</el-breadcrumb-item>
            <el-breadcrumb-item>Paramters List</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-alert type="warning" title="Attention: Only parameters related to the third category are allowed 
                to be set" closable show-icon></el-alert>

            <el-row class="cate_opt">
                <el-col>
                    <span>Choose Goods Category :</span>
                    <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cateProps"
                        @change="handleChange"></el-cascader>
                </el-col>
            </el-row>

            <!-- tab area -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="dynamic params" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">add
                        params</el-button>

                    <!-- dynamic table -->
                    <el-table :data="dynamicData" border stripe>
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable
                                    @close="handleClose(index, scope.row)">
                                    {{ item }}
                                </el-tag>
                                <!-- input text -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="mini"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- add button -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="attr_name" prop="attr_name"></el-table-column>
                        <el-table-column label="operation">
                            <template v-slot="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="showEditDialog(scope.row.attr_id)">Edit
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="removeParams(scope.row.attr_id)">Delete</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="static props" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">add
                        params</el-button>

                    <!-- static table -->
                    <el-table :data="staticData" border stripe>
                        <el-table-column type="expand">
                            <el-table-column type="expand">
                                <template v-slot="scope">
                                    <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable
                                        @close="handleClose(index, scope.row)">
                                        {{ item }}
                                    </el-tag>
                                    <!-- input text -->
                                    <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue" ref="saveTagInput" size="mini"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)">
                                    </el-input>
                                    <!-- add button -->
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">
                                        +
                                        New Tag
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="attribute name" prop="attr_name"></el-table-column>
                        <el-table-column label="operation">
                            <template v-slot="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="showEditDialog(scope.row.attr_id)">Edit
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="removeParams(scope.row.attr_id)">Delete</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- add params dialog  -->
        <el-dialog :title="'add ' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="150px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="addParams">Confirm</el-button>
            </span>
        </el-dialog>

        <!-- modify params dialog  -->
        <el-dialog :title="'modify ' + titleText" :visible.sync="editDialogVisible" width="50%"
            @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="150px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="editParams">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                cateList: [],
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                selectedCateKeys: [],
                activeName: 'many',
                dynamicData: [],
                staticData: [],
                // add form
                addDialogVisible: false,
                addForm: {
                    attr_name: ''
                },
                addFormRules: {
                    attr_name: [{
                        required: true,
                        message: 'Please params name',
                        trigger: 'blur'
                    }]
                },
                // edit form 
                editDialogVisible: false,
                editForm: {
                    attr_name: ''
                },
                editFormRules: {
                    attr_name: [{
                        required: true,
                        message: 'Please params name',
                        trigger: 'blur'
                    }]
                },
                // inputVisible: false, // toggle input text and add button
                // inputValue: '',
            }
        },
        created() {
            this.getGoodsList()
        },
        computed: {
            // control whether the button is disabled
            isBtnDisabled() {
                if (this.selectedCateKeys.length !== 3) {
                    return true
                }
                return false
            },
            // current selected id
            cateId() {
                const len = this.selectedCateKeys.length
                if (len === 3) return this.selectedCateKeys[2]
                return null
            },
            titleText() {
                if (this.activeName === 'many') {
                    return 'dynamic params'
                } else {
                    return 'static attrs'
                }
            }
        },
        methods: {
            async getGoodsList() {
                const {
                    data: res
                } = await this.$http.get('categories')
                if (res.meta.status !== 200) return this.$message.error('Failed to access goods info')
                this.cateList = res.data
                console.log(this.cateList)
                // this.$message.success('Succeed to add cate')
                // this.getGoodsList()
                // this.addCateDialogVisible = false 
            },
            async handleChange() {
                this.getParamsData()
            },
            // click event of tabs
            handleTabClick() {
                this.getParamsData()
                // console.log(this.activeName)
            },
            async getParamsData() {
                const len = this.selectedCateKeys.length
                if (len !== 3) {
                    this.selectedCateKeys = []
                    this.dynamicData = []
                    this.staticData = []
                    return
                }
                // console.log(this.selectedCateKeys)
                const {
                    data: res
                } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: {
                        sel: this.activeName
                    }
                })
                if (res.meta.status !== 200) return this.$message.error('Failed to loading info')
                // console.log(res.data)
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                    // show and hide input text box
                    item.inputVisible = false
                    item.inputValue = ''
                })
                // console.log(res.data)
                if (this.activeName === 'many') {
                    this.dynamicData = res.data
                } else {
                    this.staticData = res.data
                }
            },
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            addParams() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return
                    const {
                        data: res
                    } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    })
                    if (res.meta.status !== 201) return this.$message.error('Failed to add params')
                    this.$message.success('Succeed to add params')
                    this.addDialogVisible = false
                    this.getParamsData()
                })
            },
            async showEditDialog(id) {
                const {
                    data: res
                } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
                    params: {
                        attr_sel: this.activeName
                    }
                })
                if (res.meta.status !== 200) return this.$message.error('Failed to access info')
                this.editForm = res.data
                this.editDialogVisible = true
            },
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            editParams() {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return
                    const {
                        data: res
                    } = await this.$http.put(
                        `categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                            attr_name: this.editForm.attr_name,
                            attr_sel: this.activeName
                        })
                    if (res.meta.status !== 200) return this.$message.error('Failed to modify info')
                    this.$message.success('Succeed to modify info')
                    this.getParamsData()
                    this.editDialogVisible = false
                })
            },
            // remove params according id
            async removeParams(id) {
                const confirmResult = await this.$confirm('This will permanently delete the params. Continue?',
                    'Warning', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).catch(err => err)
                if (confirmResult !== 'confirm') return this.$message.info('Undelete params')
                const {
                    data: res
                } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
                if (res.meta.status !== 200) return this.$message.error('Failed to delete params')
                this.$message.success('Succeed to delete params')
                this.getParamsData()
            },
            // input text blur or press the enter key
            async handleInputConfirm(row) {
                if (row.inputValue.trim().length === 0) {
                    row.inputValue = ''
                    row.inputVisible = false
                    return
                }
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = ''
                row.inputVisible = false
                this.saveAttrVals(row)
            },
            // save the result of attr_vals to the database
            async saveAttrVals(row) {
                const {
                    data: res
                } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(' ')
                })
                if (res.meta.status !== 200) return this.$message.error('Failed to update params')
                this.$message.success('Succeed to update params')
            },
            showInput(row) {
                // console.log(row)
                row.inputVisible = true;
                // let the input box get focus automatically
                // $nextTick: 当页面上的元素被重新渲染后，才会执行回调函数中的代码
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleClose(index, row) {
                row.attr_vals.splice(index, 1)
                this.saveAttrVals(row)
            }
        }
    }
</script>

<style lang="less" scoped>
    .cate_opt {
        margin: 15px 0;
    }

    .el-cascader {
        margin-left: 10px;
    }

    .el-tag {
        margin: 5px;
    }

    .input-new-tag {
        width: 120px;
    }
</style>