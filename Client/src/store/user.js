const user = {
    state:{
        userId: '',
        username: '',
        icon: '',
    },
    getters: {
        userId: state => {
            let userId = state.userId
            if (!userId)
            {
                userId = JSON.parse(window.sessionStorage.getItem('userId'))
            }
            return userId
        },
        username: state => {
            let username = state.username
            if (!username)
            {
                username = JSON.parse(window.sessionStorage.getItem('username'))
            }
            return username
        },
        icon: state => {
            let icon = state.icon
            if (!icon)
            {
                icon = JSON.parse(window.sessionStorage.getItem('icon'))
            }
            return icon
        }
    },
    mutations: {
        setUserId: (state,userId) => {
            state.userId = userId
            window.sessionStorage.setItem('userId',JSON.stringify(userId))
        },
        setUsername: (state,username) => {
            state.username = username
            window.sessionStorage.setItem('username',JSON.stringify(username))
        },
        setIcon: (state,icon) => {
            state.icon = icon
            window.sessionStorage.setItem('icon',JSON.stringify(icon))
        }
    }
}

export default user