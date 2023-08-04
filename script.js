const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const itemList = document.querySelector("#item-list");
const clearAllItemsButton = document.querySelector('#clear');
const itemFilter = document.querySelector('#filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems(){
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.forEach((item) => addItemToDom(item));
    checkUi();
}

function getItemFromStorage(){
    let itemsFromStorage;

    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    }
    else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

// adding new iem list
function submitForm(e){
    e.preventDefault();

    // Get individual item
    const formData = new FormData(itemForm);
    const newItem = formData.get('item');

    //validate input
    if(newItem.length < 1){
        alert("Please add an item!");
        return;
    }

    //check for edit mode
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false
    }
    else{
        if(checkIfItemExists(newItem)){
            alert("That item already exists!");
            return;
        }
    }

    //add new item to dom
    addItemToDom(newItem);

    //save in local storage
    addToLocalStorage(newItem);

    itemInput.value = "";
    checkUi();
}

function addToLocalStorage(newItem){
    const itemsFromStorage = getItemFromStorage();

    //add new item to arrey
    itemsFromStorage.push(newItem);

    //convert to JSON and set to local storage
    const str = JSON.stringify(itemsFromStorage);
    localStorage.setItem('items',str);
}

function addItemToDom(newItem){
    //get list item
    const newLi = createListItem(newItem);
    
    //add the list item to the list
    itemList.appendChild(newLi);
}

function createListItem(newItem){
    //create list item
    const newLi = document.createElement('li');
    newLi.textContent = newItem;
    
    //get the remove button
    const removeItemButton = createRemoveItemButton();
    
    //add the remove button to the list item
    newLi.appendChild(removeItemButton);
    return newLi;
}

function createRemoveItemButton(){
    //create remove button item
    const removeItemButton = document.createElement('button');
    removeItemButton.className = 'remove-item btn-link text-red';
    
    //get the remove icon 
    const xIcon = createRemoveIcon();
    
    //add the icon to the button
    removeItemButton.appendChild(xIcon);
    return removeItemButton;
}

function createRemoveIcon(){
    //create icon for remove button 
    const xIcon = document.createElement('i');
    xIcon.className = 'fa-solid fa-xmark';
    return xIcon;
}

//delete item
function deleteItem (itemLi) {
    if(confirm('Are you sure?')){
        //remove item from DOM
        itemLi.remove();

        //remove form local storage
        removeItemFromStorage(itemLi.textContent);
        checkUi();
    }
};

function removeItemFromStorage(item){
    let itemsFromStorage = getItemFromStorage();
    
    //filter items storage 
    itemsFromStorage = itemsFromStorage.filter((i) => item !== i);

    //re-set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function setItemToEdit(item){
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) =>{
        i.classList.remove('edit-mode');
    })

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        deleteItem(e.target.parentElement.parentElement);
    }
    else{
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item){
    const itemsFromStorage = getItemFromStorage();
    return itemsFromStorage.includes(item);
}

//delete all items
function deleteItems () {
    if(confirm('Are you sure?')){
        const items = itemList.querySelectorAll('li');
        items.forEach((li) => li.remove());
        localStorage.removeItem('items');
        checkUi();
    }
}

//filter items
function filterItems(e){
    const text = e.target.value.toLowerCase() 
    const items = itemList.querySelectorAll('li');
    items.forEach((li) => {
        const itemName = li.firstChild.textContent.toLowerCase();
        //hide item
        if(itemName.indexOf(text) != -1){
            li.style.display = 'flex';
        }
        //show item
        else{
            li.style.display = 'none';
        }
    })
}

//reset the ui
function checkUi(){
    itemInput.value = "";

    const items = itemList.querySelectorAll('li');
    if(items.length === 0){
        //hide clear all button
        clearAllItemsButton.style.display = 'none';
        //hide filter
        itemFilter.style.display = 'none';
    }
    else{
        //display clear all button
        clearAllItemsButton.style.display = 'block';
        //display filter
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

//initalize App
function initalizeApp(){
    // Event Listeners

    //submit form
    itemForm.addEventListener('submit', submitForm);

    //delete item
    itemList.addEventListener('click', onClickItem);

    //delete all items
    clearAllItemsButton.addEventListener('click', deleteItems);

    //filter input
    itemFilter.addEventListener('input', filterItems);

    //Dom content loaded
    document.addEventListener('DOMContentLoaded', displayItems);

    //page load
    checkUi();
}

initalizeApp();
