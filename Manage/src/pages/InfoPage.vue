<template>
    <div class="Info-wrap">
        <el-row :gutter="20" class="mgb20">
            <el-col :span="6">
                <el-card>
                    <div class="grid-content">
                        <div class="grid-cont-center">
                            <div class="grid-num">{{clientCount}}</div>
                            <div class="grid-type">用户数量</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                     <div class="grid-content">
                        <div class="grid-cont-center">
                            <div class="grid-num">{{songCount}}</div>
                            <div class="grid-type">歌曲数量</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="grid-content">
                        <div class="grid-cont-center">
                            <div class="grid-num">{{singerCount}}</div>
                            <div class="grid-type">歌手数量</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="grid-content">
                        <div class="grid-cont-center">
                            <div class="grid-num">{{listCount}}</div>
                            <div class="grid-type">歌单数量</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="mgb20">
            <el-col :span="12">
                <h3 class="title">用户性别比例</h3>
                    <div class="piechart">
                        <ve-pie :data="clientSex" :theme="options"></ve-pie>
                    </div>
            </el-col>
            <el-col :span="12">
                <h3 class="title">歌单类型分布</h3>
                    <div class="piechart">
                        <ve-histogram :data="songStyle" ></ve-histogram>
                    </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="mgb20">
            <el-col :span="12">
                <h3 class="title">歌手性别比例</h3>
                    <div class="piechart">
                        <ve-pie :data="singerSex" :theme="singerSexTheme"></ve-pie>
                    </div>
            </el-col>
            <el-col :span="12">
                <h3 class="title">歌手国籍分布</h3>
                    <div class="piechart">
                        <ve-histogram :data="singerCountry"></ve-histogram>
                    </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getAllClient, allSong, getAllSinger, getAllSongList } from '../api';
export default {
    data(){
        return {
            clientCount: 0,
            songCount: 0,
            singerCount: 0,
            listCount: 0,
            client: [],
            clientSex: {        //按性别分类
                columns: ['性别','总数'],
                rows: [
                    {'性别':'女','总数': 0},
                    {'性别':'男','总数': 0}
                ]
            },
            songStyle: {        //按歌单风格分类
                columns: ['风格','总数'],
                rows: [
                    {'风格':'华语','总数': 0},
                    {'风格':'欧美','总数': 0},
                    {'风格':'纯音乐','总数': 0},
                    {'风格':'OST','总数': 0},
                    {'风格':'流行','总数': 0},
                    {'风格':'运动','总数': 0},
                    {'风格':'轻松','总数': 0},
                    {'风格':'电子','总数': 0},
                    {'风格':'工作','总数': 0}
                ]
            },
            singerSex: {        //按性别分类歌手
                columns: ['性别','总数'],
                rows: [
                    {'性别':'女','总数': 0},
                    {'性别':'男','总数': 0},
                    {'性别':'未知','总数': 0},
                ]
            },
            singerCountry: {
                columns: ['国籍','总数'],
                rows: [
                    {'国籍':'中国','总数': 0},
                    {'国籍':'美国','总数': 0},
                    {'国籍':'法国','总数': 0},
                    {'国籍':'瑞典','总数': 0},
                    {'国籍':'加拿大','总数': 0},
                    {'国籍':'日本','总数': 0},
                    {'国籍':'澳大利亚','总数': 0},
                    {'国籍':'英国','总数': 0},
                    {'国籍':'韩国','总数': 0}
                ]
            },
            options: {
                color: ['#c44d56','#0b7fab']
            },
            singerSexTheme: {
                color: ['#c44d56','#0b7fab','#6c7a89']
            }
        }
    },
    created() {

    },
    mounted() {
        this.getClient();
        this.getAllSong();
        this.getSinger();
        this.getList();
    },
    methods: {
        getClient() {
            getAllClient().then(res => {
                this.client = res;
                this.clientCount = res.length;
                this.clientSex.rows[0]['总数'] = this.setSex(0,this.client);
                this.clientSex.rows[1]['总数'] = this.setSex(1,this.client);
            })
        },
        getAllSong() {
            allSong().then(res => {
                this.songCount = res.length;
            })
        },
        getSinger() {
            getAllSinger().then(res => {
                this.singerCount = res.length;
                this.singerSex.rows[0]['总数'] = this.setSex(0,res);
                this.singerSex.rows[1]['总数'] = this.setSex(1,res);
                this.singerSex.rows[2]['总数'] = this.setSex(2,res);
                for(let item of res)
                {
                    this.getByCountry(item.location);
                }
            })
        },
        getList() {
            getAllSongList().then(res => {
                this.listCount = res.length;
                for(let item of res)
                {
                    this.getByStyle(item.style);
                }
            })
        },
        setSex(sex,val) {
            let count = 0;
            for(let item of val)
            {
                if (sex == item.sex || sex == item.singer_sex)
                {
                    count++;
                }
            }
            return count;
        },
        getByStyle(style) {
            for(let item of this.songStyle.rows)
            {
                if (style.includes(item['风格']))
                {
                    item['总数']++;
                }
            }
        },
        getByCountry(location) {
            for (let item of this.singerCountry.rows)
            {
                if (location.includes(item['国籍']))
                {
                    item['总数']++;
                }
            }
        }
    }
}
</script>

<style scoped>
.grid-content {
    display: flex;
    align-items: center;
    height: 150px;
}

.grid-cont-center {
    flex: 1;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color:deepskyblue;
    border-radius: 10px;
}

.grid-num {
    font-size: 33px;
    font-weight: bold;
}
.grid-type {
    color:black;
    letter-spacing: 1px;
}
.title {
    margin-top: 50px;
    margin-bottom: 10px;
    text-align: center;
    color: #fff;
}
.piechart {
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
}
.Info-wrap {
    background-image: url("../assets/img/cube.jpg");
    background-size: cover;
}
</style>