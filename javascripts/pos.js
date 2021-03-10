const datatable = $("#datatable");

function render(doc) {


    datatable.append(`<tr id="${doc.id}">
    <td><a class="btn btn-sm btn-light" name="select" href ="javascript:void(0)" id="${doc.id}">Select</a></td>
    <td>${doc.data().title}</td>
    <td class="fw-bold" style="color:white; background-color: #7ca8cc">Php ${doc.data().selling_price.toFixed(2)}</td>
    <td class="fw-bold" style="color:white; background-color: #5584ab">${doc.data().available} pcs</td>
    
    </tr>`)

    //transfers the value of an title in the form field
    $("[name = 'select']").click((e) => {
        e.stopImmediatePropagation();
        var id = e.target.id;
        db.collection('inventories').doc(id).get().then(doc => {
            $('#title').val(doc.data().title);
            $('#selling_price').val(doc.data().selling_price);
            $('#document').val(doc.id);
        })
    })

}
//if btnsubmit is clicked, update the inventories
$('#btnsubmit').on('click', () => {
    var id = $('#document').val();
    db.collection('inventories').doc(id).set({
        quantity_sold: firebase.firestore.FieldValue.increment($("#quantity_sold").val()),
        available: firebase.firestore.FieldValue.increment(-parseFloat($("#quantity_sold").val())),//decrements + update the stocks in inventory
        sales: firebase.firestore.FieldValue.increment(parseFloat($("#sum").val()).toFixed(2))
    }, {
        merge: true
    })
    $("#document").val("");

    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'New purchase was made!',
        showConfirmButton: false,
        timer: 1500
    })
    db.collection('sales').add({
        title: $("#title").val(),
        selling_price: $("#selling_price").val(),
        quantity_sold: $("#quantity_sold").val(),
        sum: $("#sum").val(),
        date: Date()
    })
    $("#title").val("");
    $("#selling_price").val("");
    $("#quantity_sold").val("");
    $("#sum").val("");
    $("#document").val("");
})




db.collection('inventories').orderBy('total').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == "added") {
            render(change.doc);
        } else if (change.type == "removed") {
            var id = change.doc.id;
            $('#' + id).remove();
        }
        else if (change.type == "modified") {
            var id = change.doc.id;
            $('#' + id).remove();
            render(change.doc);
        }
    })
})
