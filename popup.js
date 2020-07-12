const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const statusInput = document.querySelector("#myList");


function storeSettings() {
  browser.storage.local.set({
    authCredentials: {
      username: usernameInput.value,
      password: passwordInput.value,
      status: statusInput.value
    }
  });
}

function updateUI(restoredSettings) {
  usernameInput.value = restoredSettings.authCredentials.username || "";
  passwordInput.value = restoredSettings.authCredentials.password || "";
  statusInput.value = restoredSettings.authCredentials.status || "1";
}

function onError(e) {
  console.error(e);
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

usernameInput.addEventListener("blur", storeSettings);
passwordInput.addEventListener("blur", storeSettings);
statusInput.addEventListener("blur", storeSettings);

function checkStoredSettings(restoredSettings) {
  username = restoredSettings.authCredentials.username;
  password = restoredSettings.authCredentials.password;
  status = restoredSettings.authCredentials.password;
}

function getPage(){
  browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
      return tabs[0].url;
  })
}

document.querySelector("#sendurl").onclick = function () {
  browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
      mangaurl = tabs[0].url;
      validurls=[".*://mangadex[.]org/title/",".*://mangadex[.]org/chapter/",
      ".*://jaiminisbox[.]com/reader/",".*://sensescans[.]com/reader/",
      ".*://leviatanscans[.]com/comics/",".*://hatigarmscanz[.]net/comics/",
      ".*://zeroscans[.]com/comics/","helveticascans[.]com/r/series/",
      "helveticascans[.]com/r/read/",".*://kireicake[.]com",
      ".*://reader.deathtollscans[.]net","kkjscans[.]co/comics/",
      ".*://the-nonames[.]com/comics/",".*://edelgardescans[.]com/comics/",
      "secretscans[.]co/comics/",".*://reaperscans[.]com/comics/"];
      for (i=0;i<=validurls.length-1;i++) {
        re = new RegExp(validurls[i]);
        if (re.test(mangaurl) == true){
          var xmlHttp = new XMLHttpRequest();
          const gettingStoredSettings = browser.storage.local.get();
          gettingStoredSettings.then(function (restoredSettings) {
            username = restoredSettings.authCredentials.username;
            password = restoredSettings.authCredentials.password;
            status = restoredSettings.authCredentials.status;
            loginapi = "https://api.kenmei.co/api/v1/sessions/";
            xmlHttp.open("POST", loginapi, false);
            hp1 = "Content-Type";
            hp2 = "application/json";
            xmlHttp.setRequestHeader(hp1 ,hp2);
            params = {user:{email:username, password:password, remember_me:false}};
            console.log(params);
            xmlHttp.send(JSON.stringify(params));
            console.log(xmlHttp);
            resp = JSON.parse(xmlHttp.responseText);
            apicode = resp.access;
            mangaapi = "https://api.kenmei.co/api/v1/manga_entries/";
            xmlHttp.open("POST", mangaapi, false);
            h1 = "Authorization";
            hp1 = "Content-Type";
            hp2 = "application/json";
            xmlHttp.setRequestHeader(hp1 ,hp2);
            xmlHttp.setRequestHeader(h1, apicode);
            params = {"manga_entry":{"series_url":mangaurl,"status":status}};
            console.log(params);
            xmlHttp.send(JSON.stringify(params));
            console.log(xmlHttp);
          }, onError);
        }
      }
    }
  )}
document.querySelector("#button").onclick = function () {
  document.querySelector('#account').style.display = 'block';
  document.querySelector('#main').style.display = 'none';
}
