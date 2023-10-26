import {get,post} from "./http";

//判断管理员是否登陆成功
export const getLoginStatus = (params) => post(`admin/login/status`, params);


//=====================歌手相关===================
//查询歌手
export const getAllSinger =() => get(`singer/allSinger`);

//添加歌手
export const setSinger = (params) => post(`singer/add`,params);

//编辑歌手
export const updateSinger =  (params) => post(`singer/update`, params);

//删除歌手
export const delSinger =  (id) => get(`singer/delete?id=${id}`);

//=====================歌曲相关===================
//根据歌手id查询歌曲
export const songOfSingerId = (id) => get(`song/singer/detail?singerId=${id}`);

//编辑歌曲
export const updateSong =  (params) => post(`song/update`, params);

//删除歌曲
export const delSong =  (id) => get(`song/delete?id=${id}`);

//根据歌曲id查询歌曲对象
export const songOfId = (id) => get(`song/detail?songId=${id}`);

//根据歌曲名获取歌曲对象
export const songOfName = (songName) => get(`song/songOfName?songName=${songName}`);

//查询所有歌曲
export const allSong = () => get(`song/allSong`);

//=====================歌单相关===================
//查询歌单
export const getAllSongList = () => get(`songList/allSongList`)

//添加歌单
export const setSongList = (params) => post(`songList/add`,params);

//编辑歌单
export const updateSongList =  (params) => post(`songList/update`, params);

//删除歌单
export const delSongList =  (id) => get(`songList/delete?id=${id}`);

//=====================歌单的歌曲相关==============
//根据歌单id查询歌单列表
export const listSongDetail = (songListId) => get(`listSong/detail?songListId=${songListId}`);

//给歌单添加歌曲
export const listSongAdd = (params) => post(`listSong/add`,params);

//删除一条歌曲
export const delListSong =  (songId,songListId) => get(`listSong/delete?songId=${songId}&songListId=${songListId}`);

//======================用户相关====================
//查询用户
export const getAllClient =() => get(`client/allClient`);

//添加用户
export const setClient = (params) => post(`client/add`,params);

//编辑用户
export const updateClient =  (params) => post(`client/update`, params);

//删除用户
export const delClient =  (id) => get(`client/delete?id=${id}`);

//根据用户id查询该用户的详细信息
export const getUserOfId = (id) => get(`/client/selectByPrimaryKey?id=${id}`);

//======================收藏========================

//获得某用户的收藏列表
export const getCollectOfUserId = (clientId) => get(`/collect/collectOfUserId?clientId=${clientId}`);

//删除用户收藏的歌曲
export const delCollection =  (clientId,songId) => get(`/collect/deleteByUserIdSongId?clientId=${clientId}&songId=${songId}`);

//======================评论========================

//获得某用户的收藏列表
export const getCommentOfSongListId = (songListId) => get(`/ranking/rankingOfSongListId?songListId=${songListId}`);

//删除用户收藏的歌曲
export const delComment =  (id) => get(`/ranking/delete?id=${id}`);

