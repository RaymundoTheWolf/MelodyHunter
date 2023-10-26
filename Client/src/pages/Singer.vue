<template>
    <div class="singer">
        <ul class="singer-header">
            <li v-for="(item,index) in singerStyle" :key="index" @click="handleChangeView(item)"
                :class="{active: item.name==activeName}">
                {{ item.name }}
            </li>
        </ul>
        <div>
            <content-list :contentList="data"></content-list>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" background layout="total,prev,pager,next"
                    :current-page="currentPage" :page-size="pageSize" :total="albumDatas.length">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import ContentList from '../components/ContentList';
import { getAllSinger, getSingerOfSex } from '../api/index';
import { mixin } from '../mixins';
import { singerStyle } from '../assets/data/singer';

export default {
    name: 'song-list',
    mixins: [mixin],
    components:{
        ContentList,
    },
    data(){
        return {
            albumDatas: [],
            pageSize: 10,           //页面大小
            currentPage: 1,         //默认第一页
            singerStyle: [],
            activeName: '全部歌手',  //当前风格
        }
    },
    computed:{
        data(){
            return this.albumDatas.slice((this.currentPage -1)*this.pageSize , this.currentPage*this.pageSize);
        }
    },
    mounted(){
        this.singerStyle = singerStyle;
        this.getSingerList();
    },
    methods:{
        getSingerList(){
            getAllSinger(this.$route.query.keywords)
                .then(res => {
                    this.currentPage = 1;
                    this.albumDatas = res;
            })
        },
        handleCurrentChange(val){
            this.currentPage = val;
        },
        //根据style显示对应的歌单
        handleChangeView(item){
            this.activeName = item.name;
            this.albumDatas = [];
            if (item.name == '全部歌手'){
                this.getSingerList();
            }else{
                this.getSinger(item.type);
            }
        },
        getSinger(sex){
            getSingerOfSex(sex)
                .then(res => {
                    this.currentPage = 1;
                    this.albumDatas = res;
                })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/singer.scss';
</style>