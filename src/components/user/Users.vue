<template>
    <div>
        <!-- navigator area -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">homepage</el-breadcrumb-item>
            <el-breadcrumb-item>user management</el-breadcrumb-item>
            <el-breadcrumb-item>user list</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- card area -->
        <el-card>
            <!-- search and append area -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="Please input" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">add user</el-button>
                </el-col>
            </el-row>

            <!-- user list area -->
            <el-table :data="userlist" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="name" prop="username"></el-table-column>
                <el-table-column label="email" prop="email"></el-table-column>
                <el-table-column label="phone" prop="mobile"></el-table-column>
                <el-table-column label="role" prop="role_name"></el-table-column>
                <el-table-column label="state">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="operation" width="180px">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        <el-tooltip effect="dark" content="Assign roles" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- pagination area -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                // user list query parameters object 
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                userlist: [],
                total: 0,
                value1: false
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            async getUserList() {
                const {
                    data: res
                } = await this.$http.get('users', {
                    params: this.queryInfo
                })
                if (res.meta.status !== 200) return this.$message.error('Failed to acquire user list')
                this.userlist = res.data.users
                this.total = res.data.total
                console.log(this.userlist)
            },
            handleSizeChange(val) {
                console.log(`${val} items per page`);
                this.queryInfo.pagesize = val;
                this.getUserList()
            },
            handleCurrentChange(val) {
                console.log(`current page: ${val}`);
                this.queryInfo.pagenum = val
                this.getUserList()
            },
            // 监听swtich开关的改变
            async userStateChanged(userinfo) {
                // console.log(userinfo)
                const {
                    data: res
                } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
                if (res.meta.status !== 200) {
                    userinfo.mg_state = !userinfo.mg_state
                    return this.$message.error('Failed to update user info')
                }
                this.$message.success('Succeed to update user info')
            }
        }
    }
</script>

<style>

</style>