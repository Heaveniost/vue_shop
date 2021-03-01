<template>
    <div>
        <!-- navigator area -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">Homepage</el-breadcrumb-item>
            <el-breadcrumb-item>Authority Management</el-breadcrumb-item>
            <el-breadcrumb-item>Authority List</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- card viewport -->
        <el-card>
            <el-table :data="authList" style="width: 100%" stripe border>
                <el-table-column type="index" label="#" width="60"></el-table-column>
                <el-table-column prop="authName" label="Authority Name">
                </el-table-column>
                <el-table-column prop="path" label="Path">
                </el-table-column>
                <el-table-column prop="level" label="Authority Level">
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.level === '0'">Level 1</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level === '1'">Level 2</el-tag>
                        <el-tag type="info" v-else>Level 3</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                // auth list
                authList: []
            }
        },
        created() {
            this.getAuthList()
        },
        methods: {
            async getAuthList() {
                const {
                    data: res
                } = await this.$http.get('rights/list')
                if (res.meta.status !== 200) return this.$message.error('Falied to access auth list')
                // console.log(res)
                this.authList = res.data
                console.log(this.authList)
            }
        }
    }
</script>

<style lang="less" scoped>

</style>