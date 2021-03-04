<template>
    <div>
        <!-- navigator area -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">Homepage</el-breadcrumb-item>
            <el-breadcrumb-item>Authority Management</el-breadcrumb-item>
            <el-breadcrumb-item>Roles List</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- card viewport -->
        <el-card>
            <!-- search and append role -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addDialogVisible = true">Add Role</el-button>
                </el-col>
            </el-row>

            <!-- show roles list -->
            <el-table :data="roleList" style="width: 100%" stripe border>
                <el-table-column type="expand" width="60">
                    <template v-slot="scope">
                        <el-row :class="['bd-bottom', index === 0 ? 'bd-top' : '', 'vertical-center']"
                            v-for="(item, index) in scope.row.children" :key="item.id">
                            <!-- Render Level 1 Permission -->
                            <el-col :span="5">
                                <el-tag type="primary">{{ item.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- Render Level 2 Permission and Level 3 Permission -->
                            <el-col :span="19">
                                <el-row :class="[i === 0 ? '' : 'bd-top', 'vertical-center']" v-for="(value, i) in item.children" :key="value.id">
                                    <el-col :span="6">
                                        <el-tag type="success">{{ value.authName }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="v in value.children" :key="v.id">
                                            {{ v.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <pre>
                            {{scope.row}}
                        </pre>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#" width="60"></el-table-column>
                <el-table-column prop="roleName" label="Role Name">
                </el-table-column>
                <el-table-column prop="roleDesc" label="Role desc">
                </el-table-column>
                <el-table-column label="Operation" width="350px">
                    <template v-slot="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">
                            Edit
                        </el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="deleteRoleById(scope.row.id)">Delete</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini">Assign Permission</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- add role dialog -->
        <el-dialog title="Add New Role" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item label="roleName" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="roleDesc" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="addUser">Confirm</el-button>
            </span>
        </el-dialog>

        <!-- edit role info-->
        <el-dialog title="Edit Role Info" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="roleId" prop="roleId">
                    <el-input v-model="editForm.roleId" disabled></el-input>
                </el-form-item>
                <el-form-item label="roleName" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="roleDesc" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="editRoleInfo">Confirm</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                roleList: [], // role list
                addDialogVisible: false,
                addForm: {
                    roleName: '',
                    roleDesc: ''
                },
                addFormRules: {
                    roleName: [{
                            required: true,
                            message: 'Please input Rolename',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 10,
                            message: 'Length should be 3 to 10',
                            trigger: 'blur'
                        }
                    ],
                    roleDesc: [{
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
                    ]
                },
                editForm: {}, // stored role info
                editDialogVisible: false,
                editFormRules: {
                    roleName: [{
                        required: true,
                        message: 'Please input Rolename',
                        trigger: 'blur'
                    }],
                    roleDesc: [{
                        required: true,
                        message: 'Please input Role Description',
                        trigger: 'blur'
                    }],
                }
            }
        },
        created() {
            this.getRoleList()
        },
        methods: {
            async getRoleList() {
                const {
                    data: res
                } = await this.$http.get('roles')
                if (res.meta.status !== 200) return this.$message.error('Failed to access role list')
                this.roleList = res.data
                // this.$message.success('Succeed to access role list')
            },
            async showEditDialog(id) {
                const {
                    data: res
                } = await this.$http.get('roles/' + id)
                if (res.meta.status !== 200) return this.$message.error('Failed to access role info')
                this.editForm = res.data
                // console.log(res)
                this.editDialogVisible = true
            },
            addDialogClosed() {
                this.$refs.addFormRef.resetFields()
            },
            addUser() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return
                    const {
                        data: res
                    } = await this.$http.post('/roles', this.addForm)
                    if (res.meta.status !== 201) return this.$message.error('Falied to add role')
                    this.$message.success('Succeed to add role')
                    this.addDialogVisible = false
                    this.getRoleList()
                })
            },
            editDialogClosed() {
                this.$refs.editFormRef.resetFields()
            },
            editRoleInfo() {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return
                    const {
                        data: res
                    } = await this.$http.put('roles/' + this.editForm.roleId, {
                        roleName: this.editForm.roleName,
                        roleDesc: this.editForm.roleDesc
                    })
                    if (res.meta.status !== 200) return this.$message.error('Failed to update role info')
                    this.editDialogVisible = false
                    this.getRoleList()
                    this.$message.success('Succeed to update role info')
                })
            },
            async deleteRoleById(id) {
                const confirmResult = await this.$confirm('This will permanently delete the role. Continue?',
                    'Warning', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).catch(err => err)
                // console.log(result)
                if (confirmResult !== 'confirm') return this.$message.info('Undelete role')
                const {
                    data: res
                } = await this.$http.delete('roles/' + id)
                if (res.meta.status !== 200) return this.$message.error('Failed to delete role')
                this.$message.success('Succeed to delete role')
                this.getRoleList()
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }

    .bd-top {
        border-top: 1px solid #eee;
    }

    .bd-bottom {
        border-bottom: 1px solid #eee;
    }

    .vertical-center {
        display: flex;
        align-items: center;
    }
</style>