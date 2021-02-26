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
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏导航区域 -->
                <el-menu default-active="2" class="el-menu-vertical-demo" background-color="#333744"
                     text-color="#fff" active-text-color="#409bff" unique-opened :collapse="isCollapse" :collapse-transition="false">
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单的模板区域 -->
                        <template slot="title">
                            <i :class="icons[item.id]"></i>
                            <span>{{ item.authName }}</span>
                        </template>

                        <!-- 二级菜单 -->
                        <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                // 左侧菜单数据
                menuList: [],
                icons: {
                    '125': 'el-icon-user',
                    '103': 'el-icon-help',
                    '101': 'el-icon-goods',
                    '102': 'el-icon-s-order',
                    '145': 'el-icon-data-line'
                },
                isCollapse: false //是否折叠
            }
        },
        created() {
            this.getMenuList()
        },
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login');
            },
            // 获取所有的菜单
            async getMenuList() {
                const { data: res } = await this.$http.get('menus')
                if (res.meta.status !== 200) return this.$http.message.error(res.meta.msg)
                this.menuList = res.data
                console.log(res)
                console.log(this.menuList)
            },
            // 点击展开与折叠菜单栏
            toggleCollapse() {
                this.isCollapse = !this.isCollapse
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

        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #EAEDF1;
    }
    .toggle-button {
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        text-align: center;
        color: #fff;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>