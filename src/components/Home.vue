<template>
    <el-container class="home-container">
        <!-- header -->
        <el-header>
            <div>
                <img src="../assets/main.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">Log out</el-button>
        </el-header>
        <!-- main -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside width="200px">Aside</el-aside>
            <!-- 右侧内容 -->
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login');
            }
        }
    }
</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }
    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 10px;
        color: #fff;
        font-size: 20px;

        div {
            display: flex;
            align-items: center;
            
            span {
                margin-left: 15px;
            }
        }

        img {
            width: 50px;
            height: 50px;
        }
    }
    .el-aside {
        background-color: #333744;
    }
    .el-main {
        background-color: #EAEDF1;
    }
</style>