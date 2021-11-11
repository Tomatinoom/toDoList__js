// $(function () {});
function createObj(arr) {
  return arr.reduce((combo, item) => {
    combo[item.name] = item.value;
    return combo;
  }, {});
}
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

const popupAdd = document.querySelector(".popup-add");
const popupForm = document.querySelector(".popup__form");
const popupFormInput = document.querySelector(".popup__form-input");
const popupUrgencyCheckboxAll = document.querySelectorAll(
  ".popup__form-urgency-checkbox "
);
const popupAddBtnCancel = document.querySelector(".popup__form__btn-cancel");
const popupAddBtnAccept = document.querySelector(".popup__form__btn-accept");

const popupAgreement = document.querySelector(".popup-agreement");
const popupAgreementBtnAccept = document.querySelector(
  ".popup-agreement__btn-accept"
);
const popupAgreementBtnCancel = document.querySelector(
  ".popup-agreement__btn-cancel"
);

const filterBTNS = document.querySelectorAll(".toDoList-top__filters-btn");
const btnAdd = document.querySelector(".toDoList-top__add__btn");
const btnDeleteList = document.querySelector(".toDoList-top__clear-list-btn");
const btnDeleteArchive = document.querySelector(
  ".toDoList-top__clear-archive-btn"
);

const toDoList = document.querySelector(".toDoList-list");
const taskListItems = document.getElementsByClassName("toDoList-list__item");
const preview = document.querySelector(".toDoList-list__item-preview");

const archiveList = document.querySelector(".archive__list");
const archiveListItem = document.getElementsByClassName("archive__list-item");
const archiveBtn = document.querySelector(".archive__btn");
let todos = [];
let completed = [];

const open = function (element) {
  return function (className) {
    return function () {
      element.classList.add(className);
      setTimeout(() => {
        popupFormInput.focus();
      }, 400);
    };
  };
};
const close = function (element) {
  return function (className) {
    return function () {
      element.classList.remove(className);
    };
  };
};
btnAdd.addEventListener("click", open(popupAdd)("popup-open"));
popupAddBtnCancel.addEventListener("click", close(popupAdd)("popup-open"));
popupAddBtnAccept.addEventListener("click", close(popupAdd)("popup-open"));

function toggleCheckbox(event) {
  popupUrgencyCheckboxAll.forEach((checkbox) => {
    checkbox.checked = false;
  });
  event.target.checked = true;
}
popupUrgencyCheckboxAll.forEach((checkbox) => {
  checkbox.addEventListener("click", () => {
    toggleCheckbox(event);
  });
});

function toggleStateOfArchive() {
  archiveList.classList.toggle("archive__list-open");
  archiveBtn.classList.toggle("archive__btn-active");
}

archiveBtn.addEventListener("click", toggleStateOfArchive);

function addUrgencyToItem(obj, valueOfKey) {
  switch (getKeyByValue(obj, valueOfKey)) {
    case "urgency-1":
      return "item-green";
      break;
    case "urgency-2":
      return "item-yellow";
      break;
    case "urgency-3":
      return "item-red";
      break;
    default:
      break;
  }
}

function createItemForToDoList(value, obj, valueOfKey) {
  const item = document.createElement("div");
  item.classList.add("toDoList-list__item");
  item.classList.add("item-all");
  item.classList.add(`${addUrgencyToItem(obj, valueOfKey)}`);
  const itemCheckbox = document.createElement("label");
  itemCheckbox.classList.add("item-label");
  itemCheckbox.insertAdjacentHTML(
    "afterbegin",
    `<input class="item-check"type="checkbox" onclick = сheckItem(event)>
    <span class="item-check-style"></span>`
  );
  const itemPopupMenu = document.createElement("div");
  itemPopupMenu.classList.add("toDoList__popup-menu");
  const itemMenu = document.createElement("button");
  itemMenu.classList.add("toDoList-list__item-menu");
  itemMenu.insertAdjacentHTML(
    "afterbegin",
    `<span class="toDoList-list__item-menu-span"></span>
      <span class="toDoList-list__item-menu-span"></span>
      <span class="toDoList-list__item-menu-span"></span>`
  );
  itemPopupMenu.append(itemMenu);
  const itemBtnDelete = document.createElement("button");
  itemBtnDelete.classList.add("toDoList-list__item-delete");
  itemBtnDelete.classList.add("btn-delete");
  itemBtnDelete.setAttribute("onclick", "removeItem(todos, event)");
  item.append(itemCheckbox);
  item.insertAdjacentHTML(
    "beforeend",
    `<p class="toDoList-list__item-text ${addUrgencyToItem(
      obj,
      valueOfKey
    )}">${value}</p>`
  );
  item.append(itemBtnDelete);
  return item;
}

