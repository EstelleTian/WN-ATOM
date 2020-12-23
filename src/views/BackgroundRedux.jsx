
const UPDATE_BG = "bgData/update";
const RESET_BG = "bgData/reset";

//更新背景图
const updateBg = ( val ) => ({
    type: UPDATE_BG,
    val
});

//重置背景图
const resetBg = () => ({
    type: RESET_BG
});


const initBg = {
    bgClassVal : "bc-image-4"
};

const bgData = (  state = initBg, action ) => {
    switch ( action.type )
    {
        case UPDATE_BG: {
            return {
                bgClassVal: action.val
            }
        }
        case RESET_BG: {
            return state;
        }
        default : return state;
    }
};

export { bgData, updateBg, resetBg }