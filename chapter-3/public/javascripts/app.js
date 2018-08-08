
$(document).ready(function(){
  $('#btnDelete').on('click', function(){
    alert('clicked')
  })


  
  $("#add").on('click', function(){
    var id = Math.ceil(Math.random(0,1) * 10000)
    console.log(id)
    // // Posting Data
    var newItem = {
      "currency": $(".currency").val(),
      "price": $(".price").val(),
      "itemId": id,
      "itemName": $(".name").val(),
      "categories":[]
    }
    $.ajax({
      url: "http://localhost:3000/catalog/v2",
      type: 'POST',
      dataType: "json",
      data: newItem,
      success: function(data, status, xhr){
        if( status === 'success'){
          console.log( data )
          console.log( xhr )
        }
        $('input[type="text"]').val("")
      },
      error: function(xhr, options, error){
        console.log("ERROR", error)
      }
    })
  })
  
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
      .then( function(){
        addDeleteAction();
        console.log('ACTION')
      })
      .fail(function(xhr, options, error){
        console.log("ERROR")
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