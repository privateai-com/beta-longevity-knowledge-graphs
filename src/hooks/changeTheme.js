import { THEMES } from "../constants/themeConstants"


export const changeTheme = ({theme}) => {
    let foundIndex = THEMES.findIndex(item => item.name === theme)
    if(foundIndex === THEMES.length - 1){
        foundIndex = 0
    }else{
        foundIndex += 1
    }

    setBodyClass({className: THEMES[foundIndex].name})

    return THEMES[foundIndex].name
}

export const setBodyClass = ({className}) => {
    document.querySelector('body').className = className
}