export const TAG_HANH_DONG = 1;
export const TAG_THE_THAO = 2;
export const TAG_SINH_TON = 3;
export const TAG_DOI_KHANG = 4;
export const TAG_PHIEU_LUU = 5;
export const TAG_KINH_DI = 6;
export const TAG_GIAI_DO = 7;

export const optionGame = [
    {
        id: TAG_HANH_DONG,
        name: "Hành động",
        slug: "hanh-dong",
        color: "secondary"
    },
    {
        id: TAG_THE_THAO,
        name: "Thể thao",
        slug: "the-thao",
        color: "green"
    },
    {
        id: TAG_SINH_TON,
        name: "Sinh tồn",
        slug: "sinh-ton",
        color: "red"
    },
    {
        id: TAG_DOI_KHANG,
        name: "Đối kháng",
        slug: "doi-khang",
        color: "primary"
    },
    {
        id: TAG_PHIEU_LUU,
        name: "Phiêu lưu",
        slug: "phieu-luu",
        color: "pink"
    },
    {
        id: TAG_KINH_DI,
        name: "Kinh dị",
        slug: "kinh-di",
        color: "cyan"
    },
    {
        id: TAG_GIAI_DO,
        name: "Giải đố",
        slug: "giai-do"
    }
]
export const gameTags = {
    1: "Hành động",
    2: "Thể thao",
    3: "Sinh tồn",
    4: "Đối kháng",
    5: "Phiêu lưu",
    6: "Kinh dị",
    7: "Giải đố",
}
export const TYPE_GOOGLE = 1;
export const TYPE_FSHARE = 2;
export const TYPE_LINKS = [
    {id: TYPE_GOOGLE, name: "Google link"},
    {id: TYPE_FSHARE, name: "Fshare link"},
]
export const GAME_MOI = 1;
export const PHO_BIEN = 2;
export const UPDATE_DLC = 3;
export const VIET_HOA = 4;

export const categories = [
    {id: GAME_MOI, name: "Game mới"},
    {id: PHO_BIEN, name: "Game phổ biến"},
    {id: UPDATE_DLC, name: "Game update DLC"},
    {id: VIET_HOA, name: "Game Việt hóa"},
]

export const gameCategories = {
    1: "Game mới",
    2: "Game phổ biến",
    3: "Game update DLC",
    4: "Game Việt hóa",
}
