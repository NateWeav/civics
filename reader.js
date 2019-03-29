

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

function updateByQueryValues() {
    if (getQueryParam('audio') == 'silent') {
        $("body").addClass('silent');
    } else {
        $("body").addClass('audio');
    }
    if (forceLeft) {
        $("body").addClass('left');
    } else if (forceRight) {
        $("body").addClass('right');
    } else if (getQueryParam('page') == 'right') {
        $("body").addClass('right');
    } else {
        $("body").addClass('left');
    }
}


function goto(dst) {
    var element = $("#player");
    element.get(0).pause();
    if (getQueryParam('audio') == 'silent') {
        if (dst.indexOf('?') == -1) {
            dst = dst + "?";
        } else {
            dst = dst + "&";
        }
        dst = dst + "audio=silent";
    }
    window.location.rel = "external";
    window.location.href = dst;
}