function createItemForArchive(value) {
  const item = document.createElement("div");
  item.classList.add("archive__list-item");
  const itemCheckbox = document.createElement("label");
  itemCheckbox.classList.add("item-label");
  itemCheckbox.insertAdjacentHTML(
    "afterbegin",
    `<input class="item-check archive-checkbox" type="checkbox" checked>
    <span class="item-check-style archive-checkbox-style"></span>`
  );
  item.append(itemCheckbox);
  item.insertAdjacentHTML(
    "beforeend",
    `<p class="toDoList-list__item-text archive__list-item-text">${value}</p>`
  );
  return item;
}

function renderItemForToDoList(obj) {
  const item = createItemForToDoList(obj.item, obj, "on");
  toDoList.append(item);
}
function renderItemForArchive(obj) {
  let itemForArchive = createItemForArchive(obj.item);
  archiveList.prepend(itemForArchive);
  return itemForArchive;
}

function addToLocalStorage(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}
function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  return JSON.parse(value);
}

function toUpperCaseValue(value) {
  const valueTrim = value.trim();
  return valueTrim[0].toUpperCase() + valueTrim.slice(1);
}
function cleanForm() {
  popupFormInput.value = "";
  popupUrgencyCheckboxAll.forEach((checkbox) => {
    checkbox.checked = false;
  });
  popupUrgencyCheckboxAll[0].checked = true;
  popupAddBtnAccept.classList.remove("btn-active");
}
function disablBTN(event) {
  if (event.target.value.trim().length) {
    popupAddBtnAccept.removeAttribute("disabled");
  } else {
    popupAddBtnAccept.setAttribute("disabled", "disabled");
  }
}
popupFormInput.addEventListener("keyup", (event) => {
  disablBTN(event);
});

function isEmptyList() {
  if (taskListItems.length <= 0) {
    preview.classList.add("visible");
  } else preview.classList.remove("visible");
}

function acceptPopupForm(event) {
  event.preventDefault();
  const formObj = serialize(popupForm);
  const obj = createObj(formObj);
  obj.item = toUpperCaseValue(obj.item);
  setTimeout(cleanForm, 700);
  setTimeout(disablBTN, 700, event);
  todos.push(obj);
  addToLocalStorage("toDoList", todos);
  renderItemForToDoList(obj);
  isEmptyList();
}

popupAddBtnAccept.addEventListener("click", (event) => {
  acceptPopupForm(event);
});
popupForm.addEventListener("submit", (event) => {
  acceptPopupForm(event);
  close(popupAdd)("popup-open")();
});
popupAddBtnCancel.addEventListener("keydown", (event) => {
  if (event.code === "NumpadEnter") return false;
});
popupAdd.addEventListener("keydown", (event) => {
  if (event.code === "NumpadEnter" && popupFormInput.value.length > 0) {
    acceptPopupForm(event);
    close(popupAdd)("popup-open")();
  }
});
popupAdd.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    close(popupAdd)("popup-open")();
    cleanForm();
    disablBTN(event);
  }
});

function removeItemFromLocalStorage(arr, string) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].item === string) {
      arr.splice(i, 1);
    }
  }
}
function getCompletedItem(array, text) {
  let rez = array.filter((arr, i) => {
    if (arr.item == `${text}`) {
      const completedItem = array.splice(i, 1);
      return completedItem;
    }
  });
  return rez[0];
}

