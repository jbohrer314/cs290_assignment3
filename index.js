/*
 * Write your client-side JS code in this file.  Don't forget to include your
 * name and @oregonstate.edu email address below.
 *
 * Name: Jackson Bohrer
 * Email: bohrerja@oregonstate.edu
 */


/* Functionality for modal */
function modal_appear() { // Make modal appear on site
    var modal_backdrop = document.getElementById("modal-backdrop")
    var sell_something_modal = document.getElementById("sell-something-modal")
    modal_backdrop.classList.remove("hidden")
    sell_something_modal.classList.remove("hidden")
}

function modal_hide() { // Hide modal from site
    var modal_backdrop = document.getElementById("modal-backdrop")
    var sell_something_modal = document.getElementById("sell-something-modal")
    modal_backdrop.classList.add("hidden")
    sell_something_modal.classList.add("hidden")
    modal_clear()
}

function modal_clear() { // Clear all content from modal
    document.getElementById("post-text-input").value = ""
    document.getElementById("post-photo-input").value = ""
    document.getElementById("post-price-input").value = ""
    document.getElementById("post-city-input").value = ""
    document.getElementById("post-condition-new").checked = true
}

// Opening modal from add post button
var add_post_button = document.getElementById("sell-something-button")
add_post_button.addEventListener("click", modal_appear)

// Closing modal from cancel buttons
var close_modal_buttons = document.getElementsByClassName("modal-hide-button")
for (i of close_modal_buttons) {
    i.addEventListener("click", modal_hide)
}




/* Adding post to site */
function completed_modal() { // Checks if modal is properly filled out
    if (document.getElementById("post-text-input").value === "") {
        return false
    }
    else if (document.getElementById("post-photo-input").value === "") {
        return false
    }
    else if (document.getElementById("post-price-input").value === "") {
        return false
    }
    else if (document.getElementById("post-city-input").value === "") {
        return false
    }
    else {
        return true
    }
}

function get_post_vals () { // Get all post value content
    var post_vals = []
    post_vals.push(document.getElementById("post-text-input").value)
    post_vals.push(document.getElementById("post-photo-input").value)
    post_vals.push(document.getElementById("post-price-input").value)
    post_vals.push(document.getElementById("post-city-input").value)

    for (i of document.getElementsByName("post-condition")) {
        if (i.checked === true) {
            post_vals.push(i.value)
            break
        }
    }

    return post_vals
 }

function add_post(post_content) { // Adds new post to the DOM
    var posts = document.getElementById("posts")

    var post_container = document.createElement("div")
    post_container.classList.add("post")
    post_container.dataset.price = post_content[2]
    post_container.dataset.city = post_content[3]
    post_container.dataset.condition = post_content[4]
    posts.appendChild(post_container)

    var content_container = document.createElement("div")
    content_container.classList.add("post-contents")
    post_container.appendChild(content_container)

    var image_container = document.createElement("div")
    image_container.classList.add("post-image-container")
    content_container.appendChild(image_container)

    var image = document.createElement("img")
    image.src = post_content[1]
    image.alt = post_content[0]
    image_container.appendChild(image)

    var info_container = document.createElement("div")
    info_container.classList.add("post-info-container")
    content_container.appendChild(info_container)

    var link = document.createElement("a")
    link.href = "#"
    link.classList.add("post-title")
    link.text = post_content[0]
    info_container.appendChild(link)

    var price = document.createElement("span")
    price.classList.add("post-price")
    price.textContent = "$" + post_content[2]
    info_container.appendChild(price)

    var city = document.createElement("span")
    city.classList.add("post-city")
    city.textContent = "(" + post_content[3] + ")"
    info_container.appendChild(city)

    post_list = get_post_items()

    // Adding new city to drop down menu
    var city_options = document.getElementById("filter-city")
    var city_list = [...city_options.options].map(i => i.value)
    if (!city_list.includes(post_content[3])) {
        var new_city = document.createElement("option")
        new_city.text = post_content[3]
        city_options.appendChild(new_city)
    }
}

function post_content() { // Decides if modal is filled out properly before adding to DOM
    if (completed_modal()) {
        add_post(get_post_vals())
        modal_hide()
    }
    else {
        alert("Please completley fill out the form to add a new post")
    }
}

// Adding post from modal buttons
var publish_post_button = document.getElementById("modal-accept")
publish_post_button.addEventListener("click", post_content)




/* Functionality for post filtering */
function get_filter_vals() { // Gets all filter content 
    var filter_text = document.getElementById("filter-text").value
    var filter_min_price = document.getElementById("filter-min-price").value
    var filter_max_price = document.getElementById("filter-max-price").value
    var filter_city = document.getElementById("filter-city").value

    var filter_items = document.getElementsByName("filter-condition")
    var filter_condition = []
    filter_items.forEach(function(item) {
        if (item.checked) {
            filter_condition.push(item.value)
        }
    })
    
    return {
        filter_text,
        filter_min_price,
        filter_max_price,
        filter_city,
        filter_condition
    }
}

function get_post_items() { // Gets all post objects
    return document.querySelectorAll(".post")
}

function compare_item_to_filter(item, filter_values) { // Compares filter values to post values
    if (filter_values.filter_text) { // Filtering by text content
        var filter = filter_values.filter_text.toLowerCase()
        var text = item.getElementsByClassName("post-title")[0].text.toLowerCase()
        if (!text.includes(filter)) {
            return false
        }
    }
    if (filter_values.filter_min_price) { // Filtering by min price
        var min_price = filter_values.filter_min_price
        var price = item.dataset.price
        if (+price < +min_price) {
            return false
        }
    }
    if (filter_values.filter_max_price) { // Filtering by max price
        var max_price = filter_values.filter_max_price
        var price = item.dataset.price
        if (+price > +max_price) {
            return false
        }
    }
    if (filter_values.filter_city) { // Filtering by city
        var filter_city = filter_values.filter_city
        var city = item.dataset.city
        if (filter_city != city) {
            return false
        }
    }
    if (filter_values.filter_condition.length > 0) { // Filtering by condition
        var condition = item.dataset.condition
        if (!filter_values.filter_condition.includes(condition)) {
            return false
        }
    }
    return true
}

function apply_filters(post_list) {
    var current_filter_vals = get_filter_vals()

    // Removing all posts from DOM
    post_list.forEach(i => i.remove())

    // Adding approved posts back to DOM
    var post_container = document.getElementById("posts")
    post_list.forEach(function(i) {
        if (compare_item_to_filter(i, current_filter_vals)) {
            post_container.appendChild(i)
        }
    })
}

// Adding update filters button
var post_list = get_post_items()
var filter_update_button = document.getElementById("filter-update-button")
filter_update_button.addEventListener("click", function() {apply_filters(post_list)})
