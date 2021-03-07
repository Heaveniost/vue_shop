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
                    <el-button type="primary" @click="addDialogVisible = true">add user</el-button>
                </el-col>
            </el-row>

            <!-- user list area -->
            <el-table :data="userlist" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="name" prop="username"></el-table-column>
                <el-table-column label="email" prop="email"></el-table-column>
                <el-table-column label="mobile" prop="mobile"></el-table-column>
                <el-table-column label="role" prop="role_name"></el-table-column>
                <el-table-column label="state">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="operation" width="180px">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="removeUserById(scope.row.id)"></el-button>
                        <el-tooltip effect="dark" content="Assign roles" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                                @click="assignRoles(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- add user dialog -->
            <el-dialog title="Add New User" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                    <el-form-item label="username" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="password" prop="password">
                        <el-input v-model="addForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="email" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="mobile" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="addUser">Confirm</el-button>
                </span>
            </el-dialog>

            <!-- add dialog for edit user info-->
            <el-dialog title="Edit User Info" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                    <el-form-item label="username" prop="username">
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="email" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="mobile" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="editUserInfo">Confirm</el-button>
                </span>
            </el-dialog>

            <!-- assign roles to users -->
            <el-dialog title="Assgin Roles" :visible.sync="setRoleDialogVisible" width="50%"
                @close="setRoleDialogClosed">
                <div>
                    <p>Current User: {{userinfo.username}}</p>
                    <p>Current Role: {{userinfo.role_name}}</p>
                    <p>Assign New Role:
                        <el-select v-model="selectRoleId" placeholder="Select">
                            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                            </el-option>
                        </el-select>
                    </p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRoleDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="saveRoleInfo">Confirm</el-button>
                </span>
            </el-dialog>

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
            // custom email and mobile validation rules
            var checkEmail = (rule, value, callback) => {
                const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
                if (regEmail.test(value)) return callback()
                callback(new Error('Please input valid email'))
            }

            var checkmobile = (rule, value, callback) => {
                const regmobile = /^[1][3,4,5,7,8][0-9]{9}$/
                if (regmobile.test(value)) return callback()
                callback(new Error('Please input valid mobile number'))
            }

            return {
                // user list query parameters object 
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                userlist: [],
                total: 0,
                value1: false,
                addDialogVisible: false, //show and hide add user dialog
                // add form data
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                addFormRules: {
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
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: 'Length should be 6 to 15',
                            trigger: 'blur'
                        }
                    ],
                    email: [{
                            required: true,
                            message: 'Please input Email',
                            trigger: 'blur'
                        },
                        {
                            validator: checkEmail,
                            trigger: 'blur'
                        }
                    ],
                    mobile: [{
                            required: true,
                            message: 'Please input mobile',
                            trigger: 'blur'
                        },
                        {
                            validator: checkmobile,
                            trigger: 'blur'
                        }
                    ]
                },
                editDialogVisible: false, // show and hide edit dialog
                editForm: {}, // query user information
                editFormRules: {
                    email: [{
                            required: true,
                            message: 'Please input Email',
                            trigger: 'blur'
                        },
                        {
                            validator: checkEmail,
                            trigger: 'blur'
                        }
                    ],
                    mobile: [{
                            required: true,
                            message: 'Please input mobile',
                            trigger: 'blur'
                        },
                        {
                            validator: checkmobile,
                            trigger: 'blur'
                        }
                    ],
                },
                setRoleDialogVisible: false,
                userinfo: {},
                rolesList: [],
                selectRoleId: ''
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
            },
            // add a dialog close event 
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            addUser() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return
                    const {
                        data: res
                    } = await this.$http.post('/users', this.addForm)
                    if (res.meta.status !== 201) return this.$message.error('Falied to add user')
                    this.$message.success('Succeed to add user')
                    this.addDialogVisible = false
                    this.getUserList()
                })
            },
            // edit dialog 
            async showEditDialog(id) {
                const {
                    data: res
                } = await this.$http.get('/users/' + id)
                if (res.meta.status !== 200) return this.$message.error('Failed to access user info')
                this.editForm = res.data
                console.log(res)
                this.editDialogVisible = true
            },
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            editUserInfo() {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return
                    const {
                        data: res
                    } = await this.$http.put('users/' + this.editForm.id, {
                        email: this.editForm.email,
                        mobile: this.editForm.mobile
                    })
                    if (res.meta.status !== 200) return this.$message.error('Failed to update user info')
                    // if succeed, close dialog, update list, prompt success
                    this.editDialogVisible = false
                    this.getUserList()
                    this.$message.success('Succeed to update user info')
                })
            },
            // remove user by id 
            async removeUserById(id) {
                const result = await this.$confirm('This will permanently delete the user. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).catch(err => err)
                console.log(result)
                if (result !== 'confirm') return this.$message.info('Undelete user')
                const {
                    data: res
                } = await this.$http.delete('users/' + id)
                if (res.meta.status !== 200) return this.$message.error('Failed to delete user')
                this.$message.success('Succeed to delete user')
                this.getUserList()
            },
            async assignRoles(userinfo) {
                this.userinfo = userinfo
                // console.log(userinfo)
                const {
                    data: res
                } = await this.$http.get('roles')
                if (res.meta.status !== 200) return this.$message.error('Falied to access roles')
                this.rolesList = res.data
                // console.log(this.rolesList)
                this.setRoleDialogVisible = true
            },
            async saveRoleInfo() {
                // console.log(this.selectRoleId)
                if (!this.selectRoleId) return this.$message.error('Please choose a role for user')
                const {
                    data: res
                } = await this.$http.put(`users/${this.userinfo.id}/role`, {
                    rid: this.selectRoleId
                })
                if (res.meta.status !== 200) return this.$message.error('Failed to assign roles')
                this.$message.success('Succeed to updata roles')
                this.getUserList()
                this.setRoleDialogVisible = false
            },
            setRoleDialogClosed() {
                this.selectRoleId = ''
                this.userinfo = ''
            }
        }
    }
</script>

<style>

</style>