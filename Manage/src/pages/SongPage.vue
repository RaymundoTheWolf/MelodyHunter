<template>
    <div class="table">
        <div class="crumbs">
            <i class="el-icon-tickets"></i>歌曲信息
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" size="mini" placeholder="请输入歌曲名" class="handle-input"></el-input>
                <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加歌曲</el-button>
            </div>
        </div>
        <el-table size="mini" border style="width:100%" height="1050px" :data="data" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column label="歌曲图片" width="110" align="center">
                <template slot-scope="scope">
                    <div class="song_">
                        <img :src="getUrl(scope.row.cover)" style="width:100%"/>
                    </div>
                    <div class="play" @click="setSongUrl(scope.row.url, scope.row.song_name)">
                        <div v-if="toggle == scope.row.song_name">
                            <svg class="icon">
                                <use xlink:href="#icon-zanting"></use>
                            </svg>
                        </div>
                        <div v-if="toggle != scope.row.song_name">
                            <svg class="icon">
                                <use xlink:href="#icon-bofanganniu"></use>
                            </svg>
                        </div>
                    </div>
                    <el-upload :action="uploadUrl(scope.row.song_id)" :before-upload="beforeAvatorUpload" :on-success="handleAvatorSuccess"></el-upload>
                </template>
            </el-table-column>
            <el-table-column prop="song_name" label="歌手-歌名" width="120" align="center"></el-table-column>
            <el-table-column prop="introduction" label="专辑" width="150" align="center"></el-table-column>
            <el-table-column class="lyric" label="歌词" align="center">
                <template slot-scope="scope">
                    <ul style="height:100px;overflow-y:scroll;">
                        <li v-for="(item,index) in parseLyric(scope.row.lyric)" :key="index">
                             {{item}}
                        </li>
                    </ul>
                </template>
            </el-table-column>
            <el-table-column label="资源更新"  width="100px" align="center">
                <template slot-scope="scope">
                    <el-upload :action="uploadUrl(scope.row.song_id)" :before-upload="beforeAvatorUpload" :on-success="handleAvatorSuccess">
                        <el-button size="mini" class="edit">更新图片</el-button>
                    </el-upload>
                    <el-upload :action="uploadSongUrl(scope.row.song_id)" :before-upload="beforeSongUpload" :on-success="handleSongSuccess">
                        <el-button size="mini" class="edit">更新歌曲</el-button>
                    </el-upload>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button class="editSinger" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button class="delete" size="mini" @click="handleDelete(scope.row.song_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                background
                layout="total,prev,pager,next"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="tableData.length"
                @current-change="handleCurrentChange"
                >
            </el-pagination>
        </div>

        <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
            <el-form :model="registerForm" ref="registerForm" label-width="80px" action="" id="tf">
                <div>
                    <label>歌名</label>
                    <el-input v-model="registerForm.name" type="text" name="name"></el-input>
                </div>
                <div>
                    <label>专辑</label>
                    <el-input v-model="registerForm.introduction" type="text" name="introduction"></el-input>
                </div>
                <div>
                    <label>歌词</label>
                    <el-input v-model="registerForm.lyric" type="textarea" name="lyric"></el-input>
                </div>
                <div>
                    <label>歌曲上传</label>
                    <input type="file" name="file">
                </div>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
                <el-button size="mini" @click="addSong">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改歌曲" :visible.sync="editVisible" width="400px" center>
            <el-form :model="Form" ref="Form" label-width="80px">
                <el-form-item prop="name" label="歌手-歌名" size="mini">
                    <el-input v-model="Form.name" placeholder="歌手-歌名"></el-input>
                </el-form-item>
                <el-form-item prop="introduction" label="专辑" size="mini">
                    <el-input v-model="Form.introduction" placeholder="专辑"></el-input>
                </el-form-item>
                <el-form-item prop="lyric" label="歌词" size="mini">
                    <el-input v-model="Form.lyric" placeholder="歌词" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="editVisible = false">取消</el-button>
                <el-button size="mini" @click="editSave">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="删除歌曲" :visible.sync="deleteVisible" width="300px" center>
            <div align="center">删除不可恢复，是否确定删除？</div>
            <span slot="footer">
                <el-button size="mini" @click="deleteVisible = false">取消</el-button>
                <el-button size="mini" @click="deleteRow">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mixin } from '../mixins';
