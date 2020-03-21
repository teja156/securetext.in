function newTab()
{
    var tabs = document.getElementById("tabs-area");
    
    //first create text area.
    var newtextarea= document.createElement("textarea");
    var tabnum = tabNumber();
    newtextarea.setAttribute("id","tab-"+tabnum);
    newtextarea.setAttribute("class","border rounded form-control-lg actual-textarea tab-pane fade");
    newtextarea.setAttribute("spellcheck","true");
    newtextarea.setAttribute("wrap","soft");
    newtextarea.setAttribute("maxlength","100000");
    newtextarea.setAttribute("placeholder","Write your text here...new tab");
    document.getElementsByClassName("tab-content")[0].appendChild(newtextarea);
    
    
    //create tab
    var newtab = document.createElement("li");
    newtab.setAttribute("class","nav-item");
    var link = document.createElement("a");
    link.setAttribute("role","tab");
    link.setAttribute("data-toggle","tab");
    link.setAttribute("class","nav-link");
    link.setAttribute("href","#tab-"+tabnum);
    link.innerHTML = "Tab"+tabnum;
    newtab.appendChild(link);
    
    document.getElementsByClassName("nav nav-tabs")[0].appendChild(newtab);
    
    console.log("New tab created succesfully.");
    
}

function tabNumber()
{
    var tabcount = document.getElementsByClassName("nav nav-tabs")[0].getElementsByTagName("li").length;
    return tabcount+1;
}
