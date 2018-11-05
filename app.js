//Storage Controller
const StorageCtrl = (() => {
  

  return {

    storeItem: (item) => {
      let items
      //check if any items
      if (localStorage.getItem('items')=== null) {
        items = [];
        //push new item
        items.push(item);
        //set local storage
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        //push new items
        items.push(item);
        //reset new item
        localStorage.setItem('items',JSON.stringify(items));
      }
    },

    getItemsFromStorage: () => {
      let items;

      if (localStorage.getItem('items')===null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }

      return items;
    },

    updateItemStorage: (updatedItem) => {
      let items = StorageCtrl.getItemsFromStorage();

      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index,1, updatedItem);
        }
      });

      localStorage.setItem('items',JSON.stringify(items));

    },

    deleteItemFromStorage: (id) => {
      let items = StorageCtrl.getItemsFromStorage();

      items.forEach((item, index) => {
        if(id === item.id){
          items.splice(index,1);
        }
      });
      localStorage.setItem('items',JSON.stringify(items));
    },
    clearAllItemsFromStorage: () => {
      localStorage.removeItem('items');
    }
  }
})();

//Item Controller
const ItemCtrl = (function(){
  //Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //Data Structure/ State
  const data = {
    // items: [
    //   // {id: 0, name: 'Steak Dinner', calories: 1200},
    //   // {id: 1, name: 'Cookie', calories: 400},
    //   // {id: 2, name: 'Eggs', calories: 300}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  return{

    getItems: function () {
      return data.items;
    },

    addItem:(name, calories) => {
      let ID;
      
      //createID
      if (data.items.length >0) {
        ID = data.items[data.items.length -1].id +1;
      }else{
        ID = 0;
      }

      calories = parseInt(calories);
      //create new item
      newItem = new Item(ID,name, calories);
      data.items.push(newItem);
      return newItem;      
    },

    getTotalCalories: () => {
      let total = 0;
      
      data.items.forEach((item) => {
        total += item.calories;
      });

      data.totalCalories = total;
      return data.totalCalories;
    },

    getItemByID: (id) => {
      let found = null;
      
      data.items.forEach(item => {
        if (item.id === id) {
          found = item;
        }
      });
      return found 
    },

    setCurrentItem: (item) => {
      data.currentItem = item;
    },

    getCurrentItem: () => {
      return data.currentItem  
    },

    logData: function () {
      return data;
    },

    updateItem: (name, calories) => {
      // turn calories to number
      calories = parseInt(calories);

      let found = null;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        } 
      })
      return found;
    },

    deleteItem: (id) => {
      //getIds
      ids = data.items.map(item => item.id);
      const index = ids.indexOf(id);

      //remove item
      data.items.splice(index,1);
    },

    clearAllItems: () => {
      data.items = [];
    }
  }

})();




//UI Controller
const UICtrl = (function(){

  const UISelectors={
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    listItems: '#item-list li',
    clearAllBtn: '.clear-btn'
  }

  return{
    populateItemlist: function (items) {
      let html = '';

      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a>
      </li>`;        
      });      

      //insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getSelectors: () => {
      return UISelectors
    },
    getItemInput: () => {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: (item) => {
      document.querySelector(UISelectors.itemList).style.display= 'block';
      
      let html = `<li class="collection-item" id="item-${item.id}">
      <strong>${item.name}: </strong><em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a>
    </li>`;
      //Insert Item
      document.querySelector(UISelectors.itemList).insertAdjacentHTML('beforeend',html);
    },
    clearInput: () => {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    hidelist: () => {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: (totalCalories) => {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState: () => {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    addItemToForm: () => {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    showEditState: () => {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    updateListItem: (updatedItem) => {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //turn node list intoarray
      listItems = Array.from(listItems);

      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute('id');
        if (itemID === `item-${updatedItem.id}`) {
          document.querySelector(`#item-${updatedItem.id}`).innerHTML= `<li class="collection-item" id="item-${updatedItem.id}">
          <strong>${updatedItem.name}: </strong><em>${updatedItem.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="fa fa-pencil edit-item"></i></a>
        </li>`;
        }
      });
    },

    deleteListItem: (id) => {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    removeItems: () => {
      let listItems = document.querySelectorAll(UISelectors.listItems);    
      listItems = Array.from(listItems);
      listItems.forEach(item => item.remove());
    }
    
  }

})();



//App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {

  //Load event listners
  const loadEventListners = () => {
    const UISelectors = UICtrl.getSelectors();

    //Add Item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

    document.querySelector(UISelectors.addBtn).addEventListener('keypress',(e) => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    //Edit Item Click
    document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);

    //Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);

    //Back btn event
    document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);

    //delete btn event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);

    //clearall btn event
    document.querySelector(UISelectors.clearAllBtn).addEventListener('click', clearAllClick);

    
  }

  //Add item Submit
  const itemAddSubmit= (e) => {
    //get form input from UI Controller
    const input = UICtrl.getItemInput();
    
    if (input.name !== '' && input.calories !== '') {
      //Add item to Data
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      //Add item to UI
      UICtrl.addListItem(newItem);

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to ui
      UICtrl.showTotalCalories(totalCalories);

      // store in local storage
      StorageCtrl.storeItem(newItem);

      //Clear Fields
      UICtrl.clearInput();
    }    
    e.preventDefault();
  }

  const itemEditClick = (e) => {
    
    if (e.target.classList.contains('edit-item')) {
      //Get List Item ID
      const listId = e.target.parentNode.parentNode.id;
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);
      
      const itemToEdit = ItemCtrl.getItemByID(id);
      
      ItemCtrl.setCurrentItem(itemToEdit);
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  }

  const itemUpdateSubmit = (e) => {
    //get item input
    const input = UICtrl.getItemInput();

    //Update item in data
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //Update item UI
    UICtrl.updateListItem(updatedItem);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to ui
    UICtrl.showTotalCalories(totalCalories);
    //Update LocalStorage
    StorageCtrl.updateItemStorage(updatedItem);
    
    
    UICtrl.clearEditState();

    e.preventDefault();
  }

  const itemDeleteSubmit = (e) => {
    
    //get current item
    const currentItem = ItemCtrl.getCurrentItem();
    //delete from data
    ItemCtrl.deleteItem(currentItem.id);
    //delete from UI
    UICtrl.deleteListItem(currentItem.id);
    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to ui
    UICtrl.showTotalCalories(totalCalories);
    // Delete Item from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id)
    //clear edit state
    UICtrl.clearEditState();
    
    e.preventDefault();
  }

  const clearAllClick = (e) => {
    // Clear All Items from data
    ItemCtrl.clearAllItems();

    //Clear Items from UI
    UICtrl.removeItems();

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to ui
    UICtrl.showTotalCalories(totalCalories);
    //Clear all items from storage
    StorageCtrl.clearAllItemsFromStorage();
    //clear edit state
    UICtrl.clearEditState();
    //hide the list
    UICtrl.hidelist();

    e.preventDefault();
  }

  return {
    init: function(){
      //Clear edit state /set initial set
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      //Check if any items
      if (items.length === 0) {
        UICtrl.hidelist();
      } else {
        //Populate List with Items
        UICtrl.populateItemlist(items);   
      }
      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // add total calories to ui
      UICtrl.showTotalCalories(totalCalories);

      //Load Event Listeners
      loadEventListners();
    }
  }
    
})(ItemCtrl,StorageCtrl ,UICtrl);




App.init();
