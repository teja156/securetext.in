/**
DOCUMENTATION


GLOBAL VARIABLES : 
password - Holds the password of the site at any given point of time.
site_url - Holds the name of the site, it is extracted from the URL as soon as a URL is loaded in the browser.
initHash - This is the SHA512 hash of the initial decrypted content. This is calculated as soon as the site is succesfully decrypted with a password. It is used by the server to authorize changes made to the site(save, reload, change password, delete)
newHash - The SHA512 hash of the modified text in the site. Used to make further updates to site.
seperator - The SHA512 of the string "~~~~~~~~tabseperate~~~~~~~~". It is used to seperate text by tabs.


EVENT LISTENERS : 
"#create-btn".click() - Triggers when Create site button is clicked. Checks if both passwords match and if they do, it calls initLoadLayout()
"#decrypt-btn".click() - Triggers when decrypt button is clicked. Updates variable 'password' to the  password entered by the user, then calls downloadSite(loadSite)
"#save-btn".click() - Triggers when Save button is clicked. Calls saveSite()
"#reload-btn".click() - Triggers when Reload button is clicked. Calls downloadSite(reloadSite)
"#change-password-btn".click() - Triggers when change password button is clicked. Shows the change password modal. 
"#change-password-confirm-btn".click() - Sets variable 'password' to the new password entered by the user in the modal. Checks if the re-entered password matches, and then calls saveSite(). Then hides the modal.
"#delete-btn".click() - Alerts the user if they really want to delete the site, and then calls deleteSite() if they confirm.


FUNCTIONS : 

initLoadLayout()
{
    sends ajax to /load_layout
    updates the body of the webpage with the response received
}

loadLayout(text)
{
    sends ajax request to /load_layout
    updates the body of the webpage with the response receieved
    populateTabs(text,seperate)
}

saveSite()
{
    collects all the text from all the tabs by calling collectText()
    calculate initHash or newHash (whichever is required)
    encrypt the collected text
    send ajax post request to /save_site with encryptedtext, initHash and newHash
}


*/


var password=""
var site_url = window.location.pathname;
var initHash = "";
var newHash = "";
site_url = site_url.substr(1,site_url.length-2)
var seperator = "acdcc9e377db73f8b3ae141353015db7c8141a659c465cb3f42ed93e3727e8d5ff4743c887a6816821789df7914749a1ff722455b26057b6058011f3ba8886b5";
var unsaved = false;
var salt = "~~securetext.in~~"; //stay safe from rainbow tables
var initialText = "";
// var initialPassword = password;

window.onbeforeunload = function(){
  if(unsaved==true)
  {
    return 'Changes you made might not be saved';
  }
};

$(document).on('click', '#create-btn', function() {
    // console.log("create btn trigg");

	password = document.getElementById("password-field").value;
	var confirm_password = document.getElementById("confirmpassword-field").value;

	if((password!=confirm_password) || (password==""))
	{
		alert("Passwords must match");
	}
	else
	{

		initLoadLayout();
	}
	
});


$(document).on('click', '.save-btn', function() {
    $.LoadingOverlay("show");
    saveSite();
    unsaved = false;
    $.LoadingOverlay("hide");
});

$(document).on('click', '.reload-btn', function() {
  //loadLayout(reloadSite);
  $.LoadingOverlay("show");
  downloadSite(reloadSite); //download cipher and decrypt it
  $.LoadingOverlay("hide");
});

$(document).on('click', '.decrypt-btn', function() {
  //decrypt
  $.LoadingOverlay("show");
  password = document.getElementById("password-field").value;
  downloadSite(loadSite);
  $.LoadingOverlay("hide");

});

//change-password-btn
$(document).on('click', '.change-password-btn', function() {
  //re encrypt the text with the new password, and then send to server
  // console.log("change password");
  $("#change-password").modal('show');
});


$(document).on('click', '.delete-btn', function() {
    var sitename = prompt("Are you sure you want to delete this site? If you confirm, please type in the site name(without slashes) and click OK");
    if(sitename==site_url)
    {
        deleteSite();
    }
    else
        alert("Site name doesn't match.");
  
});

//change-password-confirm-btn -> button inside the modal
$(document).on('click', '#change-password-confirm-btn', function() {
  //re encrypt the text with the new password, and then send to server
  var password_tmp = document.getElementById("new-password").value;
  var confirm_password = document.getElementById("new-password-confirm").value;
  if(password_tmp!=confirm_password || password_tmp=="")
  {
    alert("Passwords do not match");
  }
  else
  {
    //rencrypt and send to server
    password = password_tmp;
    saveSite(supressWarning=true);
  }
  $("#change-password").modal('hide');
});


function initLoadLayout()
{
    $.ajax(
            {
                type:"GET",
                url: "/load_layout/",
                data:{                
                         
                },
                success: function( respData ) 
                {
                    document.getElementsByTagName("html")[0].innerHTML = respData;

                    // console.log("layout loaded");

                },
                error: function (jqXHR, status, err) {
                    alert("Local error callback.");
                    return "error";
                  }
             });
}

function loadLayout(text)
{
	$.ajax(
            {
                type:"GET",
                url: "/load_layout/",
                data:{                
                         
                },
                success: function( respData ) 
                {
                    document.getElementsByTagName("html")[0].innerHTML = respData;

                    // console.log("layout loaded");

                    populateTabs(text,seperator);

                },
                error: function (jqXHR, status, err) {
                    alert("Communication with server failed.");
                    return "error";
                  }
             });
}


