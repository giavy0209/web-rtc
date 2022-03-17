
const initState = {
    isFirstIn : true
}
const reducers = function (state = initState, action: { type: String , payload : any }) {
    return {
        ...state,
        ...action.payload
    }
}

export default reducers