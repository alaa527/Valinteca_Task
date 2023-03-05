const  cartBtn=document.querySelector(".cart-btn")
const  closeCartBtn=document.querySelector(".close-cart")
const  cartDom=document.querySelector(".cart")
const  cartOverlay=document.querySelector(".cart-overlay")
const  cartItems=document.querySelector(".cart-items")
const  cartTotal=document.querySelector(".cart-total")
const  cartContent=document.querySelector(".cart-content")
const  productsDom=document.querySelector(".products-center")
var close=document.getElementById("close")

// cart
let cart=[]
let buttonsDom=[]
// getting the products
async function getProducts() {
    try{
        let res = await fetch(".././products.json");
         data = await res.json();
      
        let prod=data.items;
        prod=prod.map(item=>{
          const {product_name,product_price,product_image,added_to_cart}=item.fields;
          const {id}=item.sys;
          return {product_name,product_price,product_image,added_to_cart,id}
        })
       return prod ;
    }
  catch(err){
    console.log(err)
  }
  }

 
// display products
 async function display(){ 
  var allproducts=await getProducts()
  var allDivs = ``;
    for( var i=0; i <allproducts.length ; i++ )
    {
    

        allDivs +=`
        
        <article class="product" data-name="p-1">
        <div class="img-container">
            <img src=`+JSON.stringify(allproducts[i].product_image)+` alt="product" class="product-img">
        
        </div>
        <div class="product-content">
        <h3>`+JSON.stringify(allproducts[i].product_name)+`</h3>
        <h4> $`+JSON.stringify(allproducts[i].product_price)+`</h4>
        <button class="bag-btn" id=`+JSON.stringify(allproducts[i].id)+`>  <i class="fa-solid fa-cart-shopping"></i> add to cart</button>
        <button class="view-btn" id=`+JSON.stringify(allproducts[i].id)+`> <i class="fa-solid fa-eye"></i> quick view</button>
  
    </div>
    </article>
    `
    
    }
 
    productsDom.innerHTML = allDivs;
    //get quick view
    let preveiwcontainer=document.querySelector('.popUpGBA')
    // let previewBox=preveiwcontainer.querySelectorAll('.popUpChild');
    document.querySelectorAll('.products-center .product .view-btn').forEach(p=>{
      p.onclick=()=>{
        var r=p.getAttribute('id');
    
        getpopUp(r);
  
      }
    })
    function getpopUp(r){
      preveiwcontainer.style.visibility="visible";
      var currentsrc=allproducts[r-1].product_image;
      var currenth3=allproducts[r-1].product_name;
      var currenth4=allproducts[r-1].product_price;
      document.querySelector('.banner-img').setAttribute("src", currentsrc);
      document.querySelector('.banner-h3').innerHTML=currenth3;
      document.querySelector('.banner-h4').innerHTML=`$`+currenth4;
    }
    
    // Close POPUp 
    close.addEventListener("click",hidePopUp)
    function hidePopUp(){
      preveiwcontainer.style.visibility="hidden";
    }
      //get all bag btn 

    const buttons=[...document.querySelectorAll(".bag-btn")]
    buttonsDom=buttons;
    buttons.map(btn=>{
       let id=btn.id;
  let incart=cart.find(item=>item.id===id)
  //if that item will be in cart
 
  if(incart){
    btn.innerText="remove from cart";
    btn.disabled=true;
  }
  else{
    btn.addEventListener('click',(event)=>{
      // console.log("e",event)
      event.target.innerText="remove from cart";
      event.target.disabled=true;
      //get product from products
    let cartItem={...getproductLocalStorage(id),amount:1};

      //add product to cart with old products which exist in cart 
      cart=[...cart,cartItem]
      //save cart in localstorage
      savecart(cart);
      //set cart values
      setCartValues(cart);
      //display cart item
      addCartItem(cartItem);
     
    })
  }
    })
    }
    function setCartValues(cart){
      let tempTotal=0;
      let itemsTotal=0;
      cart.map(item=>{
    
        tempTotal+=item.product_price*item.amount;
        itemsTotal+=item.amount;
      })

      cartTotal.innerText=parseFloat(tempTotal.toFixed(2));
      cartItems.innerText=itemsTotal;
      
     }
     function addCartItem(item){
const div=document.createElement('div')
div.classList.add('cart-item')
div.innerHTML=`  <img src=${item.product_image} alt="product">
<div>
<h4>${item.product_name} </h4>
<h5>$${item.product_price}</h5>
<span class="remove-item" id=${item.id} >remove</span>
<hr></hr>
</div>
<div>

<i class="fa-solid fa-chevron-up" id=${item.id} ></i>
<p class="item-amount">${item.amount} </p>
<i class="fa-solid fa-chevron-down" id=${item.id}></i>

</div>

`

cartContent.appendChild(div);

     }
    
     function showCart(){
      cartOverlay.classList.add('transparentBcg')
      cartDom.classList.add('showCart')
    }
    function hideCart(){
      cartOverlay.classList.remove('transparentBcg')
      cartDom.classList.remove('showCart')
    }
    function setUpApp(){
   cart=getCart();
   setCartValues(cart)
   populateCart(cart)
  cartBtn.addEventListener("click",function(){
    showCart();
   })
   closeCartBtn.addEventListener("click",function(){
    hideCart();
   })
  }
  function cartLogic(){
    cartContent.addEventListener("click",event=>{
      if(event.target.classList.contains('remove-item')){
        let removeItem=event.target;
        let id=removeItem.id;
        cartContent.removeChild(removeItem.parentElement.parentElement)
        removeItems(id); 
      }
      else if(event.target.classList.contains('fa-chevron-up')){
        let addAmount=event.target;
        let id=addAmount.id;
       let tempItem=cart.find(item=>item.id===id)
       tempItem.amount=tempItem.amount+1;
       setCartValues(cart);
       savecart(cart);
       addAmount.nextElementSibling.innerText=tempItem.amount;
      }
      else if(event.target.classList.contains('fa-chevron-down')){
        let decreseAmount=event.target;
        let id=decreseAmount.id;
       let tempItem=cart.find(item=>item.id===id)
       tempItem.amount=tempItem.amount-1;
       if(tempItem.amount >0)
       {setCartValues(cart);
       savecart(cart);
       decreseAmount.previousElementSibling.innerText=tempItem.amount;
      }
      else{
        cartContent.removeChild(decreseAmount.parentElement.parentElement)
        removeItems(id); 
      }
       
      }
    })
    
     }
     function removeItems(id){
      cart=cart.filter(item=>item.id!==id)
      setCartValues(cart);
      savecart(cart);
      let button=getSingleButton(id);
      button.disabled=false;
      button.innerHTML=`<i class="fa-solid fa-cart-shopping"></i> add to cart`

     }
     function getSingleButton(id){
     return buttonsDom.find(b=>b.id===id)
     }

  function populateCart(cart){
cart.map(item=>addCartItem(item))
  }  
// local storage
async function saveproducts(){
  var allproducts=await getProducts()

localStorage.setItem("products",JSON.stringify(allproducts))
 }
function savecart(cart){
localStorage.setItem("cart",JSON.stringify(cart))
 }

 function getCart(){
 return localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[]
   }
//get the product we clicked on from products localstorage
function getproductLocalStorage(id){
  let products=JSON.parse(localStorage.getItem("products"))
  return products.find(obj=>obj.id===id);


 }

 setUpApp()
  getProducts();
  display();
  saveproducts();
cartLogic();