function saveSite(supressWarning=false)
{

    if(initialText == collectText() && !supressWarning)
    {
        alert("No changes made to the text");
        return;
    }
    

	//Collect text from all the tabs
	var allText = collectText();
    // console.log("collected text : "+allText);

    //encrypt the text
    var eContent = CryptoJS.AES.encrypt(allText,password).toString();

    if(allText=="")
    {
        //show alert that empty text site will be deleted
        var conf = confirm("No text is stored on this site, this will automatically delete your site from our server. Do you want to continue?");
        if(!conf)
        {
            return;
        }
        else
        {
            eContent = "";
        }
    }

    
    if(initHash=="")
    {
        //new site
        // initHash = CryptoJS.SHA512(allText + CryptoJS.SHA512(password).toString()).toString();
        initHash = CryptoJS.SHA512(salt+password).toString();
        newHash = initHash;
        // console.log("Computed new hash");
    }

    else
    {
        // newHash = CryptoJS.SHA512(allText + CryptoJS.SHA512(password).toString()).toString();
        newHash = CryptoJS.SHA512(salt+password).toString();

    }    
	
	$.ajax(
            {
                type:"POST",
                url: "/save_site/",
                data:{
                	site_url: site_url,
                	cipher : eContent,
                	initHash : initHash,
                    newHash : newHash,
                },
                success: function( respData ) 
                {
                	respData = JSON.stringify(respData)
                	respData = JSON.parse(respData)
                    // console.log(respData);
                	if(respData.status=='success')
                	{
                		$.toast({
						    heading: 'Success',
						    text: 'Saved succesfully!',
						    showHideTransition: 'slide',
						    icon: 'success'
						});

                        //Update initHash to newHash

                        initHash = newHash;
                	}
                    else if(respData.status=='deleted')
                    {
                        //Site deleted because empty text is attempted to be saved
                        $.toast({
                            heading: 'Success',
                            text: 'Site deleted!',
                            showHideTransition: 'slide',
                            icon: 'success'
                        });
                        setTimeout(function(){ window.location.href = "/"; }, 2000);

                    }
                	else
                	{
                		$.toast({
						    heading: 'Error',
						    text: 'Save failed!',
						    showHideTransition: 'fade',
						    icon: 'error'
						});
                	}
                    

                },
                error: function (jqXHR, status, err) {
                    $.toast({
                            heading: 'Error',
                            text: 'Save failed!',
                            showHideTransition: 'fade',
                            icon: 'error'
                        })

                    
                    
                  }
             });

}

function reloadSite(cipher)
{
	
    var text = decryptContent(cipher,password);
    // console.log("decrypted : "+text);
    if(text=="")
    {
        $.toast({
                heading: 'Error',
                text: "Couldn't reload",
                showHideTransition: 'slide',
                icon: 'error'
            });
        location.reload();
    }
    else
    {
        $.toast({
                heading: 'Success',
                text: 'Reloaded successfully!',
                showHideTransition: 'slide',
                icon: 'success'
            });
        loadLayout(text);
        
    }
}


async function loadSite(cipher)
{
    //load encypted content and decrypt it

    
    var text = decryptContent(cipher,password);
    
    if(text=="")
        {
            $("#error").modal('show');
        }
    else
    {
        //loadlayout
        // console.log("Decrypted : "+text);
        loadLayout(text);
    }

    
}


async function downloadSite(callback)
{

    $.ajax(
            {
                type:"POST",
                url: "/load_site/",
                data:{  
                    site_url : site_url,
       
                },
                success: function( respData ) 
                {
                    respData = JSON.stringify(respData);
                    respData = JSON.parse(respData);
                    // console.log("cipher response : "+respData.cipher);
                    // console.log("password : "+password);
                    //return respData.cipher;
                    callback(respData.cipher)
                },
                error: function (jqXHR, status, err) {
                    //alert("Couldn't download ecrypted site from the server");
                    //return "";
                    callback("error");
                  }
             });

}


function decryptContent(cipher,password)
{
    // console.log("decrypting "+cipher+" with "+password);
	try
	{
		var text = CryptoJS.AES.decrypt(cipher,password).toString(CryptoJS.enc.Utf8).trim();
        initialText = text;
        //calculate initHash content value
        // initHash = CryptoJS.SHA512(text + CryptoJS.SHA512(password).toString()).toString();
        initHash = CryptoJS.SHA512(salt+password).toString();
        // console.log("decryptedContent: "+text);
		return text
	}
	catch(err)
	{
        // console.log(err.toString());
		return ""
	}

	
}

function deleteSite()
{
    $.ajax(
            {
                type:"POST",
                url: "/delete_site/",
                data:{  
                    site_url : site_url,
                    initHash : initHash
                },
                success: function( respData ) 
                {
                    respData = JSON.stringify(respData);
                    respData = JSON.parse(respData);
                    if(respData.status=='success')
                    {
                        $.toast({
                        heading: 'Success',
                        text: "Site deleted!",
                        showHideTransition: 'slide',
                        icon: 'success'
                    });

                    setTimeout(function(){ window.location.href = "/"; }, 2000);

                    
                    }
                    else
                    {
                        $.toast({
                        heading: 'Error',
                        text: "Couldn't delete the site",
                        showHideTransition: 'slide',
                        icon: 'error'
                    });
                    }
                },
                error: function (jqXHR, status, err) {
                    $.toast({
                        heading: 'Error',
                        text: "Couldn't delete the site",
                        showHideTransition: 'slide',
                        icon: 'error'
                    });
                  }
             });
}


function setUnsavedChanges(status)
{
    unsaved = status;
}