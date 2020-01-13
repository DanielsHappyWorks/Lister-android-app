var app = {
    storageKey: "CFTYSXUABUXTFEDYAGNJIXIAJOMJXKAHUISDHGYTFAVF",

    initialize: function () {
        this.bindEvents();
    },

    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function () {
        app.storage = window.localStorage;

        if (app.storage.getItem(app.storageKey)) app.categories = app.storage.getItem(app.storageKey).split(",");

        app.setContent();
    },

    addToCategories: function (name) {
        if (app.categories) {
            var index = app.categories.indexOf(name);
            if (index == -1 && name != "") {
                app.categories.push(name);
                app.storage.setItem(app.storageKey, app.categories);
                app.storage.setItem(name, []);
                document.getElementById('content').insertAdjacentHTML('beforeend', app.getCategoryItem(name, "", 0));
                document.getElementById(app.storageKey + '_cat_input').value = "";
            } else {
                console.log("Already Exists")
            }
        } else {
            app.categories = [];
            app.categories.push(name);
            app.storage.setItem(app.storageKey, app.categories);
            app.storage.setItem(name, []);
            document.getElementById('content').insertAdjacentHTML('beforeend', app.getCategoryItem(name, "", 0));
            document.getElementById(app.storageKey + '_cat_input').value = "";
        }
    },

    removeFromCategories: function (name) {
        var index = app.categories.indexOf(name);
        if (index !== -1) {
            app.categories.splice(index, 1);
            app.storage.setItem(app.storageKey, app.categories);
            app.storage.removeItem(name);
            var elm = document.getElementById(app.storageKey + name + '_delete');
            elm.parentNode.removeChild(elm);
        } else {
            console.log("NOT Exists")
        }
    },

    addToList: function (name, value) {
        var list = app.storage.getItem(name);
        if (list) {
            var list = app.storage.getItem(name).split(",");
            var index = list.indexOf(value);
            if (index == -1 && value != "") {
                list.push(value);
                app.storage.setItem(name, list);
                document.getElementById(app.storageKey + name + '_add').insertAdjacentHTML('beforebegin', app.getListItem(name, value));
                document.getElementById(app.storageKey + name + '_item').value = "";
                document.getElementById(app.storageKey + name + '_count').innerHTML = "("+list.length+")";
            } else {
                console.log("Already Exists")
            }
        } else {
            app.storage.setItem(name, [value]);
            document.getElementById(app.storageKey + name + '_add').insertAdjacentHTML('beforebegin', app.getListItem(name, value));
            document.getElementById(app.storageKey + name + '_item').value = "";
            document.getElementById(app.storageKey + name + '_count').innerHTML = "(1)";
        }
    },

    removeFromList: function (name, value) {
        var list = app.storage.getItem(name).split(",");
        var index = list.indexOf(value);
        if (index !== -1) {
            list.splice(index, 1);
            app.storage.setItem(name, list);
            var elm = document.getElementById(name + "-" + value);
            elm.parentNode.removeChild(elm);
            document.getElementById(app.storageKey + name + '_count').innerHTML = "("+list.length+")";
        } else {
            console.log("NOT Exists")
        }
    },

    setContent: function () {
        var content = document.getElementById("content");
        var template = "";
        app.categories.forEach(element => {
            var itemsAsDOM = ""
            var itemList = app.storage.getItem(element);
            var count = 0;
            if (itemList) {
                var itemList = app.storage.getItem(element).split(",");
                itemList.forEach(lm => {
                    itemsAsDOM += app.getListItem(element, lm);
                });
                count = itemList.length;
            }
            template += app.getCategoryItem(element, itemsAsDOM, count);
        });
        content.innerHTML = template;
    },

    triggerCollapse: function (ctx, element) {
        content = document.getElementById(element);
        ctx.classList.toggle("active");
        if (content.style.display == "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    },

    getListItem: function (element, lm) {
        return `<div class="list" id="${element + "-" + lm}">
                    <span>${lm}</span>
                    <button class="list-btn" onclick="app.removeFromList('${element}', '${lm}')">X</button>
                </div>`;
    },

    getCategoryItem: function (element, itemsAsDOM, count) {
        return `<div id='${app.storageKey + element}_delete'>
                    <button type="button" class="collapsible" onclick="app.triggerCollapse(this, '${element}')">${element} <span id="${app.storageKey + element}_count">(${count})</span></button>
                    <button class="collapsible-del" onclick="app.removeFromCategories('${element}')">X</button>
                    <div class="content" id='${element}'>
                        ${itemsAsDOM}
                          <div class="add" id='${app.storageKey + element}_add'>
                          <center>
                            <input id='${app.storageKey + element}_item' placeholder="Add List Item" type="text">
                            <button class="myButton" onclick="app.addToList('${element}', document.getElementById('${app.storageKey + element}_item').value)">Add</button>
                            </center>
                          </div>
                    </div>
                </div>`;
    }
};
