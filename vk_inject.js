chrome.storage.local.get(["access_token", "user_token"], (items) => {
    var TOKEN_USER = items.access_token
    var TOKEN_ACCESS = items.user_token

    main(TOKEN_USER, TOKEN_ACCESS)
})

const BASE_URL = "https://api.vk.com/method"


function htmlGetter(items) {

    let mainHmtl = `<section class="ProfileGroup ProfileFriends vkuiGroup vkuiGroup--sizeX-regular vkuiGroup--card vkuiGroup--padding-m">
    <div class="vkuiGroup__inner">
        <a
            class="ProfileGroupHeader vkuiTappable vkuiTappable--sizeX-regular vkuiTappable--mouse"
            href="/friends?id=688794623&amp;section=all" data-allow-link-onclick-web="1">
        <header class="vkuiHeader vkuiHeader--android vkuiHeader--mode-primary vkuiHeader--pi">
            <div class="vkuiHeader__main"><span
                    class="vkuiHeader__content vkuiHeadline vkuiHeadline--android vkuiHeadline--sizeY-compact vkuiHeadline--l-1 vkuiHeadline--w-2"><span
                    class="vkuiHeader__content-in">Друзья в вашем ЧС</span><span
                    class="vkuiHeader__indicator vkuiCaption vkuiCaption--l-1 vkuiCaption--w-1">${items.items.length}</span></span></div>
            <span class="vkuiHeader__aside vkuiText vkuiText--sizeY-compact"></span></header>
        <span aria-hidden="true" class="vkuiFocusVisible vkuiFocusVisible--inside"></span></a>
        <div aria-hidden="true" class="vkuiSpacing" style="height: 4px;"></div>
        <!--        СТАРТ-->
        <div class="ProfileGroupHorizontalCells">`

    for (let i = 0; i < items.items.length; i++) {
        var first_name = items.items[i].first_name
        var photo_100 = items.items[i].photo_100
        var r = items.items[i].id
        var html = `
            <div class="ProfileFriends__item vkuiHorizontalCell vkuiHorizontalCell--s"><a href="/id${r}"
                                                                                          class="vkuiHorizontalCell__body vkuiTappable vkuiTappable--sizeX-regular vkuiTappable--hasHover vkuiTappable--hasActive vkuiTappable--mouse">
                <div class="vkuiHorizontalCell__image"><span class="AvatarRich AvatarRich--shadow" role="img"
                                                             style="width: 64px; height: 64px; border-radius: 50%; --avatar-rich-stroke-width:2px; --avatar-rich-nft-frame-width:3px;"><div
                        class="AvatarRich__background"></div><img
                        src="${photo_100}"
                        class="AvatarRich__img"></span></div>
                <div class="vkuiHorizontalCell__content"><span
                        class="vkuiHorizontalCell__title vkuiCaption vkuiCaption--l-2">${first_name}</span></div>
                <span aria-hidden="true" class="vkuiTappable__hoverShadow"></span><span aria-hidden="true"
                                                                                        class="vkuiFocusVisible vkuiFocusVisible--inside"></span></a>
            </div>`
        mainHmtl += html
    }
    var endHtml = `        </div>        <div aria-hidden="true" class="vkuiSpacing" style="height: 4px;"></div>
                </div>
                <div class="vkuiGroup__separator vkuiSpacing" aria-hidden="true" style="height: 16px;"></div>
            </section>`

    mainHmtl += endHtml

    return mainHmtl
}


function sleepFor(sleepDuration) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) { /* Do nothing */
    }
}

function getId(id) {
    sleepFor(500)
    let xmlHttp = new XMLHttpRequest();

    let url = `${BASE_URL}/users.get?access_token=${TOKEN_ACCESS}&user_id=${id}&fields=is_closed&v=5.131`
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send(null);

    return JSON.parse(xmlHttp.responseText)['response'][0]
}

function getFriends(id) {
    sleepFor(400)
    let xmlHttp = new XMLHttpRequest();

    let url = `${BASE_URL}/friends.get?access_token=${TOKEN_ACCESS}&user_id=${id}&v=5.131`
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send(null);

    return JSON.parse(xmlHttp.responseText)['response']['items']
}

