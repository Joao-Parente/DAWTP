createPath = (dados) => {

    hashtag = dados.hashtags.split(",");
    //verifica se o nome para a pasta é válido
    if (hashtag[0].match(/^(\w+\_?)*\w+$/)) {
        var dest = 'fileStore/' + hashtag[0] + '/';
    }
    else {
        var dest = 'fileStore/others/';
    }
    return dest;
}
module.exports.createPath = createPath;