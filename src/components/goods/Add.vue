<template>
    <div>
        <!-- navigator area -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">Homepage</el-breadcrumb-item>
            <el-breadcrumb-item>Goods Management</el-breadcrumb-item>
            <el-breadcrumb-item>Add Goods</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- card area -->
        <el-card>
            <!-- Prompt Area -->
            <el-alert title="add goods info" type="info" :closable="false" center show-icon>
            </el-alert>

            <!-- step -->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="Basic Info"></el-step>
                <el-step title="Parameters"></el-step>
                <el-step title="Attribute"></el-step>
                <el-step title="Pictures"></el-step>
                <el-step title="Content"></el-step>
                <el-step title="Done"></el-step>
            </el-steps>

            <!-- tabs area -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs :tab-position="tabPosition" v-model="activeIndex" :before-leave="beforeTabLeave"
                    @tab-click="tabClicked">
                    <el-tab-pane label="Basic Info" name="0">
                        <el-form-item label="Goods Name" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="Goods Price" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="Goods Weight" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="Goods Number" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="Goods Category" prop="goods_cat">
                            <!-- options: data origin -->
                            <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cascaderProps"
                                @change="handleChange" clearable></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="Params" name="1">
                        <el-form-item v-for="item in dynamicTableData" :key="item.attr_id" :label="item.attr_name">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox v-for="(name, index) in item.attr_vals" :key="index" :label="name" border>
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="Attribute" name="2">
                        <el-form-item v-for="item in staticTableData" :key="item.attr_id" :label="item.attr_name">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="Pictures" name="3">
                        <!-- action: backend address -->
                        <el-upload class="upload-demo" :action="uploadURL" :headers="headerObj"
                            :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess"
                            list-type="picture">
                            <el-button size="small" type="primary">Click to upload</el-button>
                            <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="Content" name="4">
                        <!-- Rich text editor component -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="addBtn" @click="addGoods">Add Goods</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- picture preview area -->
        <el-dialog title="Picture Preview" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        data() {
            return {
                activeIndex: '0',
                tabPosition: 'left',
                addForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    goods_cat: [],
                    pics: [],
                    goods_introduce: '',
                    attrs: []
                },
                addFormRules: {
                    goods_name: [{
                        required: true,
                        message: 'Please input goods name',
                        trigger: 'blur'
                    }],
                    goods_price: [{
                        required: true,
                        message: 'Please input goods price',
                        trigger: 'blur'
                    }],
                    goods_weight: [{
                        required: true,
                        message: 'Please input goods weight',
                        trigger: 'blur'
                    }],
                    goods_number: [{
                        required: true,
                        message: 'Please input goods number',
                        trigger: 'blur'
                    }],
                    goods_cat: [{
                        required: true,
                        message: 'Please choose goods category',
                        trigger: 'blur'
                    }]
                },
                cateList: [],
                selectedKeys: [],
                cascaderProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    // checkStrictly: true
                },
                dynamicTableData: [],
                staticTableData: [],
                uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
                // picture upload header object
                headerObj: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                // image preview related data
                previewPath: '',
                previewVisible: false,
            }
        },
        created() {
            this.getCateList()
        },
        computed: {
            cateId() {
                if (this.addForm.goods_cat.length === 3) {
                    return this.addForm.goods_cat[2]
                }
            }
        },
        methods: {
            async getCateList() {
                const {
                    data: res
                } = await this.$http.get('categories')
                if (res.meta.status !== 200) return this.$message.error('Failed to access category info')
                this.$message.success('Succeed to access category info')
                this.cateList = res.data
                console.log(this.cateList)
            },
            handleChange() {
                console.log(this.addForm.goods_cat)
                const len = this.addForm.goods_cat.length
                if (len !== 3) {
                    this.addForm.goods_cat = []
                }
            },
            beforeTabLeave(activeName, oldActiveName) {
                // console.log('leave:'+ oldActiveName)
                // console.log('enter:' + activeName)
                if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                    this.$message.error('Please choose goods category')
                    return false
                }
            },
            async tabClicked() {
                if (this.activeIndex === '1') {
                    const {
                        data: res
                    } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                        params: {
                            sel: 'many'
                        }
                    })
                    if (res.meta.status !== 200) return this.$message.error('Failed to access dynamic params')
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                    })
                    this.dynamicTableData = res.data
                    console.log(this.dynamicTableData)
                } else if (this.activeIndex === '2') {
                    const {
                        data: res
                    } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                        params: {
                            sel: 'only'
                        }
                    })
                    if (res.meta.status !== 200) return this.$message.error('Failed to access static params')
                    // res.data.forEach(item => {
                    //     item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                    // })
                    this.staticTableData = res.data
                    console.log(this.dynamicTableData)
                }
            },
            // preview photo
            handlePreview(file) {
                this.previewPath = file.response.data.url
                this.previewVisible = true
            },
            // remove photo
            handleRemove(file) {
                // console.log(file)
                // 1. find the temporary path of the image to be deleted
                // 2. find the index of picture in pics array
                // 3. remove the item 
                const tmp = file.response.data.tmp_path
                const i = this.addForm.pics.findIndex(x => x.pic === tmp)
                this.addForm.pics.splice(i, 1)
                console.log(this.addForm)

            },
            // monitor picture upload event 
            handleSuccess(response) {
                // console.log(response)
                const picInfo = {
                    pic: response.data.tmp_path
                }
                this.addForm.pics.push(picInfo)
                // console.log(this.addForm)
            },
            addGoods() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) {
                        return this.$message.error('Please input essential form item')
                    }
                    // console.log('ok')
                    // handle dynamic data and static data 
                    this.dynamicTableData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(' ')
                        }
                        this.addForm.attrs.push(newInfo)
                    })
                    this.staticTableData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals
                        }
                        this.addForm.attrs.push(newInfo)
                    })
                    const form = _.cloneDeep(this.addForm)
                    form.goods_cat = form.goods_cat.join(',')
                    // console.log(form)
                    // request to send 
                    const {
                        data: res
                    } = await this.$http.post('goods', form)
                    if (res.meta.status !== 201) return this.$message.error(
                        'Failed to add goods')
                    this.$message.success('Succeed to add goods')
                    this.$router.push('/goods')
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-checkbox {
        margin: 0 10px 0 0 !important;
    }

    .previewImg {
        width: 100%;
    }

    .addBtn {
        margin-top: 15px;
    }
</style>