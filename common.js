
function ajaxLogin(username, password, successUrl, failureUrl) {
    $.post({
        url: "/api/login.php",
        data: { site: getSite(), username: username, password: password},
        dataType: "json",
        success : function (data) {
            if (data == "") {
                if (failureUrl == false) {
                    $("body").show();
                    $(".error").show();
                } else {
                    window.location = "/account/login.html";
                }
            } else {
                clearGroupToken();
                setUserToken(data);
                ajaxGetSigned(data, successUrl);
            }
        }
    });
}

function ajaxGetSigned(token, url) {
    $.get({
        url: "/api/getsigned.php",
        data: { host: window.location.hostname, site: getSite(), token: token},
        dataType: "json",
        success : function (data) {
            data.forEach(setCookie);
            window.location = addRandomKey(url);
        }
    });
}

function setQueryParam(url, name, value) {
    if (url.indexOf('?') == -1) {
        url = url + "?";
    } else {
        url = url + "&";
    }
    url = url + name + "=" + value;
    return url;
}

function getQueryParam(name) {
    var hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        if (hash[0] == name) {
            return hash[1];
        }
    }
    return false;
}

function getSite() {
    var parts = window.location.hostname.split(".");
    if (parts.length < 1) {
        return "";
    }
    var site = parts[0];
    if (site.substr(0,4) == "cdn-") {
        site = site.substr(4);
    }
    return site;
}

function getUserToken() {
    var site = getSite();
    if (site == false) {
        return "";
    }
    var name = site;
    var token = Cookies.get(name);
    if (token == null) {
        return "";
    }
    return token;
}

function setUserToken(value) {
    var site = getSite();
    if (site == false) {
        return;
    }
    var name = site;
    Cookies.set(name, value);
}

function getGroupToken() {
    var site = getSite();
    if (site == false) {
        return "";
    }
    var name = site + "-groups";
    var token = Cookies.getJSON(name);
    if (token == null) {
        return "";
    }
    return token;
}

function setGroupToken(value) {
    var site = getSite();
    if (site == false) {
        return;
    }
    var name = site + "-groups";
    Cookies.set(name, value);
}

function clearGroupToken() {
    var site = getSite();
    if (site == false) {
        return;
    }
    var name = site + "-groups";
    Cookies.remove(name);
}

function setCookie(item, index) {
    Cookies.set(item['name'], item['value'], { path: item['path']});
}

function hasTooManyRedirects() {
    var allowedRedirects = 5;
    var allowedDuration = 10000;  // milliseconds
    var time = new Date().getTime();
    var redirects = Cookies.get('redirects');
    if (redirects == null) {
        redirects = [];
    } else {
        redirects = JSON.parse(redirects);
    }
    if (!Array.isArray(redirects)) {
        redirects = [];
    }
    redirects.push(time);

    var oldTime = 0;
    while (redirects.length > allowedRedirects) {
        oldTime = redirects.shift();
    }

    Cookies.set('redirects', redirects);

    if ( (time - oldTime) < allowedDuration) {
        return true;
}

    return false;
}

function addRandomKey(url) {
    var randomValue = Math.floor(Math.random() * 1000000000);
    return setQueryParam(url, "rs", randomValue);
}