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
                selectedCateKeys: []
            }
        },
        created() {
            this.getGoodsList()
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
            handleChange(){
                const len = this.selectedCateKeys.length
                if(len !== 3) {
                    this.selectedCateKeys = []
                    return
                }
                console.log(this.selectedCateKeys)
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