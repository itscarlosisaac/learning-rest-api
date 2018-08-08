
$(document).ready(function(){
  $('#btnDelete').on('click', function(){
    alert('clicked')
  })


  // // Posting Data
  // var newItem = {
  //   "currency": "USD",
  //   "price": 564,
  //   "itemId": 5442,
  //   "itemName": "Sport FrontEnd",
  //   "categories":[
  //     "Main", "Watches"
  //   ]
  // }
  // $.ajax({
  //   url: "http://localhost:3000/catalog/v2",
  //   type: 'POST',
  //   dataType: "json",
  //   data: newItem,
  //   success: function(data, status, xhr){
  //     if( status === 'success'){
  //       console.log( data )
  //       console.log( xhr )
  //     }
  //   },
  //   error: function(xhr, options, error){
  //     console.log("ERROR", error)
  //   }
  // })

    // $.ajax({
    //   contentType:'application/json',
    //   url: 'http://localhost:3000/catalog/v2',
    //   type: 'GET',
    //   success: function( data, status, xhr ){
    //     if( status === 'success'){
    //       console.log(data)
    //       data.docs.map(  (item) => {
    //         var { itemName, itemId, price, currency, categories } = item
    //         $('#dataTable tbody').append(
    //           $(`
    //             <tr id="${itemId}">
    //               <td>${itemName}</td>
    //               <td>${categories.join(' | ')}</td>
    //               <td>${price}</td>
    //               <td> ${currency}</td>
    //               <td><input type="button" class="delete" value="Delete" data-id=${itemId} /></td>
    //             </tr>
    //           `)
    //         )
    //       })
    //     }
    //   },
    //   error: function(xhr, options, error){
    //     console.log("ERROR")
    //   },
    //   done: function(){
    //     addDeleteAction();
    //     console.log('ACTION')
    //   }
    // })
    $.ajax({
      contentType:'application/json',
      url: 'http://localhost:3000/catalog/v2',
      type: 'GET'
    })
    .done( function( data, status, xhr ){
      if( status === 'success'){
        console.log(data)
        data.docs.map(  (item) => {
          var { itemName, itemId, price, currency, categories } = item
          $('#dataTable tbody').append(
            $(`
              <tr id="${itemId}">
                <td>${itemName}</td>
                <td>${categories.join(' | ')}</td>
                <td>${price}</td>
                <td> ${currency}</td>
                <td><input type="button" class="delete" value="Delete" data-id=${itemId} /></td>
              </tr>
            `)
          )
        })
        }
      })
      // error: function(xhr, options, error){
      //   console.log("ERROR")
      // },
      .then( function(){
        addDeleteAction();
        console.log('ACTION')
      })
    


    var addDeleteAction = function() {
      $('.delete').on('click', function(){
        var id = this.dataset.id
        console.log(id)
          $.ajax({
            contentType:'application/json',
            url: `http://localhost:3000/catalog/v2/item/${id}`,
            type: 'DELETE',
            success: function( data, status, xhr ){
              if( status === 'success'){
                console.log("deleted")
                console.log(data)
              }
            },
            error: function(xhr, options, error){
              console.log("ERROR", error)
            }
          })
      })
    }
})