function getBanned() {
    sleepFor(400)
    let xmlHttp = new XMLHttpRequest();

    let url = `${BASE_URL}/account.getBanned?access_token=${TOKEN_USER}&count=50&v=5.131`
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send(null);

    return JSON.parse(xmlHttp.responseText)['response']['items']
}

function userDataGet(ids) {
    sleepFor(400)
    let xmlHttp = new XMLHttpRequest();
    let idString = ""
    ids.forEach(el => idString += `${el},`)

    idString = idString.substring(0, idString.length - 1)
    console.log(idString)
    let url = `${BASE_URL}/users.get?access_token=${TOKEN_ACCESS}&user_ids=${idString}&fields=is_closed,photo_100&v=5.131`
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send(null);

    return JSON.parse(xmlHttp.responseText)
}

function getUsersFromServer(id) {
    let xmlHttp = new XMLHttpRequest();
    let url = `http://localhost/usersCheck?id=${id}`
    xmlHttp.open("GET", url, false)
    xmlHttp.send(null)

    return JSON.parse(xmlHttp.responseText)
}

function getUsers(id) {
    if (id && id !== '') {
        let realId = getId(id)
        let isClosed = realId['is_closed']
        realId = realId['id']
        console.log(realId)
        let data = {'items': []}
        try {
            if (isClosed) {
                return 0
            }
            let friends = getFriends(realId)

            let bannedUsers = getBanned()
            let bannedIds = friends.filter(el => bannedUsers.includes(el))
            console.log(bannedIds)

            let userData = userDataGet(bannedIds)['response']
            userData.forEach(el => data['items'].add(el))
            console.log(userData)

            return data
        } catch (e) {
            console.log(e)
        }
    }
}

function Start() {
    var main = async function (id, items = [], inStorage = false) {
        try {
            if (!inStorage) {
                items = getUsers(id);
                sessionStorage.setItem(id, JSON.stringify(items))
            } else {
            }

            let html = htmlGetter(items)

            while (!document.querySelector("#profile_redesigned > div > div > div > div.vkuiSplitLayout.vkuiPopoutRoot > div > div.ScrollStickyWrapper > div")) {
                await new Promise(r => setTimeout(r, 500));
            }

            var d = document.querySelector("#profile_redesigned > div > div > div > div.vkuiSplitLayout.vkuiPopoutRoot > div > div.ScrollStickyWrapper > div")
            var res = new DOMParser().parseFromString(html, "text/html").body
            console.log(res.firstElementChild)
            d.insertBefore(res.firstElementChild, d.firstChild)
        } catch (e) {
            console.log(e)
        }
    }
    let notWork = ['https://vk.com/im', 'https://vk.com/im*', 'https://vk.com/groups', 'https://vk.com/friends', 'https://vk.com/feed', 'https://vk.com/audios*', 'https://vk.com/calls', 'https://vk.com/video', 'https://vk.com/market?ref=left_menu', "https://vk.com/settings"]

    if (notWork.some(substring => document.location.href.includes(substring))) {
        console.log('IF')
    } else {
        main()
    }
    var oldHref = document.location.href;

    window.onload = function () {
        const bodyList = document.querySelector("body");

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (notWork.some(substring => document.location.href.includes(substring))) {

                } else if (oldHref !== document.location.href) {
                    const id = window.location.href.split("/").pop()
                    oldHref = document.location.href;
                    const items = sessionStorage.getItem(id)

                    if (items === null) {
                        main(id)
                    } else {
                        main(id, JSON.parse(items), true)
                    }
                }
            });
        });

        var config = {
            childList: true, subtree: true
        };
        observer.observe(bodyList, config);
    };
}
var TOKEN_USER
var TOKEN_ACCESS

function main(token_user, token_access) {
    TOKEN_USER = token_user
    TOKEN_ACCESS = token_access
    console.log(TOKEN_USER)
    console.log(TOKEN_ACCESS)
    
    if (TOKEN_ACCESS !== null && TOKEN_USER !== null) {
        Start()
    }
}