function removeItem(arr, event) {
  const itemText = event.target.previousElementSibling;
  const text = itemText.innerHTML;
  removeItemFromLocalStorage(arr, text);
  addToLocalStorage("toDoList", todos);
  itemText.parentElement.remove();
  isEmptyList();
}
function moveItemInLocalStorage(text) {
  const completedItem = getCompletedItem(todos, text);
  completed.push(completedItem);
  return completedItem;
}
function сheckItem(event) {
  const currentItem = event.target.parentElement.parentElement;
  currentItem.style.pointerEvents = "none";
  const itemText = event.target.parentElement.nextElementSibling;
  itemText.classList.add("toDoList-list__item-text-checked");
  const text = itemText.innerHTML;
  const completedItem = moveItemInLocalStorage(text);
  addToLocalStorage("toDoList", todos);
  addToLocalStorage("completed", completed);
  currentItem.classList.add("toDoList-list__item-checked");
  setTimeout(() => {
    currentItem.classList.add("opacity-0");
  }, 400);
  setTimeout(() => {
    currentItem.remove();
    isEmptyList();
    renderItemForArchive(completedItem);
  }, 500);
}

function deleteItems(list, key, storage) {
  [...list].forEach((item) => item.classList.add("opacity-0"));
  setTimeout(() => {
    while (list.length) {
      list[0].remove();
    }
    if (list === taskListItems) {
      isEmptyList();
    }
  }, 400);
  localStorage.removeItem(key);
  storage.splice(0, storage.length);
  popupAgreement.classList.remove("popup-open");
}
let whatShouldDelete;
btnDeleteList.addEventListener("click", open(popupAgreement)("popup-open"));
btnDeleteList.addEventListener(
  "click",
  () => (whatShouldDelete = "DeleteList")
);
btnDeleteArchive.addEventListener("click", open(popupAgreement)("popup-open"));
btnDeleteArchive.addEventListener(
  "click",
  () => (whatShouldDelete = "DeleteArchive")
);

popupAgreementBtnAccept.addEventListener("click", () => {
  if (whatShouldDelete === "DeleteList") {
    deleteItems(taskListItems, "toDoList", todos);
  }
  if (whatShouldDelete === "DeleteArchive") {
    deleteItems(archiveListItem, "completed", completed);
  }
});

popupAgreementBtnCancel.addEventListener(
  "click",
  close(popupAgreement)("popup-open")
);

function hideItem(item) {
  setTimeout(function () {
    item.classList.add("opacity-0");
    setTimeout(function () {
      item.classList.add("filter-hide");
    }, 200);
  }, 300);
}
function filterToDoList(item, btn) {
  setTimeout(function () {
    const category = btn.dataset.filter;
    const itemCategory = item.classList.contains(`${category}`);
    setTimeout(function () {
      if (itemCategory) {
        item.classList.remove("filter-hide");
        setTimeout(function () {
          item.classList.remove("opacity-0");
        }, 100);
      }
    }, 200);
  }, 300);
}

function filter(btn) {
  const filterItems = document.getElementsByClassName("toDoList-list__item");
  [...filterItems].forEach((item) => {
    hideItem(item);
    filterToDoList(item, btn);
  });
}

filterBTNS.forEach((btn) => {
  btn.addEventListener("click", () => filter(event.target));
});

function loadApp() {
  if (localStorage.getItem("toDoList")) {
    const dataToDoList = getLocalStorage("toDoList");
    todos = dataToDoList;
    dataToDoList.map((item) => renderItemForToDoList(item));
    isEmptyList();
  } else return;
  if (localStorage.getItem("completed")) {
    const dataCompleted = getLocalStorage("completed");
    completed = dataCompleted;
    dataCompleted.map((item) => {
      renderItemForArchive(item);
    });
  } else return;
}
loadApp();
