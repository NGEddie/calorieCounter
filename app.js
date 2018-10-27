//Storage Controller


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
    items: [
      // {id: 0, name: 'Steak Dinner', calories: 1200},
      // {id: 1, name: 'Cookie', calories: 400},
      // {id: 2, name: 'Eggs', calories: 300}
    ],
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
    totalCalories: '.total-calories'
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
    
  }

})();



//App Controller
const App = (function (ItemCtrl, UICtrl) {

  //Load event listners
  const loadEventListners = () => {
    const UISelectors = UICtrl.getSelectors();

    //Add Item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

    //Edit Item Click
    document.querySelector(UISelectors.itemList).addEventListener('click',itemUpdateSubmit);
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

      //Clear Fields
      UICtrl.clearInput();
    }    
    e.preventDefault();
  }

  const itemUpdateSubmit = (e) => {
    
    if (e.target.classList.contains('edit-item')) {
      //Get List Item ID
      const listId = e.target.parentNode.parentNode.id;
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);
      
      const itemToEdit = ItemCtrl.getItemByID(id);
      
      ItemCtrl.setCurrentItem(itemToEdit);
      UICtrl.addItemToForm();
      
    }
    e.preventDefault
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
    
})(ItemCtrl, UICtrl);




App.init();
