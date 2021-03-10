const formdata = $("#formdata"); //id for form
const datatable = $("#datatable");//id for tbody

//retrieves documents
function render(doc) {
    datatable.append(`<tr id="${doc.id}">
    <td><a class="btn btn-sm btn-light" name="select" href ="javascript:void(0)" id="${doc.id}">Select</a></td>
    <td><a class="btn btn-sm btn-danger" name="delete" href ="javascript:void(0)" id="${doc.id}">Delete</a></td>
    <td>${doc.data().title}</td>
    <td>${doc.data().author}</td>
    <td>${doc.data().isbn}</td>
    <td>${doc.data().genre}</td>
    <td>${doc.data().publication_date}</td>
    <td>${doc.data().book_size}</td>
    <td>${doc.data().delivery_address}</td>
    <td>${doc.data().supplier}</td>
    <td>${doc.data().contact}</td>
    <td>${doc.data().date}</td>
    </tr>`)


    //when button with name delete is clicked, delete the document
    $("[name = 'delete']").click((e) => {
        e.stopImmediatePropagation();
        var id = e.target.id;
        db.collection('inventories').doc(id).delete();
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Order deleted!',
            showConfirmButton: false,
            timer: 1500
        })
    })

    //when button with name edit is clicked, retrieve the data and send to form
    $("[name = 'select']").click((e) => {
        e.stopImmediatePropagation();
        var id = e.target.id;
        db.collection('inventories').doc(id).get().then(doc => {
            $('#title').val(doc.data().title);
            $('#author').val(doc.data().author);
            $('#isbn').val(doc.data().isbn);
            $('#genre').val(doc.data().genre);
            $('#publication_date').val(doc.data().publication_date);
            $('#book_size').val(doc.data().book_size);
            $('#supplier').val(doc.data().supplier);
            $('#contact').val(doc.data().contact);
            $('#delivery_address').val(doc.data().delivery_address);
            $('#document').val(doc.id);
        })
    })
}
//when button with id edit is clicked, edit the ORDER
$('#update').on('click', () => {
    var id = $('#document').val();
    db.collection('inventories').doc(id).set({
        title: $("#title").val(),
        author: $("#author").val(),
        isbn: $("#isbn").val(),
        genre: $("#genre").val(),
        publication_date: $("#publication_date").val(),
        book_size: $("#book_size").val(),
        supplier: $("#supplier").val(),
        contact: $("#contact").val(),
        delivery_address: $("#delivery_address").val(),
        date: Date()
    }, {
        merge: true
    })
    $("#title").val("");
    $("#author").val("");
    $("#isbn").val("");
    $("#genre").val("");
    $("#publication_date").val("");
    $("#book_size").val("");
    $("#supplier").val("");
    $("#contact").val("");
    $("#delivery_address").val("");
    $("#document").val("");
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Book edited successfully!',
        showConfirmButton: false,
        timer: 1500
    })
})


//real time rendering of data
db.collection('inventories').orderBy('title').onSnapshot(snapshot => {
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
