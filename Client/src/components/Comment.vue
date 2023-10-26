<template>
    <div>
        <div class="comment">
            <h2>评论</h2>
            <div class="comment-msg">
                <div class="comment-img">
                    <img :src="attachImageUrl(icon)">
                </div>
                <el-input class="comment-input" type="textarea" :rows="3" placeholder="请输入内容" v-model="textarea" :autosize="{minRows:3 , maxRows:3}" resize='none'>
                </el-input>
            </div>
            <el-button type="primary" class="sub-btn" @click="postComment">发送</el-button>
        </div>
        <p>共{{ commentList.length }}条评论</p>
        <ul class="popular" v-for="(item,index) in commentList" :key="index">
            <li>
                <div class="popular-img">
                    <img :src="attachImageUrl(userPic[index])">
                </div>
                <div class="popular-msg">
                    <ul>
                        <li class="name">{{ userName[index] }}</li>
                        <li class="time">{{ item.rank_Time }}</li>
                        <li class="content">{{ item.content }}</li>
                    </ul>
                </div>
                <div class="up" ref="up" @click="postUp(item.id,item.likes,index)">
                    <svg class="icon">
                        <use xlink:href="#icon-zan"></use>
                    </svg>
                    {{ item.likes }}
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {mixin} from '../mixins';
import {getAllComment, setComment, getUserOfId, setLike} from '../api/index';

export default{
    name: 'comment',
    mixins: [mixin],
    props: [
        'playId',
        'type',         //0代表歌曲1代表歌单
    ],
    computed:{
        ...mapGetters([
            'id',
            'loginIn',
            'userId',
            'icon'
        ])
    },
    data() {
        return {
            textarea: '',       //存放输入的评论内容
            commentList: [],
            userPic: [],        //评论的图片
            userName: [],       //评论的昵称
            isLiked: 0,         //点赞和取消点赞
        }
    },
    mounted(){
        this.getComment();
    },
    methods: {
        postComment(){
            if (this.loginIn){
                let params = new URLSearchParams();
                if (this.type == 0){
                    params.append('songId', this.playId);
                }else{
                    params.append('songListId', this.playId);
                }
                params.append('clientId',this.userId);
                params.append('type',this.type);
                params.append('content',this.textarea);
                setComment(params)
                    .then(res => {
                        if (res.code == 1){
                            this.notify('评论成功','success');
                            this.textarea = '';
                            this.getComment();
                        }else {
                            this.notify('评论失败','error');
                        }
                    })
                    .catch(err => {
                        this.notify('评论失败','error');
                    })
            }
            else{
                this.textarea = '';
                this.notify('请先登录','warning');
            }
        },
        //评论列表
        getComment(){
            getAllComment(this.type,this.playId)
                .then(res => {
                    this.commentList = res;
                    for (let item of res){
                        this.getUsers(item.clientId);
                    }
                })
                .catch(err => {
                    this.notify('获取评论失败','error');
                })
        },
        //获取用户的头像和昵称
        getUsers(id){
            getUserOfId(id)
                .then(res => {
                    this.userPic.push(res.icon);
                    this.userName.push(res.username);
                })
                .catch(err => {
                    this.notify('出错了','error');
                })
        },
        //点赞某评论
        postUp(id,likes,index){
            if (this.loginIn){
                let params = new URLSearchParams();
                params.append('id',id);
                if (this.isLiked == 0)
                {
                    params.append('likes',likes+1);
                    setLike(params)
                        .then(res => {
                            if (res.code == 1){
                                this.$refs.up[index].children[0].style.color='#E94057';
                                this.isLiked +=1;
                                this.getComment();
                            }else {
                                this.notify('点赞失败','error');
                            }
                        })
                        .catch(err => {
                            this.notify('点赞失败','error');
                        })
                }else{
                    params.append('likes',likes-1);
                    setLike(params)
                        .then(res => {
                            if (res.code == 1){
                                this.$refs.up[index].children[0].style.color='#000000';
                                this.isLiked -=1;
                                this.getComment();
                            }else {
                                this.notify('取消点赞失败','error');
                            }
                        })
                        .catch(err => {
                            this.notify('取消点赞失败','error');
                        })
                }
            }
            else{
                this.textarea = '';
                this.notify('请先登录','warning');
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/comment.scss';
</style>