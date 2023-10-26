import {get,post} from "./http";

//=====================歌手相关===================
//查询歌手
export const getAllSinger =() => get(`singer/allSinger`);

//按照性别查询歌手
export const getSingerOfSex = (sex) => get(`singer/singerOfSex?sex=${sex}`);


//=====================歌曲相关===================
//根据歌手id查询歌曲
export const songOfSingerId = (id) => get(`song/singer/detail?singerId=${id}`);

//根据歌曲id查询歌曲对象
export const songOfId = (id) => get(`song/detail?songId=${id}`);

//根据歌名模糊查询歌曲对象
export const likeSongOfName = (keywords) => get(`song/likeSongOfName?songName=${keywords}`);

//=====================歌单相关===================

//查询歌单
export const getAllSongList = () => get(`songList/allSongList`)

//包含标题包含文字的歌单列表
export const getSongListOfLikeTitle = (keywords) => get(`songList/likeTitle?list_name=${keywords}`);

//根据风格模糊查询歌单列表
export const getSongListOfLikeStyle = (style) => get(`songList/likeStyle?style=${style}`);

//=====================歌单的歌曲相关==============
//根据歌单id查询歌单列表
export const listSongDetail = (songListId) => get(`listSong/detail?songListId=${songListId}`);

//======================用户相关====================
//查询用户
export const getAllClient =() => get(`client/allClient`);

//注册
export const SignUp = (params) => post(`/client/add`, params);

//登录
export const loginIn = (params) => post(`/client/login`, params);

//根据用户id查询该用户的详细信息
export const getUserOfId = (id) => get(`/client/selectByPrimaryKey?id=${id}`);

//更新用户信息
export const updateUserMsg = (params) => post(`/client/update`, params);

//======================评价========================

//新增评价
export const setRank = (params) => post(`/comment/add`, params);

//获取指定歌单的平均分
export const getRankOfListId = (songListId) => get(`/comment?songListId=${songListId}`);

//======================评论========================

//新增评论
export const setComment = (params) => post(`/ranking/add`, params);

//点赞
export const setLike = (params) => post(`/ranking/like`, params);

//返回当前歌单或歌单的评论列表
export const getAllComment = (type,id) => {
    if (type == 0)
    {
        return get(`/ranking/rankingOfSongId?songId=${id}`);
    }else {
        return get(`/ranking/rankingOfSongListId?songListId=${id}`);
    }
}

//======================收藏=========================

//新增收藏
export const setCollect = (params) => post(`/collect/add`, params);

//获得某用户的收藏列表
export const getCollectOfUserId = (clientId) => get(`/collect/collectOfUserId?clientId=${clientId}`);