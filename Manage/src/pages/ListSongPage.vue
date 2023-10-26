<template>
    <div class="table">
        <div class="crumbs">
            <i class="el-icon-tickets"></i>歌单歌曲信息
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
                <el-input v-model="select_word" size="mini" placeholder="请输入歌曲名" class="handle-input"></el-input>
                <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加歌曲</el-button>
            </div>
        </div>
        <el-table size="mini" border style="width:100%" height="1050px" :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column prop="song_name" label="歌手-歌名" align="center"></el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button class="delete" size="mini" @click="handleDelete(scope.row.song_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
            <el-form :model="registerForm" ref="registerForm" label-width="80px" action="" id="tf">
                <el-form-item prop="singerName" label="歌手名" size="mini">
                    <el-input v-model="registerForm.singerName" placeholder="歌手名"></el-input>
                </el-form-item>
                <el-form-item prop="songName" label="歌名" size="mini">
                    <el-input v-model="registerForm.songName" placeholder="歌名"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
                <el-button size="mini" @click="getSongId">确定</el-button>
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
import { listSongDetail, songOfName, songOfId, listSongAdd, delListSong  } from '../api/index';
export default{
    mixins: [mixin],
    data(){
        return{
            centerDialogVisible: false, //添加弹窗是否显示
            deleteVisible: false,
            registerForm:{      //添加框
                singerName: '',
                songName: '',
            },
            tableData: [],
            tempData: [],
            select_word: '',
            idx: -1,         //当前选择项
            multipleSelection: [],   //选中的项
            songListId: ''
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
        this.songListId = this.$route.query.id;
        this.getData();
    },
    methods:{
        //查询歌曲
        getData(){
            this.tempData = [];
            this.tableData = [];
            listSongDetail(this.songListId).then(res => {
                for (let item of res){
                     this.getSong(item.song_id);
                }
            })
        },
        //根据歌曲id查询歌曲对象，放到tempData和tableData里面
        getSong(id){
            songOfId(id)
            .then(res=>{
                this.tempData.push(res);
                this.tableData.push(res);
            })
            .catch(err => {
                console.log(err);
            });
        },
        //添加歌曲前的准备，获取到歌曲id
        getSongId(){
            let _this = this;
            var name = _this.registerForm.singerName+"-"+_this.registerForm.songName;
            songOfName(name).then(
                res => {
                    _this.addSong(res[0].song_id);
                }
            )
        },
        //添加歌曲
        addSong(songId){
            let _this = this;
            let params = new URLSearchParams();
            params.append('songId',songId)
            params.append('songListId',this.songListId);

            listSongAdd(params)
            .then(res => {
                if (res.code == 1)
                {
                    this.getData();
                    this.notify("添加成功","success");
                }
                else
                {
                    this.notify("添加失败","error");
                }
            })
            .catch(err =>{
                console.log(err);
            });
            _this.centerDialogVisible = false;
        },
        //删除一个歌曲
        deleteRow(){
            delListSong(this.idx,this.songListId)
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