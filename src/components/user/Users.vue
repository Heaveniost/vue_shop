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
                    <el-input placeholder="Please input">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">add user</el-button>
                </el-col>
            </el-row>
        </el-card>

    </div>
</template>

<script>
    export default {

    }
</script>

<style>

</style>