var jsfiles = ["net.js"];//, "net.js", "worm.js"];
function initjs(){
    // load script
    var script = document.createElement("script");
    script.src = "../js/"+jsfiles[Math.floor(Math.random()*jsfiles.length)];
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
}
initjs();