import { mapGetters } from 'vuex';
import '@/assets/js/iconfont.js';
import { songOfSingerId, updateSong, delSong } from '../api/index';
export default{
    mixins: [mixin],
    data(){
        return{
            singerId: '',
            singerName: '',
            centerDialogVisible: false, //添加弹窗是否显示
            editVisible: false,         //编辑弹窗是否显示
            deleteVisible: false,
            registerForm:{      //添加框
                name: '',
                singerName: '',
                introduction: '',
                lyric: '',
            },
            Form:{      //编辑框
                id: '',
                name: '',
                introduction: '',
                lyric: ''
            },
            tableData: [],
            tempData: [],
            select_word: '',
            pageSize: 8,    //分页每页大小
            currentPage: 1,
            idx: -1,         //当前选择项
            multipleSelection: [],   //选中的项
            toggle: false
        }
    },
    computed:{
        ...mapGetters([
            'isPlay'
        ]),
        data(){
            return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        }
    },
    watch:{
        select_word: function(){
            if (this.select_word == '')
            {
                this.tableData = this.tempData;
            }
            else
            {
                this.tableData = [];
                for (let item of this.tempData)
                {
                    if (item.song_name.includes(this.select_word))
                    {
                        this.tableData.push(item);
                    }
                }
            }
        }
    },
    created(){
        this.singerId = this.$route.query.id;
        this.singerName = this.$route.query.name;
        this.getData();
    },
    destroyed() {
        this.$store.commit('setIsPlay',false);
    },
    methods:{
        //获取当前页
        handleCurrentChange(val){
            this.currentPage = val;
        },
        //查询歌曲
        getData(){
            this.tempData = [];
            this.tableData = [];
            songOfSingerId(this.singerId).then(res => {
                this.tempData = res;
                this.tableData = res;
                this.currentPage = 1;
            })
        },
        //添加歌曲
        addSong(){
            let _this = this;
            var form = new FormData(document.getElementById('tf'));
            form.append('singerId', this.singerId);
            form.set('name',this.singerName+'-'+form.get('name'));
            if (!form.get('lyric'))
            {
                form.set('lyric','[00:00:00]暂无歌词');
            }
            var req = new XMLHttpRequest();
            req.onreadystatechange = function(){
                //req.readyState == 4获取到返回的完整数据
                //req.status==200和后台正常交互完成
                if (req.readyState == 4 && req.status==200)
                {
                    let res = JSON.parse(req.response);
                    if (res.code){
                        _this.getData();
                        _this.registerForm = {};
                        _this.notify(res.msg,"success");
                    }
                    else
                    {
                        _this.notify('保存失败','error');
                    }
                }
            }
            req.open('post',`${_this.$store.state.HOST}/song/add`,false);
            req.send(form);
            _this.centerDialogVisible = false;
        },
        //弹出编辑页面
        handleEdit(row){
            this.editVisible = true;
            this.Form = {
                id: row.song_id,
                name: row.song_name,
                introduction: row.introduction,
                lyric: row.lyric
            }
        },
        //保存编辑页面修改的数据
        editSave(){
            let d = new Date(this.Form.birth);
            let datetime = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
            let params = new URLSearchParams();
            params.append('id',this.Form.id)
            params.append('name',this.Form.name);
            params.append('introduction',this.Form.introduction);
            params.append('lyric',this.Form.lyric);

            updateSong(params)
            .then(res => {
                if (res.code == 1)
                {
                    this.getData();
                    this.notify("修改成功","success");
                }
                else
                {
                    this.notify("修改失败","error");
                }
            })
            .catch(err =>{
                console.log(err);
            });
            this.editVisible = false;
        },
        //更新图片
        uploadUrl(id){
            return `${this.$store.state.HOST}/song/updateSongPic?id=${id}`
        },
        //删除一个歌曲
        deleteRow(){
            delSong(this.idx)
            .then(res => {
                if (res)
                {
                    this.getData();
                    this.notify("删除成功","success");
                }
                else
                {
                    this.notify("删除失败","error");
                }
            })
            .catch(err =>{
                console.log(err);
            });
            this.deleteVisible = false;
        },
        //解析歌词
        parseLyric(text){
            let lines = text.split("\n");
            let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;
            let result = [];
            for (let item of lines){
                let value = item.replace(pattern,'');
                result.push(value);
            }
            return result;
        },
        beforeSongUpload(file){
            var testMsg = file.name.substring(file.name.lastIndexOf('.') + 1);
            if (testMsg != 'mp3')
            {
                this.$message({
                    message: '上传文件只能是mp3格式',
                    type: 'error'
                });
                return false
            }
            return true;
        },
        handleSongSuccess(res){
            let _this = this;
            if (res.code == 1 ){
                _this.getData();
                _this.$notify({
                    title: '上传成功',
                    type: 'success'
                });
            }
            else
            {
                _this.$notify({
                    title: '上传失败',
                    type: 'error'
                });
            }
        },
        uploadSongUrl(id){
            return `${this.$store.state.HOST}/song/updateSongUrl?id=${id}`
        },
        //切换播放歌曲图标
        setSongUrl(url,name) {
            if (this.toggle != name)
            {
                this.toggle = name;
                this.$store.commit('setUrl',this.$store.state.HOST + url);
                this.$store.commit('setIsPlay',true)
            }
            else
            {
                this.toggle = false;
                this.$store.commit('setIsPlay',false);
            }
        }
    }
}
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .singer-img{
        width: 100%;
        height: 80px;
        border-radius: 5px;
        margin-bottom: 5px;
        overflow: hidden;
    }
    .edit:hover,
    .edit:focus {
        background: #5bc0de;
        border-color: #5bc0de;
        color: #fff;
    }

    .delete:hover,
    .delete:focus {
        background: #d9534f;
        color: #fff;
    }

    .editSinger:hover,
    .editSinger:focus {
        background: #5bc0de;
        color:#fff;
    }

    .handle-input {
        width: 300px;
        display: flex;
    }

    .pagination {
        display: flex;
        justify-content: center;
    }
    .play {
        position: absolute;
        z-index: 100;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        top: 18px;
        left: 15px;
    }

    .icon {
        width: 2em;
        height: 2em;
        color: #A9A9A9;
        fill: currentColor;
        overflow: hidden;
    }
</style>