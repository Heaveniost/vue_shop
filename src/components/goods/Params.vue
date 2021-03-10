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
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled">add params</el-button>
                    <!-- dynamic table -->
                    <el-table :data="dynamicData" border stripe>
                        <el-table-column type="expand"></el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="attr_name" prop="attr_name"></el-table-column>
                        <el-table-column label="operation">
                            <template v-slot="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini">Edit</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini">Delete</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="static props" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled">add params</el-button>
                    <!-- static table -->
                    <el-table :data="staticData" border stripe>
                        <el-table-column type="expand"></el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="attribute name" prop="attr_name"></el-table-column>
                        <el-table-column label="operation">
                            <template v-slot="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini">Edit</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini">Delete</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
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
                staticData: []
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
                if (this.activeName === 'many') {
                    this.dynamicData = res.data
                } else {
                    this.staticData = res.data
                }
            }
        }
    }
</script>

<style>
    .cate_opt {
        margin: 15px 0;
    }

    .el-cascader {
        margin-left: 10px;
    }
</style>