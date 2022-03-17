import callAPI from "callAPI"

export const CHANGE_FIRST_IN = 'CHANGE_FIRST_IN'

export const actionChangeFirstIn = function (isFirstIn) {
    return {
        type : CHANGE_FIRST_IN,
        payload : {isFirstIn}
    }
}

export const CHANGE_USER = 'CHANGE_USER'

export const actionChangeUser = function (user) {
    return {
        type : CHANGE_FIRST_IN,
        payload : {user}
    }
}