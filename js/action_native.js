/*
 Tag 1
 */
var input_account1 = document.getElementById("input_account_1");
var btn_search1 = document.getElementById("btn_search1");
var check_all = document.getElementById("input_checkbox");
var date_picker = document.getElementById("input_date");
var getAllDate = true;

check_all.addEventListener("click", function () {
    if (this.checked) {
        date_picker.disabled = true;
        getAllDate = true;
        if (input_account1.value == "") {
            btn_search1.disabled = true;
        } else {
            btn_search1.disabled = false;
        }
    } else {
        date_picker.disabled = false;
        getAllDate = false;
        if (date_picker.value != "" && input_account1.value != "") {
            btn_search1.disabled = false;
        } else {
            btn_search1.disabled = true;
        }
    }
})

input_account1.addEventListener("keyup", function () {
    if (getAllDate) {
        btn_search1.disabled = false;
    } else if (date_picker.value == "") {
        btn_search1.disabled = true;
    }
    if (input_account1.value == "") {
        btn_search1.disabled = true;
    }
})
date_picker.addEventListener("change", function () {
    if (input_account1.value == "") {
        btn_search1.disabled = true
    } else {
        btn_search1.disabled = false;
    }
})

btn_search1.addEventListener("click", function () {

})
/*
 Tag 2
 */
var input_account2 = document.getElementById("input_account_2");
var btn_search2 = document.getElementById("btn_search2");
var input_min_sup = document.getElementById("input_min_sup");
var input_min_length = document.getElementById("input_min_length");

input_account2.addEventListener("keyup", function () {
    validate_input();
})
input_min_sup.addEventListener("keyup", function () {
    validate_input();
})
input_min_length.addEventListener("keyup", function () {
    validate_input();
})

function validate_input() {
    if (input_account2.value == "" ||
        input_min_length.value == "" ||
        input_min_sup.value == "") {
        btn_search2.disabled = true;
    } else {
        btn_search2.disabled = false;
    }
}

btn_search1.addEventListener("click", function () {
    getTripAll();
})

/*
 Call API
 */
function getTripAll() {
    let url = new URL('http://localhost:8081/grid_map/trip/all')
    url.search = new URLSearchParams({
        account_id: 'jwsIcZEzaPUPYtQN8559y0QFYco2'
    })
    var promise = fetch(url);

    promise
        .then(function (response) {
            console.log(response);
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            return response.text();
        })
        .then(function (myText) {
            var myJSON = null;

            if(myText != null && myText.trim().length > 0)  {
                myJSON = JSON.parse(myText);
            }
            console.log("OK! JSON:");
            console.log(myJSON);
        })
        .catch(function(error)  {
            console.log("Noooooo! Something error:");
            console.log(error);
        });
}
function getTripDate() {
    let url = new URL('http://localhost:8081/grid_map/trip/date')
    url.search = new URLSearchParams({
        account_id: 'jwsIcZEzaPUPYtQN8559y0QFYco2',
        date: '2021-04-19'
    })
    var promise = fetch(url);

    promise
        .then(function (response) {
            console.log(response);
            if (!response.ok) {
                throw new Error("HTTP error, status = " + response.status);
            }
            return response.text();
        })
        .then(function (myText) {
            var myJSON = null;

            if(myText != null && myText.trim().length > 0)  {
                myJSON = JSON.parse(myText);
            }
            console.log("OK! JSON:");
            console.log(myJSON);
        })
        .catch(function(error)  {
            console.log("Noooooo! Something error:");
            console.log(error);
        });
}