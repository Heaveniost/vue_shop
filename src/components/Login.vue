<template>
    <div class="login-container">
        <div class="login_box">
            <!-- avatar -->
            <div class="avator">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- login form -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="0px" class="login-form">
                <el-form-item  prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item  prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password">
                    </el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary">Login</el-button>
                    <el-button type="info" @click="resetLoginForm">Reset</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // login form的数据绑定对象
                loginForm: {
                    username: 'zs',
                    password: '123'
                },
                rules: {
                    username: [{
                            required: true,
                            message: 'Please input Username',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 10,
                            message: 'Length should be 3 to 10',
                            trigger: 'blur'
                        }
                    ],
                    password: [{
                        required: true,
                        message: 'Please input Password',
                        trigger: 'change'
                    },
                    {
                            min: 6,
                            max: 15,
                            message: 'Length should be 6 to 15',
                            trigger: 'blur'
                        }],
                }
            }
        },
        methods: {
            // reset button events
            resetLoginForm() {
                // console.log(this) this里有很多属性
                this.$refs.loginFormRef.resetFields()
            }
        }
    }
</script>

<style lang="less" scoped>
    .login-container {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        .avator {
            width: 130px;
            height: 130px;
            border-radius: 50%;
            border: 1px solid #ddd;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;

            img {
                width: 130px;
                height: 130px;
                border-radius: 50%;
                background-color: #eee;
            }
        }

        .login-form {
            box-sizing: border-box;
            position: absolute;
            bottom: 10px;
            width: 100%;
            padding: 0 10px;
        }

        .btns {
            display: flex;
            justify-content: flex-end;
        }
    }
</style>